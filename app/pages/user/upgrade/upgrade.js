// pages/user/upgrade/upgrade.js
var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        error:""
    },
   
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    upgrade:function(e){


        var url     = app.data.api + "weixin/buy_vip";
        var data    = {
            userId:app.data.userId
        };

        app.request(url,data,(res,error)=>{

            var config = res.data.data.config;

            wx.requestPayment({
                timeStamp: config.timeStamp,
                nonceStr: config.nonceStr,
                package: config.package,
                signType: config.signType,
                paySign: config.paySign,
                success:(res)=>{ 
                    
                    this.paySuccess(config);

                },
                fail:(res)=>{ 

                    common.showToast('支付失败','none');
                }
            })
        })
    },
    paySuccess:function(config){
        
        common.showToast('支付成功',"success");

        //刷新用户信息
        var data = {userId:app.data.userId};
        var url = app.data.api + "member/";
        var url = app.request(url,data,()=>{

        })
        
    }
})