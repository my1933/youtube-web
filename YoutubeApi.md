
#### 参考已阵亡的[You2PHP](https://you2php.github.io/doc/)
##### 获取 Youtube API

本程序利用API获取数据，需要您申请一个YouTube Data API的密钥，获取的所有内容都是通过这个API进行请求。
YouTube Data API是谷歌提供的免费API，申请不需要您支付任何费用。
##### YouTube Data API申请教程：
0. 请确保你的浏览器能打开Google，先注册一个Google账户，(注册地址：[https://accounts.google.com/SignUp](https://accounts.google.com/SignUp))如果您已经有了google账户，直接登陆即可。
1. 打开[https://console.developers.google.com/](https://console.developers.google.com/)
2. 打开此链接之后 ，若弹出服务条款更新窗口，全部选&nbsp;**是&nbsp;**，接着点击&nbsp;**接受 。**如果没有弹出此窗口可以忽略并进行下一步。
 ![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/1.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/1.png)
3. 点击顶部 **选择项目。**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/2.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/2.png)
4. 点击 **+** 图标创建一个新项目
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/3.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/3.png)
5. 项目名称使用默认的即可。当然也可以填写自定义的名称。
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/7.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/7.png)
6. 等待30秒左右，待创建完成之后，点击顶部 **选择项目。**找到您刚创建的项目，点 **打开**。
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/9.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/9.png)
7. 点击** 启用 API 和服务。**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/10.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/10.png)
8. 在页面左侧下拉列表中找到** YouTube **。
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/11.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/11.png)
9. 选择**YouTube Data API。**并且**启用。**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/12.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/12.png)
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/13.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/13.png)
10. 点击**创建凭据**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/14.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/14.png)
11. 您使用的是哪个 API？凭据种类选** YouTube Data API v3**，您从哪里调用 API？ 选** 网页服务器**，您要访问哪些数据？选**公开数据**
接着点 **我需要哪些凭据？**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/20.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/20.png)
12.复制您的**API密钥， **点击**完成。**
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/30.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/30.png)
到这里Youtube API已经申请完成了，接着就可以使用这个密钥拉取数据了。
![https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/31.png](https://github.com/ShiZhenXiang789/youtube-web/raw/master/Screenshots/31.png)
