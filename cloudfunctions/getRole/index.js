// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
// 云函数入口函数
exports.main = async (event, context) => {
  let openId = event.openId;
  let isAdmin = '23';
  return await db.collection('role').where({
    openId,
    role: 'admin'
  }).get({
    success(res){
      return res.result.data
    }
  })
  
 
}