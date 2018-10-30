App({
    data:{
        "host":"http://test.wx.laohoulundao.com/miniprogram/",
        "apiHost":""

    },
    onLaunch:function(){

        //1.检查本地是否有用户登录的信息
        //app启动的时候检查用户是否登录


        wx.login({
            success:function(res){
                if(res.code){
                    console.log(res.code);
                }else{
                    console.log("error");
                }
            }
        })


        wx.getUserInfo({
            success: function (res) {
                console.log(res);
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
            }
        })
    }

})