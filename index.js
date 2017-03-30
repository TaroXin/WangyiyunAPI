/**
 * 示例文件
 */

// 初始化 express
var app = require('express')();

// 初始化 superagent 模块
var request = require('superagent');

/**
 * 开启路由
 * 第一个参数指定路由地址,当前指向的是 localhost:3000/
 * 如果需要其他路由,可以这样定义,比如 需要我们的获取推荐歌单的路由 /recommendLst
 * app.get('/recommendLst', function(req, res){});
 */
app.get('/', function(req, res){

    // 向请求 localhost:3000/ 的地址返回 Hello World 字符串
    res.send('Hello World !');

});

app.get('/test', function(req, res){

    request.get('http://localhost:3000/')
        .end(function(err, _response){

            if (!err) {

                // 如果获取过程中没有发生错误
                var result = '获取到的数据:'+_response.text;

                console.log(result);
                res.send(result);


            } else {
                console.log('Get data error !');
            }

        });

});

// 加载 cheerio 模块
var cheerio = require('cheerio');

app.get('/testCheerio', function(req, res){

    var $ = cheerio.load('<h1 id="test">这是一段示例文字</h1>');

    $('#test').css('color','red');

    res.send( $.html() );

});

// express 开放 /recommendLst API
app.get('/recommendLst', function(req, res){

    // 初始化返回对象
    var resObj = {
        code: 200,
        data: []
    };

    // 使用 superagent 访问 discover 页面
    request.get('http://music.163.com/discover')
        .end(function(err, _response){

            if (!err) {

                // 请求成功
                var dom = _response.text;

                // 使用 cheerio 加载 dom
                var $ = cheerio.load(dom);
                // 定义我们要返回的数组
                var recommendLst = [];
                // 获得 .m-cvrlst 的 ul 元素
                $('.m-cvrlst').eq(0).find('li').each(function(index, element){

                    // 获得 a 链接
                    var cvrLink = $(element).find('.u-cover').find('a');
                    console.log(cvrLink.html());
                    // 获得 cover 歌单封面
                    var cover = $(element).find('.u-cover').find('img').attr('src');
                    // 组织单个推荐歌单对象结构
                    var recommendItem = {
                        id: cvrLink.attr('data-res-id'),
                        title: cvrLink.attr('title'),
                        href: 'http://music.163.com' + cvrLink.attr('href'),
                        type: cvrLink.attr('data-res-type'),
                        cover: cover
                    };
                    // 将单个对象放在数组中
                    recommendLst.push(recommendItem);

                });

                // 替换返回对象
                resObj.data = recommendLst;

            } else {
                resObj.code = 404;
                console.log('Get data error !');
            }

            // 响应数据
            res.send( resObj );

        });

});

// 定义根据歌单id获得歌单详细信息的API
app.get('/playlist/:playlistId', function(req, res){

    // 获得歌单ID
    var playlistId = req.params.playlistId;
    // 定义返回对象
    var resObj = {
        code: 200,
        data: {}
    };

    /**
     * 使用 superagent 请求
     * 在这里我们为什么要请求 http://music.163.com/playlist?id=${playlistId}
     * 简友们应该还记得 网易云音乐首页的 iframe
     * 应该还记得去打开 调试面板的 Sources 选项卡
     * 那么就可以看到在歌单页面 iframe 到底加载了什么 url
     */
    request.get(`http://music.163.com/playlist?id=${playlistId}`)
        .end(function(err, _response){

            if (!err) {
                // 定义歌单对象
                var playlist = {
                    id: playlistId
                };

                // 成功返回 HTML, decodeEntities 指定不把中文字符转为 unicode 字符
                // 如果不指定 decodeEntities 为 false , 例如 " 会解析为 &quot;
                var $ = cheerio.load(_response.text,{decodeEntities: false});
                // 获得歌单 dom
                var dom = $('#m-playlist');
                // 歌单标题
                playlist.title = dom.find('.tit').text();
                // 歌单拥有者
                playlist.owner = dom.find('.user').find('.name').text();
                // 创建时间
                playlist.create_time =  dom.find('.user').find('.time').text();
                // 歌单被收藏数量
                playlist.collection_count = dom.find('#content-operation').find('.u-btni-fav').attr('data-count');
                // 分享数量
                playlist.share_count = dom.find('#content-operation').find('.u-btni-share').attr('data-count');
                // 评论数量
                playlist.comment_count = dom.find('#content-operation').find('#cnt_comment_count').html();
                // 标签
                playlist.tags = [];
                dom.find('.tags').eq(0).find('.u-tag').each(function(index, element){
                    playlist.tags.push($(element).text());
                });
                // 歌单描述
                playlist.desc = dom.find('#album-desc-more').html();
                // 歌曲总数量
                playlist.song_count = dom.find('#playlist-track-count').text();
                // 播放总数量
                playlist.play_count = dom.find('#play-count').text();

                resObj.data = playlist;

            } else {
                resObj.code = 404 ;
                console.log('Get data error!');
            }

            res.send( resObj );

        });


});


// 定义根据歌单id获得歌单所有歌曲列表的API
app.get('/song_list/:playlistId', function(req, res){

    // 获得歌单ID
    var playlistId = req.params.playlistId;
    // 定义返回对象
    var resObj = {
        code: 200,
        data: []
    };

    request.get(`http://music.163.com/playlist?id=${playlistId}`)
        .end(function(err, _response){

            if (!err) {

                // 成功返回 HTML
                var $ = cheerio.load(_response.text,{decodeEntities: false});
                // 获得歌单 dom
                var dom = $('#m-playlist');

                resObj.data = JSON.parse( dom.find('#song-list-pre-cache').find('textarea').html() );

            } else {
                resObj.code = 404 ;
                console.log('Get data error!');
            }

            res.send( resObj );

        });


});

/**
 * 开启express服务,监听本机3000端口
 * 第二个参数是开启成功后的回调函数
 */
var server = app.listen(3000, function(){
    // 如果 express 开启成功,则会执行这个方法
    var port = server.address().port;

    console.log(`Express app listening at http://localhost:${port}`);
});

