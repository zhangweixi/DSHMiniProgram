// pages/mobile/code/code.js
var common = require("../../../common.js");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        surplusTime:10,
        regetText:"重新获取"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.beginTimer();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    beginTimer:function(){

        var time = this.data.surplusTime;
        this.setData({"regetText":"重新获取("+ time +")"});

        setTimeout(()=>{

            var time = this.data.surplusTime;

            if(time <= 1){

                this.setData({"regetText":"重新获取","surplusTime":0});

                return;
            }
            
            this.setData({ "surplusTime": time-1});

            this.beginTimer()

        },1000);
        console.log(this.data.surplusTime);
    },
    checkMobileCode:function(){

        console.log(this.data);

        common.showDialog(this,"操作成功","warning");
    },
    getMobileCode: function (e) {


        if(this.data.surplusTime > 0){
            
            return false;
        }

        var data = wx.getStorageSync("mobileCodeData");

        wx.request({
            url: app.data.api + "member/add_mobile_code",
            data: data,
            method: "POST",
            success: (res) => {

                wx.navigateTo({
                    url: '/pages/mobile/code/code',
                    success: (res) => {

                        this.setData({"surplusTime":60});
                        this.beginTimer();

                    }
                })
            }
        })
    }
})