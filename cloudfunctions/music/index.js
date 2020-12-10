// 云函数入口文件
const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');
// const rp = require('request-promise')
const axios = require('axios')
const BASE_URL = 'https://apis.imooc.com'
const ICON = 'icode=59761331F59DE69D'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const app = new TcbRouter({
    event
  })

  // 获取热门歌单信息
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database({env: 'shuaizi9807113513'}).collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('playCount', 'desc')
      .get()
      .then((res) => {
        return res;
      })
  })

  // 根据歌单ID获取歌曲
  app.router('musiclist', async (ctx, next) => {
    const res = await axios.get(`${BASE_URL}/playlist/detail?id=${event.playlistId}&${ICON}`)
    ctx.body = res.data;
  })

  return app.serve()
}