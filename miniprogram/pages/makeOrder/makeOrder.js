// miniprogram/pages/makeOrder/makeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList:[],
    isMakeOrder: false

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
          console.log('成功')
          console.log(data)
        }

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})