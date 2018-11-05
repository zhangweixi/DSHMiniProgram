// pages/user/login/login.js
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    //countrys: { "name": ['美国', '中国', '巴西', '日本'], "code": ["01", "086", "023", "041"] },
    data: {
        miniroot: app.data.miniroot,
        countrys: { "name": [], "code": [] },
        index: 1,
    },
    bindChange: function (e) {

        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]]
        })
    },
    bindPickerChange: function (e) {

        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.getCountries();
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

    
    getCountries:function(){

        var url = app.data.api + "country/get_countries";

        wx.request({
            // 必需
            url: url,
            method:"POST",
            success: (res) => {
                
            }
        })
    },
    getMobileCode:function(){
        wx.navigateTo({
            url: '/pages/mobile/code/code',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    }
})