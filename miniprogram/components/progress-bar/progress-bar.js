let movableAreaWidth = 0;
let movableViewWidth = 0;
// 获取播放事件
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1 // 当前的秒数
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {},
  // observers数据监听器可以用于监听和响应任何属性和数据字段的变化
  // 组件内使用observers数据监听器
  observers: {},
  data: {
    showTime: {
      currentTime: "00:00", // 开始时间
      totalTime: "00:00", //结束时间
      movableDis: 0,
      progress: 0
    }
  },

  // 组件内的生命周期
  // https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html#%E5%AE%9A%E4%B9%89%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E6%96%B9%E6%B3%95	
  lifetimes: {
    // 在组件在视图层布局完成后执行	
    ready() {
      this._bindBGMEvent();
      this._getMovableDis();
    }
  },
  methods: {
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, movableViewWidth)
      })
    },
    _bindBGMEvent() {
      // https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html
      // 监听音频播放事件
      backgroundAudioManager.onPlay(() => {})
      // 监听音频停止事件
      backgroundAudioManager.onStop(() => {})
      // 监听音频暂停事件
      backgroundAudioManager.onPause(() => {})
      // 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
      backgroundAudioManager.onWaiting(() => {})
      // 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
      backgroundAudioManager.onCanplay(() => {
        // 判断获取歌曲时候长是否成功
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime();
        } else {
          setTimeout(() => {
            this._setTime();
          }, 1000)
        }

      })
      // 监听音频播放进度更新事件
      backgroundAudioManager.onTimeUpdate(() => {
        const currentTime = backgroundAudioManager.currentTime // 获取播放时长
        const duration = backgroundAudioManager.duration // 获取播放长度

        const sec = currentTime.toString().split('.')[0];
        // 判断截取后的时间不等于设置的数字
        if (sec != currentSec) {
          const currentTimeFmt = this._dateFormat(currentTime) // 播放时长格式化
          this.setData({
            movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration, // 圆圈所在的位置 （长条 - 圆宽) * 时长 / 播放时长
            progress: currentTime / duration * 100, // 圆圈后面的颜色
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
          })
          currentSec = sec
        }
      })
      // 监听音频自然播放至结束的事件
      backgroundAudioManager.onEnded(() => {})
      // 监听音频播放错误事件
      backgroundAudioManager.onError((res) => {})
    },
    _setTime() {
      let duration = backgroundAudioManager.duration;
      console.log(duration)
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    // 格式化时间
    _dateFormat(sec) {
      // 分钟
      const min = Math.floor(sec / 60)
      sec = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(sec),
      }
    },
    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})