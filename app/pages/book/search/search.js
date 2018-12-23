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
        books:[],
        hiddenClear:true
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
     * 提示删除历史搜索 
     */
    deleteHistorySearchKey: function () {
        getApp().common.confirm(this, "确认删除", "删除后将不可恢复哦", this.deleteHistorySearchKeyAction)
    },

    /**
     * 删除历史搜索
     */
    deleteHistorySearchKeyAction:function(){

        wx.request({
            url: app.data.api + "book/delete_search_keywords?userId="+app.data.userId,
            method:"POST",
            success: (res) => {

                this.getSearchKeywords();   
            }
        })
    },

    getSearchKeywords:function(){
        var url = app.data.api+"book/get_search_keywords";
        var data= {userId:app.data.userId ? app.data.userId : 0}
        app.request(url,data,(res,error)=>{

            res = res.data;

            this.setData(res.data);
        })
    },

    searchBook:function(e){
        var elementData = e.currentTarget.dataset;
        
        if(elementData.type == "input"){

            var keywords = e.detail.value; 
            if(keywords == this.data.keywords){

                return;
            }   

        }else{

            var keywords = elementData.value;
            this.setData({"keywords":keywords});
        }
        

        this.setData({
            "keywords":keywords,
            "page":1,
            "canFreshBook":true,
            "books":[],
            "hiddenClear":true
        });    
    
        this.getBooks();
        
        setTimeout(()=>{
            this.getSearchKeywords();
        },1000);
        
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

                }else{
                
                    //将新的数据放到旧的后面
                    this.data.books   = this.data.books.concat(books);
          
                    this.setData({"books":this.data.books});
                }

                this.setData({"isSearching":false})
            }
        })
    },
    showSearchKeywords:function(){
        this.setData({"hiddenClear":false});
    },
    clearKeywords:function(){
        this.setData({
            keywords:'',
            hiddenClear:true
        });
    }
})