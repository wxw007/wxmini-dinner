Component({
  data: {
    elements: [{
      title: '我是吃货',
      name: 'eating' ,
      color: 'cyan',
      icon: 'myfill',
      url: 'eating/eating'
    },
    {
      title: '我是管理员',
      name: 'admin',
      color: 'blue',
      icon: 'newsfill',
      url: 'admin/admin'
    }
    ],
  },
  methods: {
    onLoad() {
      let that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            wx.redirectTo({
              url: '/pages/auth/auth'
            })
          }
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    onShareAppMessage() {
      return {
        title: '沙县点餐',
        imageUrl: 'https://image.weilanwl.com/color2.0/share2215.jpg',
        path: '/pages/index/index'
      }
    },
    chenfa() {
      
        // 调用云函数
        wx.cloud.callFunction({
          name: 'add',
          data: {a:4,b:5},
          success: res => {
            console.log(res)
            
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
    }
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  }
})