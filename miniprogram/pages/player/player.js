// pages/player/player.js
const app = getApp();
let musiclist = [];
let nowPlayingIndex = 0;
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 背景图片
    isPlaying: false, // 播放状态
    isLyricShow: false, //表示当前歌词是否显示
    lyric: '', // 歌词
    isSame: false, // 表示是否为同一首歌
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    // 获取本地存储的歌曲
    musiclist = wx.getStorageSync('musiclist')
    console.log(musiclist);

    // 设置当前页面显示的数据
    this._loadMusicDetail(options.musicId);
  },
  _loadMusicDetail(musicId) {
    console.log(musicId)
    console.log(app.getPlayMusicId())
    if (musicId == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    // 设置当前点击的歌曲高亮
    app.setPlayMusicId(musiclist[nowPlayingIndex].id)

    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false,
    })

    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      let result = res.result
      if (result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }

      if (!this.data.isSame) {
        // 播放地址url
        backgroundAudioManager.src = result.data[0].url
        // 播放歌曲名称 不能缺少
        backgroundAudioManager.title = music.name
        // 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        // 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。 
        backgroundAudioManager.singer = music.ar[0].name
        // 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
        backgroundAudioManager.epname = music.al.name

        // 保存播放历史
        this.savePlayHistory()
      }

      // 设置正在播放
      this.setData({
        isPlaying: true
      });
      wx.hideLoading();

      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then((res) => {
        let lyric = '暂无歌词'
        const lrc = res.result.lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  // 播放暂停开关
  togglePlaying() {
    if (this.data.isPlaying) {
      // 暂停音乐
      backgroundAudioManager.pause()
    } else {
      // 播放音乐
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 下一首
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  // 上一首
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex === musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  // 播放状态
  onPlay() {
    this.setData({
      isPlaying: true,
    })
  },
  // 暂停状态
  onPause() {
    this.setData({
      isPlaying: false,
    })
  },
  // 歌词是否显示
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  // 进度条传递时间到歌词
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  // 保存播放历史
  savePlayHistory() {
    //  当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    for (let i = 0, len = history.length; i < len; i++) {
      if (history[i].id == music.id) {
        bHave = true
        break
      }
    }
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})