// pages/company/sort/sort.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeType:'week',
        showRule:false,
        hasNextPage:true,
        headThree:[],
        page:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData(options);

        setTimeout(()=>{

            this.getIntegral();

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

        this.getIntegral();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    changeType:function(e){

        var type = e.currentTarget.dataset.type;

        if(type == this.data.activeType){
            return;
        }

        this.setData({activeType:type,page:0,hasNextPage:true});

        this.getIntegral();
    },
    triggleRule:function(){

        this.setData({showRule:!this.data.showRule});
    },
    getIntegral:function(){
        
        if(this.data.hasNextPage == false){

            return;
        }

        var url = app.data.api + "readparty/page_integral_rank_list";
        
        var data = {
            userId:app.data.userId,
            readPartyId:this.data.readPartyId,
            timeType:this.data.activeType,
            page:this.data.page+1
        };

        wx.showLoading({
            title: '请稍等',
            mask: false,
        })
        
        app.request(url,data,(res,error)=>{
            
            wx.hideLoading();

            res = res.data;        

            var members     = res.data.members;
            var memberList  = members.data;

            if(memberList.length < members.per_page){

                this.setData({hasNextPage:false});
            }

            if(members.current_page == 1){


                this.setData({
                    headThree:[memberList[0],memberList[1],memberList[2]],
                    members:memberList.splice(3),
                    page:members.current_page
                });

            }else{

                this.setData({
                    members:this.data.members.concat(memberList),
                    page:members.current_page
                })
            }

        })
    }
})