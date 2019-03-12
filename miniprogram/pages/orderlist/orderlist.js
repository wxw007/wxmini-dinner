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
    riceList: [],
    total: 0,
    riceNum: 0,
    foodNum: 0,
    peopleNum: 0,
    role: '',
    isShowInfo: false,
    showPage: false,
    average: 0
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
    this.getRole();
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
    // let riceNum = this.data.riceList.length || 0;
    // let foodNum = orderList.length - riceList.length || 0;
    // return {
    //   title: `米饭:${riceNum}份, 点餐:${foodNum}份`,
    //   path: '/pages/orderlist/orderlist',
    // }
    return {
      title: '今天吃沙县',
      // imageUrl: 'https://image.weilanwl.com/color2.0/share2215.jpg',
      // path: '/pages/index/index'
    }
  },
  //获取用户角色
  getRole() {
    if (!wx.getStorageSync('openId')) {
      return
    }
    let openId = wx.getStorageSync('openId');
    wx.cloud.callFunction({
        name: 'getRole',
        data: {
          openId
        }
      })
      .then(res => {
        console.log(res)
        if (res.result.data.length > 0) {
          this.setData({
            role: 'admin'
          })
        } else {
          this.setData({
            role: ''
          })
        }
      })
      .catch(err => {

      })
  },
  showInfo() {
    let isShowInfo = !this.data.isShowInfo;
    console.log(isShowInfo)
    this.setData({
      isShowInfo
    })
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
  //计算总金额
  countTotal() {
    let total = 0;
    let orderList2 = this.data.orderList2;

    orderList2.forEach(item => {
      total += 1000 * item.price * item.peopleList.length / 1000
    });
    this.setData({
      total: total ? total : 0
    })
  },
  //计算总点餐人数
  countPeopleNum() {
    let peopleNum = 0;
    let peopleList = [];
    let orderList = this.data.orderList;
    orderList.forEach(item => {
      peopleList.push(item.avatar)
    });
    peopleList = Array.from(new Set(peopleList))
    this.setData({
      peopleList
    })
  },
  //计算人均费用
  countAverage() {
    let total = this.data.total;
    let num = this.data.peopleList.length;
    if (num > 0) {
      let average = total / num;
      this.setData({
        average: average.toFixed(2)
      })
    } else {
      this.setData({
        average: 0
      })
    }
  },
  //计算几份菜
  countFoodNum() {
    let foodNum = 0;
    let orderList2 = this.data.orderList2;
    orderList2.forEach(item => {
      if (item.foodName.indexOf('米饭') < 0) {
        foodNum += item.peopleList.length;
      }
    });
    this.setData({
      foodNum
    })
  },
  //计算几份饭
  countRiceNum() {
    let riceNum = 0;
    let orderList2 = this.data.orderList2;
    if (orderList2.length === 0) {
      return
    }
    orderList2.forEach(item => {
      if (item.foodName.indexOf('米饭') > -1) {
        riceNum = item.peopleList.length;
      }
    });
    this.setData({
      riceNum
    })

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
      data: {
        date
      },
      success: res => {
        if (res.errMsg === "cloud.callFunction:ok") {
          let data = res.result.data;
          let orderList = data;
          let total = 0;
          let arr = that.formatList(orderList)
          this.setData({
            orderList2: arr,
            orderList,
            total,
            showPage: true
          });
          that.countTotal();
          that.countFoodNum();
          that.countRiceNum();
          that.countPeopleNum();
          that.countAverage();
        }
        wx.hideLoading();
      },
      fail: err => {
        wx.hideLoading()
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  //生成蹭吃人员列表
  // getFreeList(arr) {
  //   let freeList = [];
  //   arr.forEach(item => {
  //     if (!item.foodName) {
  //       let p = {};
  //       p.avatar = item.avatar;
  //       p.openId = item.openId;
  //       freeList.push(p)
  //     }
  //   })
  //   this.setData({
  //     freeList
  //   })
  // },
  //生成米饭列表
  getRiceList(arr) {
    let riceList = [];
    arr.forEach(item => {
      if (item.foodName.indexOf('米饭') > -1) {
        let p = {};
        p.avatar = item.avatar;
        p.openId = item.openId;
        riceList.push(p)
      }
    })
    this.setData({
      riceList
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
          wx.navigateTo({
            url: '/pages/index/index'
          })
        }
      })
      return
    }
    wx.navigateTo({
      url: '/pages/makeOrder/makeOrder'
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
          wx.navigateTo({
            url: '/pages/index/index'
          })
        }
      })
      return
    }
    let openId = wx.getStorageSync('openId');
    let orderList = this.data.orderList;
    let isMakeOrder = orderList.find(item => {
      return item.openId === openId
    })
    if (!!isMakeOrder) {
      wx.showModal({
        title: '提示',
        content: '你已入伙',
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
    item.date = this.formatDate(1);
    wx.cloud.callFunction({
        name: 'makeOrder',
        data: {
          item
        }
      })
      .then(res => {
        wx.showModal({
          title: '提示',
          content: '蹭吃成功',
          showCancel: false,
          success(res) {
            that.getOrderList()
          }
        })
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
      if (!foodName) {
        return
      }

      let t = {
        foodName: '',
        price: null,
        peopleList: [],
        itemList: [],
      };
      arr.forEach(orderItem => {
        if (orderItem.foodName === foodName) {
          t.foodName = foodName;
          t.price = orderItem.price;
          t.isShowPeopleList = false;
          let p = {};
          p.avatar = orderItem.avatar;
          p.openId = orderItem.openId;
          t.peopleList.push(p)
          t.itemList.push(orderItem)
        }
      })
      orderList.push(t)
    })
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
  showPeopleList(e) {
    let currentIndex = e.currentTarget.dataset.idx;
    let str = `orderList2[${currentIndex}].isShowPeopleList`;
    this.setData({
      [str]: true
    })
  },
  hidePeopleList(e) {
    let currentIndex = e.currentTarget.dataset.index;
    let str = `orderList2[${currentIndex}].isShowPeopleList`;
    this.setData({
      [str]: false
    })
  },
  delOrder(e) {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          });
          let date = that.formatDate(1);
          let foodName = e.currentTarget.dataset.foodname;
          let openId = e.currentTarget.dataset.item.openId;
          let rowIndex = e.currentTarget.dataset.rowindex;
          let avatarIndex = e.currentTarget.dataset.avatarindex;
          let orderList2 = that.data.orderList2;
          let peopleList = orderList2[rowIndex].peopleList;

          wx.cloud.callFunction({
              name: 'delOrder',
              data: {
                foodName,
                openId,
                date
              }
            })
            .then(res => {
              wx.hideLoading();

              if (res.result.errMsg === 'collection.remove:ok') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                let str = `orderList2[${rowIndex}].peopleList`
                if (peopleList.length === 1) {
                  orderList2.splice(rowIndex, 1)
                  that.setData({
                    orderList2
                  })
                  let orderList3 = [];
                  that.data.orderList.forEach(item => {
                    if (item.foodName === foodName && item.date === date) {
                      return
                    }
                    orderList3.push(item);
                  })
                  that.setData({
                    orderList: orderList3
                  })
                } else {
                  peopleList.splice(avatarIndex, 1)
                  that.setData({
                    [str]: peopleList
                  })
                  let orderList3 = [];
                  that.data.orderList.forEach(item => {
                    if (item.foodName === foodName && item.openId === openId && item.date === date) {
                      return
                    }
                    orderList3.push(item);
                    that.setData({
                      orderList: orderList3
                    })
                  })
                }
                
                that.countTotal();
                that.countFoodNum();
                that.countRiceNum();
                that.countPeopleNum();
                that.countAverage();
              }
            })
            .catch(err => {
              wx.hideLoading();
              console.log(err)
            })
        } else if (res.cancel) {
          return
        }
      }
    })

  },
  delOrderRow(e) {
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          });
          let date = that.formatDate(1);
          let rowIndex = e.currentTarget.dataset.rowindex;
          let foodName = e.currentTarget.dataset.foodname;
          let orderList2 = that.data.orderList2;
          wx.cloud.callFunction({
              name: 'delOrderRow',
              data: {
                foodName,
                date
              }
            })
            .then(res => {
              wx.hideLoading();
              if (res.result.errMsg === 'collection.remove:ok') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                orderList2.splice(rowIndex, 1)
                that.setData({
                  orderList2
                })
                let orderList3 = [];
                that.data.orderList.forEach(item => {
                  if (item.foodName === foodName && item.date === date) {
                    return
                  }
                  orderList3.push(item);
                })
                that.setData({
                  orderList: orderList3
                })
                that.countTotal();
                that.countFoodNum();
                that.countRiceNum();
                that.countPeopleNum();
                that.countAverage();
              }
            })
            .catch(err => {
              wx.hideLoading()
              console.log(err)
            })
        } else if (res.cancel) {
          return
        }
      }
    })

  }

})