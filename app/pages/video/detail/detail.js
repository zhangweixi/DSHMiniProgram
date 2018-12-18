// pages/video/detail/detail.js
var common = require("../../../common.js");
var app = getApp();

Page({

    /**
   * 页面的初始数据
   */
    data: {
        isMoving: false
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function(options) {

        var bgMusic = wx.getStorageSync('bgMusic');

        this.setData({bgMusic: bgMusic});

        console.log(this.data.music);
    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady: function() {

        //重新绑定背景音乐的更新事件
        var music = wx.getBackgroundAudioManager();
        this.setData({music: music});

        //音乐更新事件
        this.data.music.onTimeUpdate( ()=>{

            if(this.data.isMoving) {
                return;
            }

            var currentTime = this.data.music.currentTime;
            var textTime = common.numberToTime(currentTime);
            var bgMusic = this.data.bgMusic;
            bgMusic.timeCurrent = currentTime;
            bgMusic.textTimeCurrent = textTime;

            this.setData({
                bgMusic: bgMusic
            });

            wx.setStorageSync('bgMusic', bgMusic)
        })

        //音乐结束事件
        this.data.music.onEnded = function() {

        }
    },

    /**
   * 生命周期函数--监听页面显示
   */
    onShow: function() {

    },

    /**
   * 用户点击右上角分享
   */
    onShareAppMessage: function() {


    },
    //暂停音乐
    pauseMusic: function() {

        this.data.music.pause();
        this.setData({ ['bgMusic.playing'] : false});
    },
    //播放音乐
    playMusic: function() {

        this.data.music.play();
        this.setData({ ['bgMusic.playing'] : true});
    },
    //快进音乐
    fastPlay: function(e) {
        this.setData({
            isMoving: true
        });
        var currentTime = e.detail.value;
        this.data.music.pause();
        this.data.music.seek(currentTime);
        setTimeout(() =>{
            this.data.music.play();
            this.setData({
                isMoving: false
            });
        },1000);
    },
    changeMusic:function(e){

        var type    = e.currentTarget.dataset.type;

        var url     = app.data.api + "audio/prev_or_next_audio";

        var data    = {audioId:this.data.bgMusic.id,type:type};

        app.request(url,data,(res,error)=>{

            this.playNewMusic(res.data.data.audio);
        })
    },
    playNewMusic:function(audioInfo){

        var bgMusic = this.data.bgMusic;
            bgMusic.title   = audioInfo.AudioTitle;
            bgMusic.fullTitle= audioInfo.AudioTitle;
            bgMusic.id      = audioInfo.AudioID;
            bgMusic.src     = audioInfo.FilePath1;
            bgMusic.timeCurrent = 0;
            bgMusic.textTimeCurrent = common.numberToTime(0);
            bgMusic.playing = true;
            
            //获取时长
            bgMusic.timeLength =0;

            const innerAudioContext     = wx.createInnerAudioContext()
            innerAudioContext.src       = bgMusic.src;
            innerAudioContext.onCanplay(() => {

            innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
            
            setTimeout(() => {

                //在这里就可以获取到大家梦寐以求的时长了
                console.log(innerAudioContext.duration);//延时获取长度 单位：秒
                
                //设置总的时间

                bgMusic.timeLength = innerAudioContext.duration;
                bgMusic.textTimeLength = common.numberToTime(bgMusic.timeLength);
                
                //播放音乐
                common.bgMusic.play(bgMusic.src,bgMusic.title);
                
                this.setData({ bgMusic: bgMusic });
                
                common.bgMusic.setData(bgMusic);

            }, 500)  //这里设置延时1秒获取
        })

    }
})