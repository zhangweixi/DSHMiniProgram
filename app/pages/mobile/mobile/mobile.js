// pages/user/login/login.js
let app = getApp();
var common = require("../../../common.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        miniroot: app.data.miniroot,
        countrys: { "name": [], "code": [] },
        index: 0,
    },
    
    bindChange: function (e) {

        const val = e.detail.value;

        this.setData({
            year: this.data.years[val[0]]
        });

    },
    bindPickerChange: function (e) {

        this.setData({
            index: e.detail.value
        });
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

        if(app.data.userId > 0){

            wx.setNavigationBarTitle({title: '绑定手机号'});

        }else{

            wx.setNavigationBarTitle({title: '登录'});

        }
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
            url: url,
            method:"POST",
            success: (res) => {
                
                res = res.data;
                var countrys    = this.data.countrys;
                
                var i       = 0;
                var index   = 0;

                for(var country of res.data.countrys){

                    countrys.code.push("+0"+country.country_num_code);
                    countrys.name.push(country.country_china_name);

                    if(country.country_num_code == "86"){

                        index   = i;
                    }
                    i++;
                }

                this.setData({"countrys":countrys,"index":index});
            }
        })
    },
    getMobileCode:function(e){

        //检查手机号是否合格
        var fromData = e.detail.value;
        
        
        var data = { mobile: fromData.mobile, countryCode: this.data.countrys.code[this.data.index]};
        
        wx.setStorageSync("mobileCodeData", data);

        //wx.navigateTo({url: '/pages/mobile/code/code'});

        
        if (checkMobile(data.mobile) == false){

            common.showDialog(this,"手机号格式错误","warning");
            return;
        }
        
        wx.setStorageSync("mobileCodeData", data);
        wx.navigateTo({url: '/pages/mobile/code/code'});
    }
})

function checkMobile(mobile) {

    if (!(/^\d{4,12}$/.test(mobile))) {
        
        return false;

    }else{
        return true;
    }
}