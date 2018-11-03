var systemInfo = wx.getSystemInfoSync();
var platform = systemInfo.platform;

var common  = require('common.js');
//var host  = "https://wx.laohoulundao.com/";
if (platform == 'devtools'){

    var host = "http://test1.wx.laohoulundao.com/";

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

        var userInfo    = wx.getStorageSync('userInfo');

        if(userInfo){
            
            this.data.userInfo = userInfo;
            

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
                
                var userInfo = res.data.data.userInfo;
                
                this.data.userInfo = userInfo;
                wx.setStorage({
                    key: 'userInfo',
                    data: userInfo
                })
            }
        })
    }


})