var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        departmentId:-1,
        members:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
        this.getMembers();
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
    getMembers:function(){


        var url = app.data.api + "readparty/get_read_party_member";
        var data = {
                readPartyId:this.data.readPartyId,
                departmentId:this.data.departmentId
            };

            app.request(url,data,(res,error)=>{

                res = res.data;

                this.setData({members:res.data.members});
            });

    }
})