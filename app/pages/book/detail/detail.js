// pages/book/detail/detail.js
Page({
      /**
       * 页面的初始数据
       */
      data: {
          "bookNotes":[
              { "type": "book", "placeholder":"通过此次代读，对我启发最大的一个知识点是？","title":"读 书"},
              { "type": "people", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 人"},
              { "type": "thing", "placeholder": "通过这个知识点，在工作上改进的是？", "title":"读 事" },      
              { "type": "gift", "placeholder":"通过这个知识点，在工作上改进的是？","title":"赠礼物"}
          ],
          "mediaType":"mp3",
          "contentType":"note",
          "display":''
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
          
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

       showview: function() { 
          this.setData({
            display: "block"
          })
        },
        hideview: function() {
          this.setData({
            display: "none"
          })
        }


})