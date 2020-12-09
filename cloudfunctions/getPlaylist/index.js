// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

// 初始化云数据库
const db = cloud.database();

// const rp = require('request-promise')
const axios = require('axios')

const URL = 'https://apis.imooc.com/personalized?icode=59761331F59DE69D'

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

  const list = await db.collection('playlist').get();


  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
    console.log(newData)
  }

  // 把数据存储到云数据库
  for (let i = 0, len = newData.length; i < len; i++) {
    await db.collection('playlist').add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.error('插入失败')
    })
  }

  return newData.length
}