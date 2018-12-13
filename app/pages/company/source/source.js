// pages/company/source/source.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeType:"all",
        types:[
            {title:"全部",active:1,type:'all'},
            {title:"视频",active:0,type:'video'},
            {title:"音频",active:0,type:'audio'},
            {title:"文章",active:0,type:'article'}
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    changeType:function(e){

        var type = e.currentTarget.dataset.type;
        console.log(type);
        if(type == this.data.activeType){

            return;
        }


        var types = this.data.types;

        for(var t of types){

            t.active = t.type == type ? 1: 0;
        }

        this.setData({activeType:type,types:types});

    }
})