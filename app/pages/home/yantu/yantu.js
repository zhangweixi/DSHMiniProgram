var system  = wx.getSystemInfoSync();
var perVw   = system.windowWidth / 100;

Page({
    data: {
        imgUrls: [
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf45113b259.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf45a539d3c.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf45c98c0b7.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf465ddda22.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf468439b15.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf4767c6ae1.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-09-30-speak-59cf47a595b22.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-10-09-speak-59db35aaba5b5.jpg",
            "https://wx.laohoulundao.com/admin/speakImg/2017-10-09-speak-59db35c7038cd.jpg",
        ],
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
  }
})