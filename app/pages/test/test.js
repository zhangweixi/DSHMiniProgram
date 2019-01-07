// pages/test/test.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs:[],
        heights:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var imgs = [];
        var heights = [];

        for(var i=1;i<18;i++){

            imgs.push(i);
            heights.push(50);

        }

        var info = wx.getSystemInfoSync();
        this.setData({
            windowWidth:info.screenWidth,
            perVw:info.screenWidth/100,
            imgs:imgs,
            heights:heights
        });
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * @return {[type]} [description]
     */
    move:function(e){

        //判断当前第几个
        
        var left    = e.detail.scrollLeft;
        var last    = Math.ceil((( left + this.data.windowWidth) / this.data.perVw - 15) /50);

        var first   = Math.ceil((left/this.data.perVw - 15)/50);

        if(first < 1){
            first = 1;
        }
        
        var heights = this.data.heights;

        for(var i= first ;i<=last;i++){

            //计算左边值
            var templeft = (i-1)*50-left/this.data.perVw+15;
                //templeft = templeft + 50;

            if(templeft < 15){ 

                var width = 0.4*templeft + 64;

            }else{

                var width = -0.4*templeft + 64;
            }
            console.log(width);

            heights[i-1] = width;
        }

        this.setData({heights:heights});

    }
})