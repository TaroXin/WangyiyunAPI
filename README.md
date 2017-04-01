## 网易云 API

Step 1 :
```
npm install
```

Step 2 :
```
node index
```

Step 3 :
```
http://localhost:3000/recommendLst
http://localhost:3000/playlist/:playlistId
http://localhost:3000/song_list/:playlistId
```


以下地址为测试API, 仅供测试, 不推荐直接使用, API随时会变化, 想要使用请直接Fork或者下载代码到本地运行
```
// 获得推荐歌单列表
http://wymusic.butterfly.mopaasapp.com/recommend_list
// 根据歌单ID 获得歌单详细信息
http://wymusic.butterfly.mopaasapp.com/play_list/361904088
// 根据歌单ID 获得歌单歌曲列表
http://wymusic.butterfly.mopaasapp.com/song_list/361904088
// 获取首页轮播图列表
http://wymusic.butterfly.mopaasapp.com/banner_list
// 获取网易云音乐排行榜列表
http://wymusic.butterfly.mopaasapp.com/top_list
// 根据歌曲ID获得歌曲详细信息
http://wymusic.butterfly.mopaasapp.com/song/468517654
// 根据歌曲ID获得歌曲歌词信息
http://wymusic.butterfly.mopaasapp.com/lrc/468517654

```

## License

   Copyright 2017 TaroXin

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
