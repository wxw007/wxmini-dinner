// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const {
    openId,
    date,
    foodName
  } = event;
  return await db.collection('orderList').where({
    openId,
    date,
    foodName
  }).remove({
    success(res) {
      console.log(res)
    }
  })
}