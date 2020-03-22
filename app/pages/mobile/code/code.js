// pages/mobile/code/code.js
var common = require("../../../common.js");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        surplusTime:0,
        regetText:"重新获取",
        wxinfo:wx.getStorageSync('wxinfo'),
        userInfo: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var userInfo = app.data.userInfo ? app.data.userInfo : null;
        this.setData({ userInfo: userInfo });
        this.getMobileCode();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    beginTimer:function(){

        var time = this.data.surplusTime;
        this.setData({"regetText":"重新获取("+ time +")"});

        var timer = setTimeout(()=>
        {
            var time = this.data.surplusTime;
            if(time <= 1){

                this.setData({"regetText":"重新获取","surplusTime":0});

                return;
            }
            
            this.setData({ "surplusTime": time-1});
            this.beginTimer()

        },1000);

        this.setData({timer:timer});
    },


    getMobileCode: function () {
        
        if(this.data.surplusTime > 0){
            
            return false;
        }

        var data = wx.getStorageSync("mobileCodeData");
        var url  = app.data.api + "member/add_mobile_code";

        app.request(url,data,(res,error)=>{
            
            res     = res.data;
            if(res.code == 200){
                
                this.setData({"surplusTime":60});
                this.beginTimer();    

            }else{

                common.showToast(res.message,'none');
            }
        })
    },


    register:function(e){
        
        var code            = e.detail.value.code;
        var wxinfo          = wx.getStorageSync('wxinfo');
        var uinfo           = this.data.userInfo;
        var data = {
                "mobileCode":code,
                "unionId": uinfo ? uinfo.wx_unionid : app.data.unionId,
                "openId": uinfo ? uinfo.mini_openid : wx.getStorageSync("openId"),
                "mobile":wx.getStorageSync('mobileCodeData').mobile,
                "nickName":uinfo?uinfo.NickName : wxinfo.nickName,
                "headImg": uinfo ? uinfo.head_img : wxinfo.avatarUrl,
                "version":app.data.version
            };

        var url = app.data.api + "member/register"
           
        app.request(url,data,(res,error)=>{
            
            var res = res.data;

            if(res.code == 200){

                clearTimeout(this.data.timer);
                common.user.cache(res.data.userInfo);
                common.showToast('登录成功','success');
                setTimeout(()=>{
                    
                    wx.switchTab({url: '/pages/user/center/center'});

                },2000);

            }else{

                common.showToast(res.message,"none");
            }
        })
    }
})