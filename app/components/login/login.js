
Component({

    properties:{

    },
    data:{
        app:getApp()
    },
    methods:{

        toLogin:function(){

            wx.getUserInfo({
                success: (res) => {

                    let userInfo = res.userInfo

                    wx.setStorageSync('wxinfo', userInfo);

                    //跳转到手机页面
                    wx.navigateTo({
                        url: '/pages/mobile/mobile/mobile'
                    })
                }
            })
        }

    }

})