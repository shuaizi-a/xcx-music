// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },

  observers: {
    lyric(lrc) {
      if (lrc == '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc: '暂无歌词',
            time: 0,
          }],
          nowLyricIndex: -1
        })
      } else {
        this._parseLyric(lrc)
      }
      // console.log(lrc)
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 
  },

  lifetimes: {
    ready() {
      // 750rpx
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx的大小
          // 获取一次滚动的高度
          // 比例换算: 屏幕宽度 / 设计稿宽度(750) * 设计稿高度(64) = 其他屏幕的设计稿高度 
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取父组件传递过来的值
    update(currentTime) {
      let lrcList = this.data.lrcList
      if (lrcList.length == 0) {
        return
      }

      // 处理歌词滚动完毕歌曲还没有结束
      if (currentTime > lrcList[lrcList.length - 1].time) {
        if (this.data.nowLyricIndex != -1) {
          this.setData({
            nowLyricIndex: -1,
            scrollTop: lrcList.length * lyricHeight
          })
        }
      }

      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          this.setData({
            // 当前选中的歌词的索引
            nowLyricIndex: i - 1,
            // 滚动条滚动的高度
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    _parseLyric(sLyric) {
      let line = sLyric.split('\n')
      // console.log(line)
      let _lrcList = []
      line.forEach((elem) => {
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = elem.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // console.log(timeReg)
          // 把时间转换为秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            lrc,
            time: time2Seconds,
          })
        }
      })
      this.setData({
        lrcList: _lrcList
      })
    }
  }
})