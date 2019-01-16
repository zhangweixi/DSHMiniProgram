// pages/user/upgrade/upgrade.js
var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        error:"",
        userInfo:{},
        deadLine:""
    },
    onLoad:function(){

        

        var pre = new Date();
        pre.setFullYear(pre.getFullYear()+1);
        var y = pre.getFullYear();
        var m = pre.getMonth() + 1;
        var d = pre.getDate();
        var deadLine = y+"年"+m+"月"+d+"日";
        this.setData({
            userInfo:app.data.userInfo,
            deadLine:deadLine
        });
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },
    upgrade:function(e){
        
        var url     = app.data.api + "weixin/buy_vip";
        var data    = {
            userId:app.data.userId,
            platform:this.data.app.data.platform,
            version:this.data.app.data.version
        };
        

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code != 200){

                common.showModel("提示", res.message);
                return;
            }

            var config = res.data.config;

            wx.requestPayment({
                timeStamp: config.timeStamp,
                nonceStr: config.nonceStr,
                package: config.package,
                signType: config.signType,
                paySign: config.paySign,
                success:(res)=>{ 
                    
                    this.paySuccess();
                },
                fail:(res)=>{ 

                    common.showToast('支付失败','none');
                }
            })
        })
    },
    paySuccess:function(){
        
        common.showToast('支付成功',"success");
        var pages   = getCurrentPages();
        var prevPage= pages[pages.length - 2];
            prevPage.setData({payFinish:true});
            common.user.fresh(app.data.userId);
            
        //刷新用户信息
        setTimeout(()=>{


            wx.navigateBack({delta: 1});

        },1500);
    }
})