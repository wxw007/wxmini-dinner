// miniprogram/pages/admin/admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodName: '',
    price: null,
    menuList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMenuList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
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
  inputName(e) {
    console.log(1)
    this.setData({
      foodName: e.detail.value
    })
  },
  inputPrice(e) {
    console.log(2)
    this.setData({
      price: e.detail.value
    })
  },
  submit() {
    if(!this.data.foodName || !this.data.price){
      wx.showModal({
        title: '提示',
        content: '信息不完整',
        showCancel: false
      })
      return
    }
    wx.showLoading({
      title: '上传中...',
    })

    const that = this;
    wx.cloud.callFunction({
      name: 'addFood',
      data: {
        foodName: that.data.foodName,
        price: that.data.price
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        });
        that.getMenuList()

        that.setData({
          foodName: '',
          price: null,
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '操作失败',
          showCancel: false
        })
      }
    })
  },
  getMenuList() {
    const that = this;
    wx.cloud.callFunction({
      name: 'getMenuList',
    }).then( res => {
      let data = res.result.data;
      if(data.length > 0){
        that.setData({
          menuList: data
        })
      }
    })
  },
  delFood(e) {
    wx.showLoading({
      title: '删除中...',
    })
    console.log(e)
    let id = e.currentTarget.dataset.id;
    const that = this;
    wx.cloud.callFunction({
      name: 'delFood',
      data: {
        id: id
      }
    }).then( res => {
      console.log(res)
      that.getMenuList();
      wx.hideLoading()

    })
  }
})