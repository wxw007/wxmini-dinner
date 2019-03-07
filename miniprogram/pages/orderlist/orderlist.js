// pages/orderlist/orderlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    isJoin: false,
    alreadyOrder: {
      peopleNum: 6,
      adviceNum: 7
    },
    peopleList: [],
    orderList: [],
    orderList2: [],
    freeList: [],
    total: 0,
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
  formatDate(format) {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
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
  //获取已点餐列表
  getOrderList() {
    wx.showLoading({
      title: '加载中',
    });
    let date = this.formatDate(1)
    const that = this;
    wx.cloud.callFunction({
      name: 'getOrderList',
      data:{
        date
      },
      success: res => {
        if (res.errMsg === "cloud.callFunction:ok") {
          let data = res.result.data;
          let orderList = data;
          let total = 0;
          let peopleList = [];
          orderList.forEach(orderItem => {
            peopleList.push(orderItem.avatar);
            total = (total * 1000 + parseFloat(orderItem.price) * 1000) / 1000;
          });
          peopleList = Array.from(new Set(peopleList))
          let arr = that.formatList(orderList)
          this.setData({
            orderList2: arr,
            peopleList: peopleList,
            orderList,
            total
          });
        }
        wx.hideLoading()



      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //生成蹭吃人员列表
  getFreeList(arr) {
    let freeList = [];
    arr.forEach(item => {
      if(!item.foodName){
        let p = {};
        freeList.push(item.avatar)
      }
    })
  },

  //跳转点菜
  gotoMakeOrder() {
    if (!wx.getStorageSync('openId') || !wx.getStorageSync('avatar')) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success(res) {

        }
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/makeOrder/makeOrder'
    })
  },
  //蹭吃
  freeEat() {
    const that = this;
    if (!wx.getStorageSync('openId') || !wx.getStorageSync('avatar')) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success(res) {

        }
      })
      return
    }
    let openId = wx.getStorageSync('openId');
    let orderList = this.data.orderList;
    let isMakeOrder = orderList.find(item => {
      return item.openId === openId
    })
    if (!!isMakeOrder){
      wx.showModal({
        title: '提示',
        content: '你已点菜',
        showCancel: false,
        success(res) {

        }
      })
      return;
    }
    let item = {};
    item.price = null;
    item.foodName = '';
    item.seller = '沙县小吃',
      item.openId = wx.getStorageSync('openId');
    item.avatar = wx.getStorageSync('avatar');
    item.date = this.formatDate(2);
    wx.cloud.callFunction({
        name: 'makeOrder',
        data: {
          item
        }
      })
      .then(res => {
        that.getOrderList()
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },
  formatList(arr) {
    var foodList = [];
    var orderList = [];
    arr.forEach(item => {
      foodList.push(item.foodName);
    });
    foodList = Array.from(new Set(foodList));
    foodList.forEach(foodName => {
      if (!foodName){
        return
      }
      let t = {
        foodName: '',
        price: null,
        avatarList: [],
        openIdList: []
      };
      arr.forEach(orderItem => {
        if (orderItem.foodName === foodName) {
          t.foodName = foodName;
          t.price = orderItem.price;
          t.avatarList.push(orderItem.avatar);
          t.openIdList.push(orderItem.openId);
        }
      })
      orderList.push(t)

    })
    console.log(orderList)
    return orderList
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    let ListTouchDirection;
    if (e.touches[0].pageX - this.data.ListTouchStart > 50) {
      ListTouchDirection = 'right'
    } else if (e.touches[0].pageX - this.data.ListTouchStart < -50) {
      ListTouchDirection = 'left'
    } else {
      return
    }
    this.setData({
      ListTouchDirection
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
 
})