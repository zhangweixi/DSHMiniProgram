// pages/book/detail/detail.js
var common  = require('../../../common.js');
var app     = getApp();

Page({
        /**
        * 页面的初始数据
        */
        data: {
            "bookInfo":{},
            "readPlanId":0,
            "isEditing":false,
            "pptDownloading":false,
            "bookNotes":[
                { "type": "book", "placeholder":"通过此次代读，对我启发最大的一个知识点是？","title":"读 书"},
                { "type": "people", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 人"},
                { "type": "thing", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 事" },      
                { "type": "gift", "placeholder":"通过这个知识点，在工作上改进的是？","title":"赠礼物"}
            ],
            "mediaType":"mp4",
            "contentType":"ppt",
            "display":'',
            "audioInfo":{},
            "mp3Playing":false,
            "mp4Playing":false,
            "autoPlayMp4":false,
            "haveRight":false,
            "app":app,
            "email": "",
            "mp4CurrentTime":0,
            "mp3CurrentTime":0,
            "mp4TimeId":0,
            "mp3TimeId":0,
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

                
                if (app.data.userId > 0 && app.data.userInfo.vipTimeIsValid == 1){

                    this.setData({ "haveRight": true });

                }else{
                    console.log("用户不存在");
                }

                
            },2000);
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
                    bookId:this.data.bookId,
                    userId:5164
                },    
                success: (res) => {
            
                    res = res.data;
                    var bookInfo = res.data.bookInfo;
                    var data = {
                        "bookInfo":bookInfo,
                        "mp4CurrentTime":bookInfo.mp4CurrentTime,
                        "haveRight":bookInfo.IsGratis == 1 ? true : false
                    };
                    this.setData(data);
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

                    this.setData({ "bookNotes": bookNotes,"readPlanId":readplanInfo.SumUpID});

                }
            })
        },

        //初始化MP3
        initBookMp3:function(){

            const bookInfo              = this.data.bookInfo;
            var innerAudioContext       = wx.createInnerAudioContext();
            var bgMusic                 = wx.getBackgroundAudioManager();
                
            wx.getBackgroundAudioPlayerState({
                success:(res)=>{
                   
                   console.log(res);
                    if(res.status == 1){

                        this.setData({"mp3Playing":true});

                        bgMusic.onTimeUpdate((res)=>{

                            var currentTime = bgMusic.currentTime;
                            if(currentTime == 0)
                            {
                                return;
                            }
                            var data = { 
                                ["audioInfo.timeCurrent"]: currentTime, 
                                ["audioInfo.textTimeCurrent"]:common.numberToTime(currentTime),
                            };
                            this.setData(data);

                            //记录时间
                            this.recordMediaTime(currentTime,"lhddmp3");
                        });

                    }
                        
                    this.initBookMp3Action();
                    
                },
                fail:(res)=>{
                    this.initBookMp3Action();
                }
            });
        },
        initBookMp3Action:function(){
            console.log("初始化MP3");
            const bookInfo              = this.data.bookInfo;
            var innerAudioContext       = wx.createInnerAudioContext();
            innerAudioContext.src       = bookInfo.mp3;
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
                    audioInfo.timeCurrent   = bookInfo.mp3CurrentTime; //这里要根据用户的历史记录来决定

                    audioInfo.textTimeLength= common.numberToTime(audioInfo.timeLength);
                    audioInfo.textTimeCurrent=common.numberToTime(0);

                    this.setData({"audioInfo":audioInfo});

                }, 500)  //这里设置延时1秒获取
            })
        },
        //开始播放音频
        playAudio:function(){

            //if(this.checkHaveRight() == false){
                
            //    return false;
            //}

            this.setData({"mp3Playing":true});
            var audioInfo        = this.data.audioInfo;

            var bgMusic          = wx.getBackgroundAudioManager();
                bgMusic.title    = audioInfo.title;
            
        
            bgMusic.onTimeUpdate((res)=>{

                var currentTime = bgMusic.currentTime;
                if(currentTime == 0)
                {
                    return;
                }

                var data = { 
                    ["audioInfo.timeCurrent"]: currentTime, 
                    ["audioInfo.textTimeCurrent"]:common.numberToTime(currentTime),
                };
                this.setData(data);

                //记录时间
                this.recordMediaTime(currentTime,"lhddmp3");
            });

            if(typeof(bgMusic.src) != 'undefined' && bgMusic.src == audioInfo.src){ //已经播放过，这里只是继续播放

                bgMusic.play();
                return;

            }else{
                console.log('开始播放');
                var currentTime     = audioInfo.timeCurrent;
                bgMusic.src         = audioInfo.src;

                bgMusic.onCanplay(()=>{

                    bgMusic.play();
                })
                
                //wx.seekBackgroundAudio({
                //    position: currentTime
                //});

                setTimeout(()=>{
                        
                    bgMusic.seek(currentTime);

                },500);
            }
           
        
        },
        //暂停
        pauseAudio:function(){
            this.setData({ "mp3Playing": false });
            wx.getBackgroundAudioManager().pause();
        },

        //改变音频播放的时间
        changeAudioTime:function(e){

            if(this.checkHaveRight() == false){
                return;
            }

            var timeType    = e.currentTarget.dataset.type;
            var currentTime = this.data.audioInfo.timeCurrent;
            var changeTime  = 15;

            
            if(timeType == 'add'){

                currentTime = currentTime + changeTime;

            }else{

                currentTime = currentTime - changeTime;
            }

            if(currentTime < 0){
                
                currentTime = 0;

            }else if(currentTime > this.data.audioInfo.timeLength){

                currentTime = this.data.audioInfo.timeLength;
            }

            wx.seekBackgroundAudio({
                position: currentTime
            })
        },
        //设置音频播放的时间
        setAudioTime:function(e){
            
            if (this.checkHaveRight() == false) {
                return;
            }

            var time        = e.detail.value;
            var timeText    = common.numberToTime(time);
            this.setData({["audioInfo.timeCurrent"]:time,["audioInfo.textTimeCurrent"]:timeText});
            
            wx.seekBackgroundAudio({
                position: time,
            });
            
        },

        playMp4:function(e){
            
            if(this.data.mp4Playing == true){

                return;
            }

            if(this.checkHaveRight() == false){
            
                setTimeout(($res)=>{
                    wx.createVideoContext("mp4").pause();
                },500);

                return;
            }

            if (this.data.mp3Playing == true){

                this.setData({"mp3Playing":false});
                wx.getBackgroundAudioManager().pause();
            }
            var time  = this.data.mp4CurrentTime;
            
            console.log(time);

            if( time > 1){

                time = time -1;
            }

            (wx.createVideoContext("mp4")).seek(time);
            this.setData({"mp4Playing":true});
        },
        /**
         * 暂停MP4
         * 
         */
        pauseMp4:function(){
            
            this.setData({ "mp4Playing": false });

        },

        finishMp4:function(){

            this.setData({ "mp4Playing": false });
        },
        //记录MP4播放时间
        recordMp4PlayTime:function(e){

        
            var currentTime = parseInt(e.detail.currentTime + 0.99);

            this.recordMediaTime(currentTime,"lhddmp4");
        },

        //记录媒体播放时间
        recordMediaTime:function(currentTime,mediaType){
            
            var currentTime = parseInt(currentTime + 0.99);

            if(mediaType == 'lhddmp3'){

                if(this.data.mp3CurrentTime == currentTime){

                    return;
                }
                this.setData({mp3CurrentTime:currentTime});

                var timeId  = this.data.mp3TimeId;

            }else if(mediaType == 'lhddmp4'){

                if(this.data.mp4CurrentTime == currentTime){

                    return;
                }
                this.setData({mp4CurrentTime:currentTime});

                timeId  = this.mp4TimeId;

            }else{

                return;
            }


            if(app.data.userId == 0){

                return;
            }
            
            var url     = app.data.api + "book/record_media_time";

            var data    = {
                mediaId:this.data.bookId,
                mediaType:mediaType,
                timeId:timeId,
                currentTime:currentTime,
                userId:app.data.userId
            };

            app.request(url,data,(res,error)=>{

                res = res.data;

                var timeId = res.data.timeId;
                var data   = mediaType == "lhddmp4" ? {mp4TimeId:timeId}:{mp3TimeId:timeId};
                this.setData(data)
            });
        },
        /**
         * 检查是否有权限
         * 如果本书不是免费的书籍，则需要判断用户是否是登录
         * 
         * 
         * */
        checkHaveRight:function(){

            
            var isFree = this.data.bookInfo.IsGratis;
            
            if (isFree == 1){ //书籍免费

                return true;
            }
            
            //2.判断是否登录
            console.log(app.data.userId);
            if(app.data.userId == 0){
              
                common.confirm(this,"请先登录","需要前往登录吗？",function(){

                    wx.switchTab({
                        url: '/pages/user/center/center',
                    });

                },"去登录","取消");
                
                return false;

            } else if (app.data.userInfo.vipTimeIsValid == 0){

                common.confirm(this, "您的会员已到期", "继续续费？", function () {

                    wx.switchTab({
                        url: '/pages/user/center/center',
                    });

                }, "续费", "取消");

                return false;
            }

            return true;
        },

        openEdit: function(){

            this.setData({ isEditing:true});

        },
        /**
         * 填写/编辑读书改进计划
         * 
         * */
        edit_read_plan:function(e){

            if(this.checkHaveRight == false || app.data.userId == 0){
                
                wx.showToast({
                    title: '请登录',
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                })
                return false;
            }

            var url = app.data.api + "book/edit_read_plan";

            console.log(e.detail.value);
            var data = e.detail.value;
                data.userId = app.data.userId;
                data.bookId = this.data.bookId;
                data.readPlanId = this.data.readPlanId;

            
            wx.request({
                url: url,
                data:data,
                method:"POST",
                success:(res)=>{
                    res = res.data;
                    if(res.code == 200){

                        this.setData({ readPlanId: res.data.sumupId, isEditing:false});

                        common.showDialog(this,"保存成功","success");
                    }
                }
            })
        },

        //显示下载输入框
        showDownload:function(){
            
            var mp4time = this.data.mp4CurrentTime;
            setTimeout(()=>{
                this.setData({mp4CurrentTime:mp4time});
            },2000);

            if(this.data.mp4Playing == true){

                this.setData({ autoPlayMp4 : true });    
            }
            this.setData({ pptDownloading:true});

            if(app.data.userId > 0){

                var email = app.data.userInfo.email;

            }else{
                var email = "";
            }
            common.confirmInput(this,email,"发送PPT","我们会将PPT直接发送到您邮箱",this.downloadppt,this.cancelDownload,"确定","取消");
        },

        //下载PPT
        downloadppt:function(e){

            var url     = app.data.api + "book/send_book_ppt";
            var email = e.detail.value.confirminput;
            
            var data = {

                email:email,
                userId:app.data.userId ? app.data.userId : 0,
                bookId:this.data.bookInfo.BookID

            };

            wx.showLoading({
                title: '请稍等',
            });
           

            wx.request({
                url: url,
                data:data,
                method:'POST',
                success:(res)=>{

                    res = res.data;

                    if(res.code == 200){

                        this.setData({ pptDownloading: false });

                        common.confirmInputClose(this);

                        if (this.data.autoPlayMp4 == true) {
                           wx.createVideoContext("mp4").play();
                            
                            var video =  wx.createVideoContext("mp4");
                            video.seek(this.data.mp4CurrentTime);
                            video.play();

                           this.setData({ autoPlayMp4: false });
                        }
                        app.data.userInfo.email = email;

                        wx.hideLoading();
                        wx.showToast({
                            title: '已发送',
                        })
                        //common.showDialog(this,"已发送", "success");

                   }else{
                        //common.confirmInputClose(this);
                        common.showDialog(this, res.message,"warning");
                   }
                }
            });
        },

        //取消下载PPT
        cancelDownload:function(){

            this.setData({ pptDownloading: false });

            if (this.data.autoPlayMp4 == true) {

                var video =  wx.createVideoContext("mp4");
                video.seek(this.data.mp4CurrentTime);
                video.play();

                this.setData({ autoPlayMp4: false });
            }

        },
        toCommentPage:function(){

            wx.navigateTo({
                url: '/pages/book/comments/comments?bookId='+this.data.bookInfo.BookID,
            })
        }
})