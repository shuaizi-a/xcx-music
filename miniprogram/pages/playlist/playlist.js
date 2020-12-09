// pages/playlist/playlist.js
const db = wx.cloud.database();
const MAX_LIMIT = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        _id: 1,
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        _id: 2,
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        _id: 3,
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: [
      // {
      //   "_id": "08560c9e5d042a5c0174f1ca26f1d7b2",
      //   "copywrier": "热门推荐",
      //   "playCount": 1.4641238e+06,
      //   "highQuality": false,
      //   "type": 0.0,
      //   "canDislike": true,
      //   "name": "天气转热了，适合听点凉爽的歌。",
      //   "alg": "cityLevel_unknow",
      //   "createTime": {
      //     "$date": "2019-06-14T23:14:36.746Z"
      //   },
      //   "id": 2.780381322e+09,
      //   "picUrl": "https://p2.music.126.net/Biky7TE4CtW6NjGuqoUKZg==/109951164041827987.jpg",
      //   "trackCount": 53.0
      // },
      // {
      //   "_id": "08560c9e5d042a5c0174f1da7aa357aa",
      //   "highQuality": false,
      //   "copywriter": "热门推荐",
      //   "canDislike": true,
      //   "playCount": 622822.6,
      //   "id": 2.740107647e+09,
      //   "name": "「时空潜行」囿于昼夜的空想主义者",
      //   "type": 0.0,
      //   "alg": "cityLevel_unknow",
      //   "createTime": {
      //     "$date": "2019-06-14T23:14:36.955Z"
      //   },
      //   "picUrl": "https://p2.music.126.net/Q0eS0avwGK04LufWM7qJug==/109951164116217181.jpg",
      //   "trackCount": 20.0
      // },
      // {
      //   "_id": "08560c9e5d042a5c0174f1de21c7e79e",
      //   "id": 2.828842343e+09,
      //   "type": 0.0,
      //   "name": "粤语情诗：与你听风声，观赏过夜星",
      //   "picUrl": "https://p2.music.126.net/K9IcG8cU6v4_SwuQ_x2xMA==/109951164124604652.jpg",
      //   "highQuality": false,
      //   "alg": "cityLevel_unknow",
      //   "playCount": 1.785097e+06,
      //   "trackCount": 52.0,
      //   "copywriter": "热门推荐",
      //   "canDislike": true,
      //   "createTime": {
      //     "$date": "2019-06-14T23:14:36.982Z"
      //   }
      // },
      // {
      //   "_id": "08560c9e5d042a5d0174f1e67d1bb16f",
      //   "playCount": 7.719329e+06,
      //   "highQuality": false,
      //   "trackCount": 950.0,
      //   "alg": "cityLevel_unknow",
      //   "id": 9.17794768e+08,
      //   "type": 0.0,
      //   "name": "翻唱简史：日本四百首",
      //   "canDislike": true,
      //   "createTime": {
      //     "$date": "2019-06-14T23:14:37.037Z"
      //   },
      //   "copywriter": "热门推荐",
      //   "picUrl": "https://p2.music.126.net/NczCuurE5eVvObUjssoGjQ==/109951163788653124.jpg"
      // },
      // {
      //   "_id": "08560c9e5d042a5d0174f1ea32c4c288",
      //   "type": 0.0,
      //   "copywriter": "热门推荐",
      //   "highQuality": false,
      //   "createTime": {
      //     "$date": "2019-06-14T23:14:37.097Z"
      //   },
      //   "id": 2.201879658e+09,
      //   "alg": "cityLevel_unknow",
      //   "playCount": 1.06749088e+08,
      //   "name": "你的青春里有没有属于你的一首歌？",
      //   "picUrl": "https://p2.music.126.net/wpahk9cQCDtdzJPE52EzJQ==/109951163271025942.jpg",
      //   "canDislike": true,
      //   "trackCount": 169.0
      // },
      // {
      //   "_id": "08560c9e5d0829820362a79f4b049d2d",
      //   "alg": "cityLevel_unknow",
      //   "name": "「乐队的夏天」参赛歌曲合集丨EP04更新",
      //   "highQuality": false,
      //   "picUrl": "http://p2.music.126.net/2WE5C2EypEwLJd2qXFd4cw==/109951164086686815.jpg",
      //   "trackCount": 158.0,
      //   "createTime": {
      //     "$date": "2019-06-18T00:00:02.553Z"
      //   },
      //   "copywriter": "热门推荐",
      //   "playCount": 1.5742008e+06,
      //   "canDislike": true,
      //   "id": 2.79477263e+09,
      //   "type": 0.0
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取云数据库内的轮播图信息
    let {
      data
    } = await db.collection('swiperImgUrls').get();
    this.setData({
      swiperImgUrls: data.data
    })

    // 获取歌单数据
    this._getPlaylist();
  },
  _getPlaylist() {
    // 提示信息
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist', // tcb-router路由
        start: this.data.playlist.length,
        count: 15
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })

      // 关闭下拉刷新和提示信息
      wx.hideLoading()
      wx.stopPullDownRefresh();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      playlist: []
    })
    this._getPlaylist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})