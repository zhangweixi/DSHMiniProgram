// pages/video/list/list.js
var appdata =  getApp().data;

// pages/home/index/index.js
var common = require("../../../common.js");
var app  = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
        appdata:appdata,
        page:1,
        videos:[],
        total:0,
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
  onLoad: function (options) {
      
      this.getVideoList();

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
      //从缓存提取背景音乐
      var bgMusicData = common.bgMusic.getData();
      if (bgMusicData) {
          this.setData({ ["bgMusic"]: bgMusicData });

          //改变监听事件
          var bgVideo = wx.getBackgroundAudioManager();
          bgVideo.onTimeUpdate(() => {

              this.monitorBgmusic();

          });
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
   * 获取音频列表
   */
  getVideoList:function(){

      var url = appdata.api + "audio/page_audio?page="+this.data.page;
      var _this = this;

      wx.request({
          url: url,
          method:'POST',
          success:function(res){
            
            var data    = res.data.data;
            for(var video of data.data){
                
                video.playing = false;
            }
            var videos  = _this.data.videos.concat(data.data)
              _this.setData({ "videos": videos,"total":data.total});
              
              
          },
          fail:function(res){

              console.log(res);
          }
      })
  },


    /**
     * 播放音频
     */

    playAudio: function (e) {

        var data    = e.currentTarget.dataset;
        var videoSrc= data.src;

        this.initPlayAudio(videoSrc);
    },

    /**
     * 初始化音频播放器
     *  
     */
    initPlayAudio: function (videoSrc){

        var bgMusic = this.data.bgMusic;

        //判断当前音频是否在播放状态中
        if (bgMusic.src == videoSrc) {

            return false;
        }

        //停止之前的声音
        wx.getBackgroundAudioManager().stop();

        //将播放的音频设置于播放状态
        for (var video of this.data.videos) {

            if (video.FilePath1 == videoSrc) {

                var title = video.AudioTitle;
                video.playing = true;

            } else {

                video.playing = false;
            }
        }

        bgMusic.playing = true;
        bgMusic.show = true;
        bgMusic.src = videoSrc;
        bgMusic.title = title.substring(0, 5) + "...";

        this.setData({ "videos": this.data.videos });


        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = videoSrc;

        innerAudioContext.onCanplay(() => {

            innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到


            setTimeout(() => {

                //在这里就可以获取到大家梦寐以求的时长了
                console.log(innerAudioContext.duration);//延时获取长度 单位：秒

                //设置总的时间

                bgMusic.timeLength = innerAudioContext.duration;
                bgMusic.textTimeLength = common.numberToTime(bgMusic.timeLength);
                this.setData({ ["bgMusic"]: bgMusic });


                //播放音乐
                common.bgMusic.play(bgMusic.src, bgMusic.title);
                common.bgMusic.setData(bgMusic);

                //监听播放进度
                var bgVideo = wx.getBackgroundAudioManager();
                bgVideo.onTimeUpdate(() => {

                    this.monitorBgmusic();
                    
                })

                //监控播放完成事件
                bgVideo.onEnded(()=>{

                    this.playNextVideo();
                });

            }, 500)  //这里设置延时1秒获取
        })

    },
    monitorBgmusic: function () {

        var bgVideo = wx.getBackgroundAudioManager();
        var currentTime = bgVideo.currentTime;
        var textTime = common.numberToTime(currentTime);

        this.setData({ ["bgMusic.textTimeCurrent"]: textTime, ["bgMusic.timeCurrent"]: currentTime });
    },
    //继续播放
    continueMusic: function () {

        (wx.getBackgroundAudioManager()).play();

        this.setData({ ['bgMusic.playing']: true });
    },
    //暂停音频
    pauseMusic: function () {

        wx.getBackgroundAudioManager().pause();

        this.setData({ ['bgMusic.playing']: false });
    },

    closeMusic: function () {

        wx.getBackgroundAudioManager().stop();

        this.setData({ ["bgMusic.show"]: false });

        //将音频全部关闭
        for (var video of this.data.videos) {

            video.playing = false;
        }

        this.setData({ "videos": this.data.videos });
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
        this.setData({ 'bgMusic': bgMusic });
    },

    //开始播放
    playFirstVideo:function(){

        var musicSrc    = this.data.videos[0].FilePath1;
        this.initPlayAudio(musicSrc);

    },
    // 播放下一段音频
    playNextVideo:function(){

        var oldMusicSrc = this.data.bgMusic.src;
        var newMusicSrc = "";
        var findVideo   = false;

        for(var video of this.data.videos){

            if(findVideo == true){

                newMusicSrc = video.FilePath1;
                break;
            }

            if(video.FilePath1 == oldMusicSrc){
                
                findVideo = true;
                continue;
            }
        }
        
        if(newMusicSrc == '')
        {
            newMusicSrc = this.data.videos[0].FilePath1;
        }

        this.initPlayAudio(newMusicSrc);
    }


})