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
            "h_book":120,
            "h_people":120,
            "h_thing":120,
            "h_gift":120,
            "mediaType":"mp4",
            "contentType":"note",//note|ppt
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
            "prevTime":180,
            "online":1,
        },

        /**
        * 生命周期函数--监听页面加载
        */
        onLoad: function (options) {
            
            this.setData({"bookId":options.bookId})
            console.log(app.data.online);

            if(app.data.online == 0)
            {

                this.setData({ "mediaType": "mp3",'online':0 });
            }

            this.init(options);
            return;
            setTimeout(()=>{

                this.init(options);  

            },app.data.debugTime);
        },
        init:function(){
            
            this.getBookInfo();

            this.getUserReadPlan();

            if (app.data.userId > 0 && app.data.userInfo.vipTimeIsValid == 1){

                this.setData({ "haveRight": true });
            }
        },
        /**
        * 用户点击右上角分享
        */
        onShareAppMessage: function () {
            //判断当前显示的是什么
            //1.是读书计划
            //2.书籍内容
            var bookInfo = this.data.bookInfo;

            var title   = "老侯周课：《"+bookInfo.BookTitle+"》\n"+ bookInfo.BookDesc;
            var path    = "/pages/book/detail/detail?bookId="+bookInfo.BookID;
            var img     = bookInfo.ppts[0];

            if(this.data.contentType == 'note'){

                //判断是否有读书改进计划
                if(this.data.readPlanId > 0){

                    path = "/pages/book/readplan/readplan?bookId="+bookInfo.BookID+"&userId="+app.data.userId;
                    title= app.data.userInfo.NickName+"学习《"+bookInfo.BookTitle+"》的改进计划";
                }
            }

            return {
                title:title,
                path:path,
                imageUrl:img
            };
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
           
            var url     = app.data.api + "book/book_detail";
            var data    = {
                    bookId:this.data.bookId,
                    userId:app.data.userId
                };

            app.request(url,data,(res,error)=>{
                console.log(res);
                res = res.data;
                var bookInfo = res.data.bookInfo;
                bookInfo.online = 0;
                var data = {
                    "bookInfo":bookInfo,
                    "mp4CurrentTime":bookInfo.mp4CurrentTime
                };
                this.setData(data);
                wx.setNavigationBarTitle({title: bookInfo.BookTitle});
                this.setData({haveRight:this.checkHaveRight()});
                //设置时间
                this.initBookMp3();
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
                    

                    this.setData({ 
                        "n_book":dushu,
                        "n_people":duren,
                        "n_thing":dushi,
                        "n_gift":gift,
                        "readPlanId":readplanInfo.SumUpID
                    });

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
                    
                    //这里的播放有两种状态
                    //1.其他音乐
                    //2.本书籍的音乐

                    if(res.status == 2){ //没有背景音乐

                        this.initBookMp3Action();
                        return;
                    }

                    //有背景音乐，但是不是本书
                    var musicData   = common.bgMusic.getData(); 

                    if(musicData.src != this.data.bookInfo.mp3){

                        common.bgMusic.parse();     //暂停其他音频

                        this.initBookMp3Action();   //初始化音频

                        return;
                    }

                
                    //有背景音乐，是本书，但是处于暂停
                    //需要将时间设置为当前时间

                    var currentTime = musicData.timeCurrent;
                    var timeLength  = musicData.timeLength;


                    if(res.status == 0){ //暂停状态中

                        this.setData({mp3Playing:false});

                    }else if(res.status == 1){//正在播放

                        this.setData({mp3Playing:true});    
                    }

                    var audioInfo               = this.data.audioInfo;
                    audioInfo.timeCurrent       = currentTime;
                    audioInfo.textTimeCurrent   = common.numberToTime(currentTime);
                    audioInfo.timeLength        = timeLength;
                    audioInfo.textTimeLength    = common.numberToTime(timeLength);
                    this.setData({audioInfo:audioInfo});


                    bgMusic.onTimeUpdate((res)=>{
                        
                        var currentTime     = bgMusic.currentTime;
                        var textCurrentTime = common.numberToTime(currentTime);

                        if(currentTime == 0)
                        {
                            return;
                        }

                        var audioInfo                   = this.data.audioInfo;
                            audioInfo.timeCurrent       = currentTime;
                            audioInfo.textTimeCurrent   = textCurrentTime;

                        this.setData({audioInfo:audioInfo});

                        common.bgMusic.setData({
                            timeCurrent:currentTime,
                            textTimeCurrent: textCurrentTime
                        })

                        //记录时间
                        common.bgMusic.recordMediaTime(this.data.bookId,"lhddmp3",currentTime,false);

                        //检查试听是否结束
                        this.checkPreView(currentTime, "mp3");
                    });
                },
                fail:(res)=>{

                    console.log('获取状态失败');
                    this.initBookMp3Action();
                }
            });
        },
        initBookMp3Action:function(){
            
            const bookInfo              = this.data.bookInfo;
            var innerAudioContext       = wx.createInnerAudioContext();
            innerAudioContext.src       = bookInfo.mp3;
            var audioInfo = {
                "title": bookInfo.BookTitle,
                "author":"老侯",
                "src": bookInfo.mp3,
                "timeCurrent":bookInfo.mp3CurrentTime,
                "textTimeCurrent":common.numberToTime(bookInfo.mp3CurrentTime)                        
            };

            this.setData({"audioInfo":audioInfo});


            innerAudioContext.onCanplay(() => 
            {
                innerAudioContext.duration //触发一次

                setTimeout(()=>{

                    var timeLength  = innerAudioContext.duration;
                    var audioInfo               = this.data.audioInfo;
                        audioInfo.timeLength    = timeLength;
                        audioInfo.textTimeLength= common.numberToTime(timeLength);
                    
                        this.setData({"audioInfo":audioInfo});

                },1000)
            })
        },
        //开始播放音频，这里触发的音频，肯定是书籍音频
        playAudio:function(){

            if(this.checkHaveRight() == false){
                
               return false;
            }
            app.data.timeId = 0;
            this.setData({"mp3Playing":true});
            var audioInfo       = this.data.audioInfo;

            var bgMusic         = {
                id:this.data.bookId,
                fullTitle:audioInfo.title,
                title:audioInfo.title,
                type:'daidu',
                show:true,
                playing:true,
                timeLength:audioInfo.timeLength,
                timeCurrent:audioInfo.timeCurrent,
                textTimeCurrent:audioInfo.textTimeCurrent,
                textTimeLength:audioInfo.textTimeLength,
                src:audioInfo.src
            };

            common.bgMusic.setData(bgMusic);

            //如果有了，就不要再设置了
            var music = wx.getBackgroundAudioManager();
            if(music.src == this.data.bookInfo.mp3){

                music.play();
                return;
            }

            music.title         = bgMusic.title;
                
            music.onTimeUpdate(()=>{
                
            
                var timeCurrent = music.currentTime;
                var textTime    = common.numberToTime(timeCurrent);

                //console.log(music);

                if(timeCurrent == 0)
                {
                    return;
                }
 
                var audioInfo               = this.data.audioInfo;
                audioInfo.timeCurrent       = timeCurrent;
                audioInfo.textTimeCurrent   = textTime;
                audioInfo.timeLength        = music.duration;
                audioInfo.textTimeLength    = common.numberToTime(music.duration);


                this.setData({audioInfo:audioInfo});

                common.bgMusic.setData({
                    timeCurrent:timeCurrent,
                    textTimeCurrent:textTime
                });

                //记录时间
                common.bgMusic.recordMediaTime(this.data.bookId,'lhddmp3',timeCurrent,false);

                
                //检查试听是否结束
                this.checkPreView(timeCurrent, "mp3")
            });
            
           

            //音频播放结束
            music.onEnded(()=>{

                var audioInfo               = this.data.audioInfo;
                audioInfo.timeCurrent       = 0;
                audioInfo.textTimeCurrent   = common.numberToTime(0);

                //关闭当前音频
                this.setData({
                    audioInfo:audioInfo,
                    mp3Playing:false,
                });

                //关闭背景音频
                common.bgMusic.setData({
                    show:false,
                    playing:false
                });

                common.bgMusic.recordMediaTime(this.data.bookId,'lhddmp3',0,true);
            })


            //已经播放过，这里只是继续播放
            if(typeof(music.src) != 'undefined' && music.src == audioInfo.src){ 

                music.play();
                return;

            }else{
               
                var currentTime   = audioInfo.timeCurrent;
                music.src         = audioInfo.src;

                music.onCanplay(()=>{

                    music.play();
                })
                
                setTimeout(()=>{
                        
                    music.seek(currentTime);

                },500);
            }
        },
        //暂停
        pauseAudio:function(){
            this.setData({ "mp3Playing": false });
            wx.getBackgroundAudioManager().pause();
            common.bgMusic.setData({playing:false,show:false});
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
            
            console.log(currentTime);

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
                common.bgMusic.setData({show:false,playing:false});
            }

            var time  = this.data.mp4CurrentTime;
            
            if( time > 1){

                time = time -1;
            }

            app.data.timeId = 0;
            
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

            var currentTime = e.detail.currentTime;
            this.setData({mp4CurrentTime:currentTime});
            common.bgMusic.recordMediaTime(this.data.bookId,"lhddmp4",currentTime,false);

            //检查预览时间是否已到
            this.checkPreView(currentTime,"mp4");
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
            if(app.data.userId == 0){
              
                common.confirm(this,"请先登录","需要前往登录吗？",function(){

                    wx.switchTab({
                        url: '/pages/user/center/center',
                    });

                },"去登录","取消");
                
                return false;

            } else {

                return true;    
            }
        },
        checkPreView: function (time,type) {
            
            if (this.data.bookInfo.IsGratis==0 && app.data.userInfo.vipTimeIsValid == 0 && time > this.data.prevTime && (this.data.mp3Playing || this.data.mp4Playing )) {


                if(type == "mp3"){

                    this.pauseAudio();
                    var tname = "听";

                }else if(type == "mp4"){

                    var tname = "看";
                    wx.createVideoContext("mp4").pause();
                }

                if (app.data.userInfo.States == 1) {

                    var title = "试" + tname +"已结束";
                    var msg = "权限到期，继续开通权限？";

                } else if (app.data.userInfo.States == 0) {

                    var title = "试" + tname +"已结束";
                    var msg = "前往获得学习权限";
                }

                

                common.showModel(title, msg, () => {
                    wx.navigateTo({ url: '/pages/user/upgrade/upgrade' });
                },()=>{console.log('cancel')});

                return false;

            } else {

                return true;
            }
        },
        openEdit: function(){

            this.setData({ isEditing:true});

        },
        changeLine:function(e){
            
            
            var id      = e.currentTarget.id;
            var lines   = e.detail.lineCount;
            var lineH   = 50;

            
            if(lines == 0){
                lines = 1;
            }
            var height  = lines * lineH;

            if(height < 100){

                height = 100;
            }

            height = height + 20;

            switch(id){
                case 'book':this.setData({h_book:height});break;
                case 'people':this.setData({h_people:height});break;
                case 'thing':this.setData({h_thing:height});break;
                case 'gift':this.setData({h_gift:height});break;

            }
        },
        /**
         * 填写/编辑读书改进计划
         * 
         * */
        edit_read_plan:function(e){

            if(!this.checkHaveRight()){
                
                return false;
            }

            var url = app.data.api + "book/edit_read_plan";

            
            var data = e.detail.value;
                data.userId = app.data.userId;
                data.bookId = this.data.bookId;
                data.readPlanId = this.data.readPlanId;

            if(data.book == '' && data.people == "" && data.thing == "" && data.gift == ""){

                common.showToast("内容全为空","none");
                return;
            }

            app.request(url, data, (res, error) => {

                res = res.data;
                if (res.code == 200) {

                    this.setData({ readPlanId: res.data.sumupId, isEditing: false });
                    common.showToast('保存成功', 'success');
                }else{
                    common.showToast(res.message, 'none');
                }
            })
            
            return;

            //检查敏感词
            wx.request({
                url: `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=`+wx.getStorageSync("accessToken"),
                method:"POST",
                data:{
                    content:data.book+data.people+data.thing+data.gift
                },
                success:(res)=>{
                    
                    if(res.data.errcode > 0){
                        common.showToast('您的内容包含敏感词', 'none');
                        return ;
                    }
                }
            })      

           
        },

        //显示下载输入框
        showDownload:function(){
            
            if(!this.checkHaveRight()){
                return;
            }
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
        },
        videoError:function(res){

            setTimeout(()=>{
                
                wx.createVideoContext("mp4").play();

            },1000);
            
            var url = app.data.api + "book/book_error";
            var data = {
                userId:app.data.userId,
                phone: app.data.platform,
                bookId:this.data.bookInfo.BookID,
                currentTime: this.data.mp4CurrentTime
            };

            app.request(url,data,(res,error)=>{})

        },
})