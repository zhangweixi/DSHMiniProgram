// pages/home/index/index.js
var common = require("../../../common.js");
var app  = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiper:{
            imgs: [],
            //是否采用衔接滑动  
            circular: true,
            //是否显示画板指示点  
            indicatorDots: false,
            //选中点的颜色  
            indicatorcolor: "#000",
            //是否竖直  
            vertical: false,
            //是否自动切换  
            autoplay: true,
            //自动切换的间隔
            interval: 4500,
            //滑动动画时长毫秒  
            duration: 200,
            //所有图片的高度  
            imgheights: [],
            //图片宽度 
            imgwidth: 750,
            //默认  
            current: 0
        },
        //音频列表
        videos:[],
        books:[],
        bgMusic:{
            show:false,
            playing:false,
            title:"",
            timeLength:0,
            timeCurrent:0,
            textTimeLength:"00:00",
            textTimeCurrent:"00:00",
            src:'',
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.getIndexData();


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

    imageLoad: function (e) {//获取图片真实宽度  
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

        // this.setData({
        //     imgheights: imgheights
        // })
    },
    /**
     * banner轮播改变事件
     */
    bindchange: function (e) {
        
        this.setSwiperData('current',e.detail.current);
    },
    /**
     * 设置轮播图的数据
     */
    
    setSwiperData:function(key,value){
        var swiper = this.data.swiper;
        //console.log(swiper);
        //console.log(key);
        swiper[key] = value;
        this.setData({ swiper: swiper });
    },

    getUserInfo:function(e)
    {
        console.log(e.detail)
    },

    /**
     * 获得首页数据
     * */
    getIndexData:function(){

        var url     = app.data.api + "home/home";
        var data    = {userId:0};
        var _this   = this;

        wx.request({
            url: url,
            method:'POST',
            data:data,
            success:function(res)
            {
                var data    = res.data.data;

                var bannerData    = {['swiper.imgs']: data.banners };
                _this.setData(bannerData); 

                console.log(bannerData);
                //书籍
                _this.setData({ "books": data.freeBooks})
                


            }
        })

    },

    /**
     * 播放音频
     */

    playAudio:function(e){

        var data        = e.currentTarget.dataset;
        var videoSrc    = data.src;
        var title       = data.title;

        var bgMusic         = this.data.bgMusic;
            bgMusic.playing = true;
            bgMusic.show    = true;
            bgMusic.src     = videoSrc;
            bgMusic.title   = title.substring(0,5)+"...";

        
        const innerAudioContext     = wx.createInnerAudioContext()
        innerAudioContext.src       = videoSrc;

        innerAudioContext.onCanplay(() => {

            innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
            

            setTimeout(() => {

                //在这里就可以获取到大家梦寐以求的时长了
                console.log(innerAudioContext.duration);//延时获取长度 单位：秒
                
                //设置总的时间

                bgMusic.timeLength = innerAudioContext.duration;
                bgMusic.textTimeLength = common.numberToTime(bgMusic.timeLength);
                
                //播放音乐
                this.playBgMusic();

                //监听播放进度
                var bgVideo = wx.getBackgroundAudioManager();
                bgVideo.onTimeUpdate(()=>{

                    var currentTime = bgVideo.currentTime;

                    var textTime = common.numberToTime(currentTime);

                        this.setData({ ["bgMusic.textTimeCurrent"]: textTime,["bgMusic.timeCurrent"]:currentTime });                        
                })

                this.setData({ ["bgMusic"]: bgMusic });
                
            }, 1000)  //这里设置延时1秒获取
        })
    },
    /**
     * 播放背景音乐
     */
    playBgMusic:function(){

        //总的时间根据
        var bgMusic     = this.data.bgMusic;
        var bgVideo     = wx.getBackgroundAudioManager();
        bgVideo.src     = bgMusic.src;
        bgVideo.title   = bgMusic.title;
        bgVideo.play();
    },
    //继续播放
    continueMusic:function(){

        (wx.getBackgroundAudioManager()).play();

        this.setData({['bgMusic.playing']:true});
    },
    //暂停音频
    pauseMusic:function(){

        wx.getBackgroundAudioManager().pause();
    
        this.setData({['bgMusic.playing']:false});
    },

    closeMusic:function(){

        wx.getBackgroundAudioManager().stop();
        
        this.setData({["bgMusic.show"]:false});


    },
    /**
     * 改变文字颜色
     */
    changeVideoColor:function(action){

        for(var music of this.data.videos)
        {
            
        }
       
    }

})