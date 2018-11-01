var common = require('common.js');
var host = "http://test.wx.laohoulundao.com/";

App({
    common:common,
    data:{
        'host':host,
        "miniroot":host+"miniprogram/",
        "api":host+"api/v6/",
    },
    onLaunch:function(){

        //1.检查本地是否有用户登录的信息
        


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