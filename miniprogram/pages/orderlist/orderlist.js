// pages/orderlist/orderlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isJoin: false,
    alreadyOrder: {
      peopleNum: 6,
      adviceNum: 7
    },
    peopleList: [],
    orderList: [],
    orderList2: [],


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
    this.getOrderList();
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
    this.getUserInfo()
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
  getUserInfo() {
    const that = this;
    wx.getUserInfo({
      success(res) {
        console.log(res)
        const userInfo = res.userInfo
        const nickName = userInfo.nickName
        const avatarUrl = userInfo.avatarUrl
        const gender = userInfo.gender // 性别 0：未知、1：男、2：女
        const province = userInfo.province
        const city = userInfo.city
        const country = userInfo.country;

        app.globalData.userInfo = userInfo;
        app.globalData.avatarUrl = avatarUrl;
      }
    });
    wx.cloud.callFunction({
      name: 'getOpenId'
    })
      .then(res => {
        app.globalData.openId = res.result.openId;
      })
  },
  //获取已点餐列表
  getOrderList() {
    const that = this;
    wx.cloud.callFunction({
      name: 'getOrderList',
      success: res => {
        if (res.errMsg === "cloud.callFunction:ok") {
          let data = res.result.data;
          let orderList = data;
          let peopleList = [];
          orderList.forEach(orderItem => {
            peopleList.push(orderItem.avatar)
          });
          peopleList = Array.from(new Set(peopleList))
          let arr = that.formatList(orderList)
          this.setData({
            orderList2: arr,
            peopleList: peopleList,
            orderList: orderList
          });

        }


      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
 
  //跳转点菜
  gotoMakeOrder() {
    this.getUserInfo();
    wx.redirectTo({
      url: '../../pages/makeOrder/makeOrder'
    })
  },
  //蹭吃
  freeEat() {

  },
  formatList(arr) {
    var foodList = [];
    var orderList = [];
    arr.forEach(item => {
      foodList.push(item.foodName);
    });
    foodList = Array.from(new Set(foodList));
    foodList.forEach(foodName => {
      let t = { foodName: '', price: null, avatarList: [], openIdList: [] };
      arr.forEach(orderItem => {
        if (foodName === orderItem.foodName) {
          t.foodName = foodName;
          t.price = orderItem.price;
          t.avatarList.push(orderItem.avatar);
          t.openIdList.push(orderItem.openId);
        }
      })
      orderList.push(t)

    })
    return orderList
  }
})
 