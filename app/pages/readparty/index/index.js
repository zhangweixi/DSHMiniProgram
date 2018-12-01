// pages/readparty/index/index.js
var common = require('../../../common.js');
var app    = getApp(); 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        readpartys:[],
        ads:[
            {src:"https://wx.laohoulundao.com/images/ppt/1.jpg"},
            {src:"https://wx.laohoulundao.com/images/ppt/2.jpg"},
            {src:"https://wx.laohoulundao.com/images/ppt/3.jpg"},
            {src:"https://wx.laohoulundao.com/images/ppt/4.jpg"},
            {src:"https://wx.laohoulundao.com/images/ppt/5.jpg"},
            {src:"https://wx.laohoulundao.com/images/ppt/6.jpg"},
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        setTimeout(()=>{
            this.get_readpartys();    
        },1000);
        

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
        this.get_readpartys();  
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    imageLoad: function (e) {//获取图片真实宽度  
        return;
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,

            //宽高比  
            ratio = imgwidth / imgheight;
            console.log(imgwidth, imgheight)

        //计算的高度值  
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        var imgheights = this.data.swiper.imgheights;


        //把每一张图片的对应的高度记录到数组里  
        imgheights[e.target.dataset.id] = imgheight;
        this.setSwiperData('imgheights', imgheights);
    },
    get_readpartys:function(){

        var url = app.data.api + "readparty/get_readparty_list";
        var data = {userId:app.data.userId};
        wx.showLoading({
            title: '请稍等'
        });

        app.request(url,data,(res,error)=>{
            wx.hideLoading();
            res = res.data;
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();

            if(res.code == 200){
                var readpartys = res.data.readpartys;
                for(var key in readpartys){

                    var name = readpartys[key].ReaParName;

                    if(name.length > 15)
                    {
                        readpartys[key].ReaParName = name.substr(0,15)+"...";
                    }
                }
                this.setData({readpartys:readpartys});

            }else{

                wx.showToast({
                    title: res.message,
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                })
            }
        })
    },
    nav:function(e){

        wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },
    
   
})