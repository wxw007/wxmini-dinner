const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [],
    isMakeOrder: false,
    openId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMenuList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //获取已点餐列表
  getMenuList() {
    wx.cloud.callFunction({
      name: 'getMenuList',
      success: res => {

        if (res.errMsg === "cloud.callFunction:ok") {
          let data = res.result.data;
          this.setData({
            menuList: data
          })
          
        }

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  formatDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var time = "";
    //精确到天
    if (format == 1) {
      time = year + "-" + month + "-" + date;
    }
    //精确到分
    else if (format == 2) {
      time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
    }
    return time;
  },
   makeOrder(e) {
     if (!wx.getStorageSync('openId') || !wx.getStorageSync('avatar')){
       wx.showModal({
         title: '提示',
         content: '请先登录',
         showCancel: false,
         success(res) {
           
         }
       })
       return
     }
    let item = e.currentTarget.dataset.item;
     item.openId = wx.getStorageSync('openId');
     item.avatar = wx.getStorageSync('avatar');
    item.date = this.formatDate(2);
    wx.cloud.callFunction({
      name: 'makeOrder',
      data:{
        item
      }
    })
    .then( res => {
      console.log(res)
    })
    .catch( err => {
      console.log(err)
    })
    
  }
})