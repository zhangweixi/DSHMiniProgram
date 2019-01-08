var systemInfo = wx.getSystemInfoSync();
var platform = systemInfo.platform;

var common  = require('common.js');
//var host  = "https://wx.laohoulundao.com/";
if (platform == 'devtools'){

    var host = "http://test1.wx.laohoulundao.com/";
    //var host  = "https://test.jdclo.com/";

}else{

    var host = "https://test.jdclo.com/";
}


//var host = "https://test.jdclo.com/";
var host = "https://wx.laohoulundao.com/";

App({
    common:common,
    data:{
        host:host,
        userId:0,
        memNumber:"",
        miniroot:host+"miniprogram/",
        api:host+"api/v6/",
        platform: platform,
        loginKey:'',
        debugTime:0
    },
    onLaunch:function(){

        //1.检查本地是否有用户登录的信息
        wx.clearStorageSync('userInfo');
        var userInfo        = wx.getStorageSync('userInfo');
        
        
        if(userInfo){
            
            this.data.userInfo  = userInfo;
            this.data.userId    = userInfo.UserID;
            this.data.memNumber = userInfo.MemNumber;

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

      
        var url     = this.data.api + "member/login?code="+code;
        var unionid = wx.getStorageSync("unionid");
        
        if(unionid && fresh == false){

            return false;
        }


        wx.request({
            // 必需
            url: url,
            method:'POST',
            success: (res) => {
                res = res.data;
                if(res.code == 200){

                    var userInfo        = res.data.userInfo;
                    common.user.cache(userInfo);
                    
                }else if(res.code == 2003){

                    this.data.unionid = res.data.unionid;

                    wx.setStorageSync("unionid",this.data.unionid);

                }
            },
            fail:function(e){

                wx.showModal({
                    title: host,
                    content: JSON.stringify(e),
                    showCancel: true,
                    cancelText: '取消',
                    cancelColor: '#000000',
                    confirmText: '确定',
                    confirmColor: '#3CC51F',
                    success: (res) => {
                        // res.confirm 为 true 时，表示用户点击了确定按钮
                        if(res.confirm) {
                            
                        }
                    },
                    fail: (res) => {
                        
                    },
                    complete: (res) => {
                        
                    }
                })
            }
        })
    },
    request:function(url,data,callback){
        
        data =  typeof data == "object" ? data : {};
        if(this.data.userId > 0){

            data.loginKey = this.data.userInfo.LoginKey;    

        }else{

            data.loginKey = "";

        }
        
        
        wx.request({
            url: url,
            data: data,
            method: 'POST',
            success: function (res) {
                typeof callback == "function" && callback(res,null)
            },
            fail: function (res) {
                typeof callback == "function" && callback(null,res)
            }
        })
    }


})
