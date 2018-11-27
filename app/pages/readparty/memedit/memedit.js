// pages/readparty/memedit/memedit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index:0,
        selectedDepartment:"请选择",
        departments:['美国', '中国', '巴西', '日本']
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
    showDepartment:function(){

         wx.showActionSheet({
          itemList:this.data.departments,
          success (res) {
            console.log(res.tapIndex)
          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
    }

})