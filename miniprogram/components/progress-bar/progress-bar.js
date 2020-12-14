let movableAreaWidth = 0;
let movableViewWidth = 0;
// 获取播放事件
const backgroundAudioManager = wx.getBackgroundAudioManager();
let currentSec = -1 // 当前的秒数
let duration = 0 // 歌曲总时长
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
Component({
  behaviors: [],
  // 属性定义（详情参见下文）
  properties: {
    isSame: Boolean
  },
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

      // 判断是否是同一首歌曲
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
        console.log(666)
      }
      this._bindBGMEvent();
      this._getMovableDis();
    }
  },
  methods: {
    onChange(event) {
      if (event.detail.source == 'touch') {
        // 当前正在拖动
        isMoving = true;
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        // 圆光标的位置
        this.data.movableDis = event.detail.x
      }
    },
    onTouchEnd(event) {
      // const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime)) // 
      // console.log(currentTimeFmt)
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        // ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      // 跳转播放的位置
      backgroundAudioManager.seek(duration * this.data.progress / 100);
      // 拖动结束
      isMoving = false;
    },
    // 获取滚动条的长度和圆的长度
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log(movableAreaWidth, movableViewWidth)
      })
    },
    _bindBGMEvent() {
      // https://developers.weixin.qq.com/miniprogram/dev/api/media/audio/InnerAudioContext.html
      // 监听音频播放事件
      backgroundAudioManager.onPlay(() => {
        isMoving = false;
        this.triggerEvent('musicPlay')
      })
      // 监听音频停止事件
      backgroundAudioManager.onStop(() => {})
      // 监听音频暂停事件
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })
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
        // 获取播放时长
        const currentTime = backgroundAudioManager.currentTime
        // 当前音频的长度
        const duration = backgroundAudioManager.duration

        const sec = currentTime.toString().split('.')[0];
        // 判断截取后的时间不等于设置的数字
        if (sec != currentSec) {
          // 播放时长格式化
          const currentTimeFmt = this._dateFormat(currentTime)
          this.setData({
            // 圆圈后面的颜色 总时长 / 已播放 * 100
            progress: currentTime / duration * 100,
            ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
          })
          if (!isMoving) {
            this.setData({
              // 圆圈所在的位置 （长条 - 圆宽) * 播放时长 / 总时长
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration
            })
          }
          currentSec = sec

          // 歌词联动
          this.triggerEvent('timeUpdate', {
            // 播放的时间长度
            currentTime
          })
        }
      })
      // 监听音频自然播放至结束的事件
      backgroundAudioManager.onEnded(() => {
        // 向父组件传递事件
        this.triggerEvent('musicEnd')
      })
      // 监听音频播放错误事件
      backgroundAudioManager.onError((res) => {})
    },
    _setTime() {
      duration = backgroundAudioManager.duration; // 歌曲总时长
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