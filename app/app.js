var systemInfo = wx.getSystemInfoSync();
var platform = systemInfo.platform;

var common  = require('common.js');
//var host  = "https://wx.laohoulundao.com/";
if (platform == 'devtools'){

    var host = "http://test1.wx.laohoulundao.com/";
    //var host  = "https://wx.laohoulundao.com/";

}else{

    var host  = "https://wx.laohoulundao.com/";
}



App({
    common:common,
    data:{
        'host':host,
        "miniroot":host+"miniprogram/",
        "api":host+"api/v6/",
        "platform": platform
    },
    onLaunch:function(){

        //1.检查本地是否有用户登录的信息
        wx.clearStorageSync('userInfo');
        var userInfo        = wx.getStorageSync('userInfo');
        this.data.userId    = 0;

        if(userInfo){
            
            this.data.userInfo  = userInfo;
            this.data.userId    = userInfo.UserID;

        }else{

            wx.login({
                success:(res)=>{

                    var code     = res.code;

                    if(res.code){

                        this.wxLogin(code);
                    }
                }
            })

        }
    },
    wxLogin:function(code){

        var url = this.data.api + "member/login?code="+code;

        wx.request({
            // 必需
            url: url,
            method:'POST',
            success: (res) => {
                res = res.data;
                if(res.code == 200){

                    var userInfo        = res.data.userInfo;
                    this.data.userInfo  = userInfo;
                    this.data.userId    = userInfo.UserID;
                    
                    wx.setStorage({
                        key: 'userInfo',
                        data: userInfo
                    })
                }
                
                

            }
        })
    }


})