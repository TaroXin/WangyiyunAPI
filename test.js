
// 加载 express 模块
var app = require('express')();
// 加载 superagent 模块
var request = require('superagent');
// 加载 cheerio 模块
var cheerio = require('cheerio');

// 指定访问路由
app.get('/', function(req, res){

    // 请求网易云音乐主页
    request.get('http://music.163.com')
        .end(function(err, _response){

            if (!err) {

                // 如果没有发生错误, 获得的html就是网页返回的HTML结构
                var html = _response.text;
                // cheeio 初始化完成之后与 jQuery 用法相差无几
                var $ = cheerio.load(html);
                // 打印 iframe
                console.log( 'iframe内部结构:' + $('#g_iframe').html() );

                res.send('Hello');

            } else {
                return next(err);
            }

        });

});

// 监听3000 端口
app.listen(3000, function(){
    console.log('Server start!');
});