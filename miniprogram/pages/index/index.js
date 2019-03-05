const app = getApp();
Component({
  data: {
    hasAvatar: false,
    hasOpenId: false,
    avatar:'',
    role: '',
  },
  methods: {
    onShow: function () {
      if (!wx.getStorageSync('avatar')) {
        this.setData({
          hasAvatar: false,
        })
      }
      else if (!wx.getStorageSync('openId')) {
        this.setData({
          hasOpenId: false,
        })
      }
      else {
        this.setData({
          hasOpenId: true,
          hasAvatar: true,
        })
        this.getRole()
      }
    },
    getUserInfo(){
      const that = this;
      wx.getUserInfo({
        success(res) {
          console.log(res)
          const userInfo = res.userInfo
          const nickName = userInfo.nickName
          const avatar = userInfo.avatarUrl
          const gender = userInfo.gender // 性别 0：未知、1：男、2：女
          const province = userInfo.province
          const city = userInfo.city
          const country = userInfo.country;
          wx.setStorageSync('userInfo', userInfo);
          wx.setStorageSync('avatar', avatar);
          
          that.setData({
            hasAvatar: true
          })
        }
      });
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          let openId = res.result.openid;
          wx.setStorageSync('openId', openId);
          that.setData({
            hasOpenId: true
          })
          that.getRole()
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    },
    //获取用户角色
    getRole(){
      if(!wx.getStorageSync('openId')){
        return
      }
      let openId = wx.getStorageSync('openId');
      wx.cloud.callFunction({
        name: 'getRole',
        data:{
          openId
        }
      })
        .then(res => {
          console.log(res)
          if(res.result.data.length > 0){
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