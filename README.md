Youtube-WEB是用php Laravel 框架写的流量代理网站，通过对接谷歌API获得数据，用来搭建Youtube 视频镜像站，实现墙内传播指定的Youtube播放列表。

Youtube 需要支持PHP环境的虚拟主机或VPS，上传代码并简单设置即可使用。

##如何安装与使用
1. 申请Youtube API 
[YoutubeApi.md](https://github.com/ShiZhenXiang789/youtube-web/blob/master/YoutubeApi.md)

2. 下载文件至服务器，安装请参考[Laravel](https://github.com/laravel/laravel)：
- 根目录执行

`composer update`

- 将申请的YoutubeApiKey 填入 .env 文件或 config/youtube.php 文件。

`YOUTUBE_API_KEY = Youtube_api_key`


- 修改用户和管理员名称，在 config/user.php 中添加可登录用户，因为只是针对小部分人群（服务器流量也有压力），
只需要添加用户名称即可，

`
[
    "user" => [
        'admin',
        '111111',
        '222222'
    ],
    "manager" => [
        'admin',
    ]
]
`

- 网站根目录设置为 public/ 可以在墙内测试访问了。

- 用管理员登录前端，然后点击添加频道（最终做成了播放列表）
填入播放列表ID 
>https://www.youtube.com/watch?v=fN2l0iYLDeI&list=PLPVsJMpVPkCfvg2UWDu3LQ9mt4FYpwoTz 地址中的
>PLPVsJMpVPkCfvg2UWDu3LQ9mt4FYpwoTz 即可

### **安全安全**

* 为了安全，请不要广泛传播，只给信任的人。
* 开通流量加密，用https访问

#### 基础开发

鸣谢下面两位扩展包的作者。

[Athlon1600/youtube-downloader](https://github.com/Athlon1600/youtube-downloader)

[alaouy/Youtube](https://github.com/alaouy/Youtube)

程序用了上方两个扩展包，如果想要更多功能（搜索、频道、推荐、高清……），
甚至做成另一个You2php 请参考上方两个链接。
对有php 基础的人，并不困难。

前端使用了 react-create-app ，源文件在 react-app 目录，可自行修改并发布，然后拷贝至 public/h5 目录。

#### 关于
这个1.0版本非常简单，只提供视频列表的读取和音视频播放，
只是本人向国内几个还值得拯救的人，固定推送并选择措辞并不严厉的一些Youtuber的视频，

注：措辞严厉的他们就不敢听了。

希望让他们可以一点点的思考空间。

一个失业的大龄码农，开发仓促，如果有什么问题，欢迎 issues

