// pages/user/login/login.js
let app = getApp();
var common = require("../../../common.js");

Page({

    /**
     * 页面的初始数据
     */
    //countrys: { "name": ['美国', '中国', '巴西', '日本'], "code": ["01", "086", "023", "041"] },
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

        console.log('picker发送选择改变，携带值为', e.detail.value);

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
        
        if (checkMobile(data.mobile) == false){

            common.showDialog(this,"手机号格式错误","warning");
            return;
        }
        
        wx.request({
            url: app.data.api + "member/add_mobile_code",
            data:data,
            method:"POST",
            success: (res) => {
                
                wx.navigateTo({
                    url: '/pages/mobile/code/code',
                    success: (res) => {

                        wx.setStorageSync("mobileCodeData", data);
                        

                    }
                })
            }
        })


       
    }
})

function checkMobile(mobile) {

    if (!(/^\d{4,12}$/.test(mobile))) {
        
        return false;

    }else{
        return true;
    }
}