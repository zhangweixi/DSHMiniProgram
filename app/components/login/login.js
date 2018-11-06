Component({

    properties:{

    },
    data:{
        app:getApp()
    },
    methods:{

        toLogin: function (e) {

            //获取用户微信信息
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