var system  = wx.getSystemInfoSync();
var perVw   = system.windowWidth / 100;
var app     = getApp();

Page({
    data: {
        sentences: [],
        page:0,
        showSwiper:false,
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 500,
        index:0,
        leftHeight:45,
        rightHeight:45,
        activeHeight:90,
        winHeight: system.windowHeight,
        winWidth: system.windowWidth
    },
    onLoad:function(options){
        
        if(options.sentenceId > 0)
        {
            this.prevImgs([options.sentenceId],0);
        }
        this.getSentences();
    },
     /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.getSentences();
    },
    swiperChange:function(e){
        return;
        this.setData({index:e.detail.current});
    },
    move:function(res){
        return;
        const query = wx.createSelectorQuery()
        var bilie = 142/90;
        query.select('#item-' + this.data.index).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
            
            
            var left = res[0].left;
            if(left == 90){
                
                return;
            }

            var moveVw  = left / perVw;

            var endVw   = 40;

            var dis     = 90-40;

            var perdis = dis / 
            
            this.setData({ "activeHeight": 90 - left/5});

            //console.log(this.data.activeHeight);

        })
    },
    stopMove:function(){

    },
    getSentences:function(){

        var url = app.data.api + "bookSentence/getSentences";
        var data = {page:this.data.page+1,userId:this.data.userId};
        app.request(url,data,(res,error)=>{
            res = res.data;
            if(res.data.sentences.data.length > 0){
                this.setData({
                    sentences:this.data.sentences.concat(res.data.sentences.data),
                    page:res.data.sentences.current_page
                })    
            }
        })

    },
    previewImage:function(e){
        
        var host = "https://wx.laohoulundao.com/api/v6/bookSentence/sentence_img?";
        var id      = e.currentTarget.dataset.id;
        var current = host + "sentenceId=" + id + "&userId="+app.data.userId;

        var urls = [];
        
        for(var img of this.data.sentences){

            urls.push(host + "sentenceId=" + img.id + "&userId="+app.data.userId);
        }
        
        wx.previewImage({
            urls:urls,
            current:current
        })
    },
    closeSwiper:function(e){

        this.setData({showSwiper:false});
    },
    download:function(){



    }
})