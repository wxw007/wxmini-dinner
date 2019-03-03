// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var filedvalue1 = event.a
  var filedvalue2 = event.b
  try {
    return await db.collection('orderList').add({
      data: {
        filed1: filedvalue1,
        filed2: filedvalue2
      }
    })
  } catch (e) {
    console.log(e)
  }
}