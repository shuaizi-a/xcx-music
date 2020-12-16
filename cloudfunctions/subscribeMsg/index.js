const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  console.log(wxContext)
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: wxContext.OPENID,
      templateId: 'ZUwD72SCLpBtc4FyxoFKvw0W3ikPYjQImKK4MRMihLs',
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      data: {
        thing1: {
          value: "评论信息程序"
        },
        name2: {
          value: event.content
        },
        character_string3: {
          value: "csxx"
        }
      },
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}