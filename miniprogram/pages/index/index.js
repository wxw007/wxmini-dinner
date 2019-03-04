const app = getApp();
Component({
  data: {
    avatarUrl:'',
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
  onshow: function(){
    this.getUserInfo()
  },
  methods: {
    getUserInfo(){
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
          that.setData({
            avatarUrl: avatarUrl
          })
        }
      });
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
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