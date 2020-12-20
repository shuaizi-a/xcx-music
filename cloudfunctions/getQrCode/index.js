// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const result = await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID,
    // page: "pages/blog/blog"
    // lineColor: {
    //   'r': 211,
    //   'g': 60,
    //   'b': 57
    // },
    // isHyaline: true
  })
  // console.log(result)

  // 把生成的小程序码存储到云存储
  const upload = await cloud.uploadFile({
    // cloudPath: 'qrcode/' + Date.now() + '-' + Math.random() + '.png',
    cloudPath: 'qrcode/xcxm.png',
    fileContent: result.buffer
  })
  return upload.fileID
}