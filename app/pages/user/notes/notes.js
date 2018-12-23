// pages/user/notes/notes.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:0,
        notes:[],
        hasNextPage:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.getLearnTime();
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

        this.getLearnTime();
    },

    getLearnTime:function(){

        if(this.data.hasNextPage == false){

            return;
        }

        var url = app.data.api + "book/get_book_learn_time";

        var data = {
            userId:app.data.userId,
            page:this.data.page + 1
        };

        app.request(url,data,(res,error)=>{

            res = res.data;
            var learnTimes = res.data.learnTimes;

            this.setData({
                notes:this.data.notes.concat(learnTimes.data),
                page:learnTimes.current_page
            });


            if(learnTimes.data.length < learnTimes.per_page){

                this.setData({hasNextPage:false});
            }
        });
    }
})