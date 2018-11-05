// pages/book/search/search.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyKeywords:[],
        hotKeywords: [],
        keywords:'',
        page:1,
        books:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.getSearchKeywords();
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
        
        if(this.data.canFreshBook == true){

            this.getBooks();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 提示删除历史搜索 
     */
    deleteHistorySearchKey: function () {
        getApp().common.confirm(this, "确认删除", "删除后将不可恢复哦", this.deleteHistorySearchKeyAction)
    },

    /**
     * 删除历史搜索
     */
    deleteHistorySearchKeyAction:function(){

    },

    getSearchKeywords:function(){

        wx.request({
            url: app.data.api+"book/get_search_keywords",
            data: {
                userId:app.data.userId ? app.data.userId : 0
            },
            method:'POST',
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                res = res.data;

                this.setData(res.data);
            }
        })
    },

    getSearchBook:function(e){

        var keywords = e.detail.value;

        if(keywords == this.data.keywords){

            return;
            
        }
        
        this.setData({"keywords":keywords,"page":1,"canFreshBook":true});    

        this.getBooks();
    },
    getBooks:function(){

        var url   = app.data.api + "book/get_book_list";
        var page  = this.data.page;
        this.setData({"page":page+1});

        wx.request({
            url: url,
            method:"POST",
            data: {
                page:page,
                keywords:this.data.keywords,
                userId:app.data.userId,
            },
            success: (res) => {
                var data      = res.data.data;
                var bookInfo  = data.books;
                var books     = bookInfo.data;
                var page      = bookInfo.current_page;

                if(books.length == 0){

                    this.setData({"canFreshBook":false})

                    return;
                }

               
                //将新的数据放到旧的后面
                this.data.books   = this.data.books.concat(books);
      
                this.setData({"books":this.data.books});
            }
        })
    }
        
})