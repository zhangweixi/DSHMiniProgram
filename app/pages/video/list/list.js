// pages/video/list/list.js
var appdata = getApp().data;

// pages/home/index/index.js
var common = require("../../../common.js");
var app = getApp();

Page({

    /**
   * 页面的初始数据
   */
    data: {
        appdata: appdata,
        page: 0,
        videos: [],
        total: 0,
        bgMusic: {
            show: false,
            playing: false,
            title: "",
            timeLength: 0,
            timeCurrent: 0,
            textTimeLength: "00:00",
            textTimeCurrent: "00:00",
            src: ''
        }
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function(options) {

        this.getVideoList();

    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady: function() {

    },

    /**
   * 生命周期函数--监听页面显示
   */
    onShow: function() {
        //从缓存提取背景音乐
        var bgMusicData = common.bgMusic.getData();
        if (bgMusicData) 
        {
            this.setData({ ["bgMusic"] : bgMusicData});

            //改变监听事件
            var bgVideo = wx.getBackgroundAudioManager();
                bgVideo.onTimeUpdate(() =>{

                    this.monitorBgmusic();

                });
        }
    },

    /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function() {

    },

    /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function() {

        this.getVideoList();
    },

    /**
   * 获取音频列表
   */
    getVideoList: function() {

        var page    = this.data.page + 1; 

        var url     = appdata.api + "audio/page_audio?page=" + page;
        var bgMusic = common.bgMusic.getData();

        app.request(url,{},(res,error)=>{

            var videoList = res.data.data;

            for (var video of videoList.data) {

                video.playing = bgMusic.id == video.AudioID ? true : false;
            }

            var videos = this.data.videos.concat(videoList.data);

            this.setData({
                "videos": videos,
                "total": videoList.total,
                "page":videoList.current_page
            });
        })
    },

    /**
     * 播放音频
     */

    playAudio: function(e) {

        var audioId  = e.currentTarget.dataset.id;
        
        this.initPlayAudio(audioId);
    },

    /**
     * 初始化音频播放器
     *  
     */
    initPlayAudio: function(audioId) {

        for(var audio of this.data.videos){

            if(audio['AudioID'] == audioId){

                var audioInfo   = audio;
                break;
            }
        }
        

        var bgMusic = this.data.bgMusic;

        //判断当前音频是否在播放状态中
        if (audioId == bgMusic.id) {

            return false;
        }

        console.log(audioInfo);
        //停止之前的声音
        wx.getBackgroundAudioManager().stop();

        //将播放的音频设置于播放状态
        for (var video of this.data.videos) {

            if (video.FilePath1 == audioInfo.FilePath1) {
       
                video.playing = true;

            } else {

                video.playing = false;
            }
        }


        var title       = audioInfo.AudioTitle;
        bgMusic.id      = audioId;
        bgMusic.playing = true;
        bgMusic.show    = true;
        bgMusic.src     = audioInfo.FilePath1;
        bgMusic.title   = title.substring(0, 5) + "...";
        bgMusic.fullTitle=title;
        bgMusic.timeCurrent     = 0;
        bgMusic.textTimeCurrent = common.numberToTime(0);


        this.setData({"videos": this.data.videos});

        const   innerAudioContext       = wx.createInnerAudioContext();
                innerAudioContext.src   = bgMusic.src;

                innerAudioContext.onCanplay(() =>{

                    innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到

                    setTimeout(() =>{

                        //在这里就可以获取到大家梦寐以求的时长了
                        console.log(innerAudioContext.duration); //延时获取长度 单位：秒
                        //设置总的时间
                        bgMusic.timeLength      = innerAudioContext.duration;
                        bgMusic.textTimeLength  = common.numberToTime(bgMusic.timeLength);
                        this.setData({bgMusic:bgMusic});

                        //播放音乐
                        common.bgMusic.play(bgMusic.src, bgMusic.title);
                        common.bgMusic.setData(bgMusic);

                        //监听播放进度
                        var bgVideo = wx.getBackgroundAudioManager();
                            bgVideo.onTimeUpdate(() =>{

                                this.monitorBgmusic();

                            })

                            //监控播放完成事件
                            bgVideo.onEnded(() =>{

                                this.playNextVideo();
                            });
                    },500)  //这里设置延时1秒获取
                })

    },
    monitorBgmusic: function() {

        var bgVideo = wx.getBackgroundAudioManager();
        var currentTime = bgVideo.currentTime;
        var textTime = common.numberToTime(currentTime);

        this.setData({ ["bgMusic.textTimeCurrent"] : textTime,
            ["bgMusic.timeCurrent"] : currentTime
        });
    },
    //继续播放
    continueMusic: function() {

        wx.getBackgroundAudioManager().play();

        this.setData({ ['bgMusic.playing'] : true
        });
    },
    //暂停音频
    pauseMusic: function() {

        wx.getBackgroundAudioManager().pause();

        this.setData({ ['bgMusic.playing'] : false
        });
    },

    closeMusic: function() {

        wx.getBackgroundAudioManager().stop();

        this.setData({ ["bgMusic.show"] : false
        });

        //将音频全部关闭
        for (var video of this.data.videos) {

            video.playing = false;
        }

        this.setData({
            "videos": this.data.videos
        });
        var bgMusic = {
            show: false,
            playing: false,
            title: "",
            timeLength: 0,
            timeCurrent: 0,
            textTimeLength: "00:00",
            textTimeCurrent: "00:00",
            src: ''
        }
        this.setData({
            'bgMusic': bgMusic
        });
    },

    //开始播放
    playFirstVideo: function() {
        var videos  = this.data.videos;
        var video   = videos[0];
        this.initPlayAudio(video['AudioID']);
    },
    // 播放下一段音频
    playNextVideo: function() {

        var oldMusicSrc = this.data.bgMusic.src;
        var newMusicSrc = "";
        var findVideo = false;

        for (var video of this.data.videos) {

            if (findVideo == true) {

                newMusicSrc = video.FilePath1;
                break;
            }

            if (video.FilePath1 == oldMusicSrc) {

                findVideo = true;
                continue;
            }
        }

        if (newMusicSrc == '') {
            newMusicSrc = this.data.videos[0].FilePath1;
        }

        this.initPlayAudio(newMusicSrc);
    }

})