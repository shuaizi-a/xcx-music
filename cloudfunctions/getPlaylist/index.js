// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

// 初始化云数据库
const db = cloud.database();

// const rp = require('request-promise')
const axios = require('axios')

const URL = 'https://apis.imooc.com/personalized?icode=59761331F59DE69D'

// 数据库初始化
// const db = wx.cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取接口信息
  const {
    data
  } = await axios.get(URL)

  // 判断请求是否成功
  if (data.code >= 1000) {
    console.log(data.msg)
    return 0;
  }

  // 参数赋值
  const playlist = data.result

  // 把数据存储到云数据库
  if (playlist.length > 0) {
    await db.collection('playlist').add({
      data: [...playlist]
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log(err)
      console.log('插入失败')
    })
  }

}