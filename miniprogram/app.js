//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'shuaizi9807113513',
        traceUser: true,
      })
    }
    // 类似于vueX全局都可以访问到的变量
    this.globalData = {
      playingMusicId: -1, // 当前歌词高亮ID
      openid: -1, // 当前用户是否授权
    }
  },
  // 获取当前选中的歌高亮
  getPlayMusicId() {
    return this.globalData.playingMusicId
  },
  // 设置选中的歌
  setPlayMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  }
})