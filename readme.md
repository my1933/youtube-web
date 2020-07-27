Youtube-WEB是用php Laravel 框架写的流量代理网站，通过对接谷歌API获得数据，用来搭建Youtube 视频镜像站，实现墙内传播指定的Youtube播放列表。

Youtube 需要支持PHP环境的虚拟主机或VPS，上传代码并简单设置即可使用。

这个1.0版本非常简单，只提供视频列表的读取和播放，因为只是本人向国内还值得拯救的人，固定推送并选择措辞并不严厉的一些Youtuber的视频，只是让他们可以一点点的思考空间
我这里推荐 江峯/文昭 等等的视频。其他关于搜索/频道/用户/下载等等功能并没有开发，但如果您有PHP基础，这些接口都可以在下方文档看到，很容易开发出来类似“YOU2PHP” 的网站。

##如何安装与使用
1. 申请Youtube API 
####参考[You2PHP](https://you2php.github.io/doc/)
##### 获取 Youtube API
You2PHP利用API获取数据，需要您申请一个YouTube Data API的密钥，获取的所有内容都是通过这个API进行请求。
YouTube Data API是谷歌提供的免费API，申请不需要您支付任何费用。
##### YouTube Data API申请教程：
0. 请确保你的浏览器能打开Google，先注册一个Google账户，(注册地址：[https://accounts.google.com/SignUp](https://accounts.google.com/SignUp))如果您已经有了google账户，直接登陆即可。
1. 打开[https://console.developers.google.com/](https://console.developers.google.com/)
2. 打开此链接之后 ，若弹出服务条款更新窗口，全部选&nbsp;**是&nbsp;**，接着点击&nbsp;**接受 。**如果没有弹出此窗口可以忽略并进行下一步。
 ![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/1.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/1.png)
 
 [![](https://lijun8088.gitee.io/my-images/1.png)](https://lijun8088.gitee.io/my-images/1.png)
3. 点击顶部 **选择项目。**
 [![](https://lijun8088.gitee.io/my-images/2.png)](https://lijun8088.gitee.io/my-images/2.png)
4. 点击 **+** 图标创建一个新项目
[![](https://lijun8088.gitee.io/my-images/3.png)](https://lijun8088.gitee.io/my-images/3.png)
5. 项目名称使用默认的即可。当然也可以填写自定义的名称。
[![](https://lijun8088.gitee.io/my-images/7.png)](https://lijun8088.gitee.io/my-images/7.png)
6. 等待30秒左右，待创建完成之后，点击顶部 **选择项目。**找到您刚创建的项目，点 **打开**。
[![](https://lijun8088.gitee.io/my-images/9.png)](https://lijun8088.gitee.io/my-images/9.png)
7. 点击** 启用 API 和服务。**
[![](https://lijun8088.gitee.io/my-images/10.png)](https://lijun8088.gitee.io/my-images/10.png)
8. 在页面左侧下拉列表中找到** YouTube **。
[![](https://lijun8088.gitee.io/my-images/11.png)](https://lijun8088.gitee.io/my-images/11.png)
9. 选择**YouTube Data API。**并且**启用。**
[![](https://lijun8088.gitee.io/my-images/12.png)](https://lijun8088.gitee.io/my-images/12.png)
[![](https://lijun8088.gitee.io/my-images/13.png)](https://lijun8088.gitee.io/my-images/13.png)
10. 点击**创建凭据**
[![](https://lijun8088.gitee.io/my-images/14.png)](https://lijun8088.gitee.io/my-images/14.png)
11. 您使用的是哪个 API？凭据种类选** YouTube Data API v3**，您从哪里调用 API？ 选** 网页服务器**，您要访问哪些数据？选**公开数据**
接着点 **我需要哪些凭据？**
[![](https://lijun8088.gitee.io/my-images/20.png)](https://lijun8088.gitee.io/my-images/20.png)
12.复制您的**API密钥， **点击**完成。**
[![](https://lijun8088.gitee.io/my-images/30.png)](https://lijun8088.gitee.io/my-images/30.png)
到这里Youtube API已经申请完成了，接着就可以使用这个密钥拉取数据了。
[![](https://lijun8088.gitee.io/my-images/31.png)](https://lijun8088.gitee.io/my-images/31.png)


下载文件至服务器，执行：

`composer update`

成功后，需要
并将网站根目录指向 public 目录