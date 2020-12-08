Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    playlist: {
      type: Object,
    }
  },
  // observers数据监听器可以用于监听和响应任何属性和数据字段的变化
  // 组件内使用observers数据监听器
  observers: {
    ['playlist.playCount'](count) {
      console.log(count)
      this.setData({
        _count: this._tranNumber(count, 2)
      })
    }
  },
  data: {}, // 私有数据，可用于模板渲染
  methods: {
    // 数字格式化
    _tranNumber(num, point) {
      let numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) +
          '万'
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    }
  }

})