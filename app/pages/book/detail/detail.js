// pages/book/detail/detail.js
var common  = require('../../../common.js');
var app     = getApp();

Page({
      /**
       * 页面的初始数据
       */
      data: {
          "bookInfo":{},
          "bookNotes":[
              { "type": "book", "placeholder":"通过此次代读，对我启发最大的一个知识点是？","title":"读 书"},
              { "type": "people", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 人"},
              { "type": "thing", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 事" },      
              { "type": "gift", "placeholder":"通过这个知识点，在工作上改进的是？","title":"赠礼物"}
          ],
          "mediaType":"mp3",
          "contentType":"note",
          "display":'',
          "audioInfo":{},
          "mp3Playing":false
        },

        /**
        * 生命周期函数--监听页面加载
        */
        onLoad: function (options) {
          
            this.setData({"bookId":options.bookId})

            this.getBookInfo();

            setTimeout(()=>{ 

                this.getUserReadPlan();

                //设置时间
                this.initBookMp3();

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
        *切换音视频
        */
        triggleMedia:function(e){
           
           var data     = e.target.dataset;
           var media    = data.media;
            
            if(this.data.mediaType == media)
            {
                return false;
            }

           this.setData({"mediaType":media});
        },

        /**
        * 切换内容
        */
        triggleContent:function(e)
        {
            var contentType = e.target.dataset.content;

            if(contentType == this.data.contentType)
            {
                return false;
            }
            this.setData({"contentType":contentType});
        },
        /**
        * 获取书籍详情
        */
        getBookInfo:function(){

            var url = app.data.api + "book/book_detail";

            wx.request({
                // 必需
                url: url,
                method:"POST",
                data: {
                    bookId:this.data.bookId
                },    
                success: (res) => {
            
                    var data = res.data;

                    this.setData({"bookInfo":data.data.bookInfo});
            }
          })
        },
        /**
        * 获取用户的读书改进计划
        */
        getUserReadPlan:function(){

            if(app.data.userId == 0){

                return ;

            }

            var url = app.data.api + "book/get_user_read_plan";
            wx.request({
                url: url,
                method:"post",
                data: {
                    "bookId":this.data.bookId,
                    "memberNumber":app.data.userInfo.MemNumber,
                },
                header: {
                'Content-Type': 'application/json'
                },
                success: (res) => {
                
                    var readplanInfo= res.data.data.readplan;
                    if(readplanInfo == null){

                    return;

                    }
                    var dushu       = readplanInfo.BookReview1;
                    var duren       = readplanInfo.BookReview2;
                    var dushi       = readplanInfo.BookReview3;
                    var gift        = readplanInfo.BookReview4;

                    var bookNotes   = this.data.bookNotes;
                    bookNotes[0]["content"] = dushu;
                    bookNotes[1]["content"] = duren;
                    bookNotes[2]["content"] = dushi;
                    bookNotes[3]["content"] = gift;

                    this.setData({"bookNotes":bookNotes});

                }
            })
        },

        //初始化MP3
        initBookMp3:function(){
            
            var innerAudioContext     = wx.createInnerAudioContext()
            const bookInfo              = this.data.bookInfo;

            innerAudioContext.src       = bookInfo.mp3;
            console.log('--------------');
            console.log(innerAudioContext.src);
            innerAudioContext.onCanplay(() => 
            {

                innerAudioContext.duration ;//类似初始化-必须触发-不触发此函数延时也获取不到
            
                var audioInfo = {

                    "title": bookInfo.BookTitle,
                    "author":"老侯",
                    "src": bookInfo.mp3,
                };

                setTimeout(() => {

                    //设置总的时间

                    audioInfo.timeLength    = innerAudioContext.duration;
                    audioInfo.timeCurrent   = 0; //这里要根据用户的历史记录来决定

                    audioInfo.textTimeLength= common.numberToTime(audioInfo.timeLength);
                    audioInfo.textTimeCurrent=common.numberToTime(0);

                    this.setData({"audioInfo":audioInfo});

                }, 500)  //这里设置延时1秒获取
            })
        },

        playAudio:function(){

            this.setData({"mp3Playing":true});
            var bgMusic          = wx.getBackgroundAudioManager();
            var audioInfo        = this.data.audioInfo;

            bgMusic.title        = audioInfo.title;
            bgMusic.src          = audioInfo.src;
            bgMusic.currentTime  = audioInfo.timeCurrent;
            bgMusic.timeLength   = audioInfo.timeLength;

            bgMusic.onTimeUpdate((res)=>{

                var currentTime = bgMusic.currentTime;

                this.setData({ ["audioInfo.timeCurrent"]: currentTime, ["audioInfo.textTimeCurrent"]:common.numberToTime(currentTime)});

            });

            bgMusic.play();
        },

        pauseAudio:function(){
            this.setData({ "mp3Playing": false });
            wx.getBackgroundAudioManager().pause();
        }
})