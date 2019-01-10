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
//var host = "https://wx.laohoulundao.com/";

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
        debugTime:0,
        unionId:"",
        openId:""
    },
    onLaunch:function(){

        //1.检查本地是否有用户登录的信息
        wx.clearStorageSync('userInfo');
        var userInfo        = wx.getStorageSync('userInfo');
        
        
        if(userInfo){
            
            this.data.userInfo  = userInfo;
            this.data.userId    = userInfo.UserID;
            this.data.memNumber = userInfo.MemNumber;

            return;
        }

        wx.login({success:(res)=>
        {
            var code     = res.code;
            if(code){
                this.wxLogin(code);
            }
        }})
    },
    wxLogin:function(code){

        var url     = this.data.api + "member/login";
        var openId  = wx.getStorageSync('openId');
        if(openId){

            return;
        }
        
        this.request(url,{code:code},(res,error)=>
        {
            res = res.data;
        
            if(res.code == 200){

                common.user.cache(res.data.userInfo);
                
            }else if(res.code == 2003){

                this.data.unionId   = res.data.unionId;
                this.data.openId    = res.data.openId;

                wx.setStorageSync("openId",this.data.openId);
            }

            this.appInit();
        })
    },
    //封装的APP请求包
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
    },
    //app准备工作
    appInit:function(){
        
        common.user.syncLeanTime();
        
        setInterval(()=>{
            
            common.user.syncLeanTime();

        },1000*60*5);
    }
})
