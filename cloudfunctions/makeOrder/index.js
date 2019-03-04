// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var openId = event.openId;
  var date = event.date;
  var foodName = event.foodName;
  var avatar = event.avatar;
  var price = event.price;
  console.log(event)
  try {
    return await db.collection('orderList').add({
      data: {
        openId,
        date,
        foodName,
        avatar,
        price
      }
    })
  } catch (e) {
    console.log(e)
  }
}