var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      bookTypes:[],
      books:[],
      bookTypeId:0,
      canFreshBook:true,
      page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      this.getBooks();

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

  getBooks:function(){

    var url   = app.data.api + "book/get_readed_book_list";
    var page  = this.data.page;
    this.setData({"page":page+1});

    wx.request({
      url: url,
      method:"POST",
      data: {page:page,bookTypeId:this.data.bookTypeId,memNumber:app.data.memNumber},
      success: (res) => {

          var data      = res.data.data;
          var bookInfo  = data.books;
          var books     = bookInfo.data;
          var page      = bookInfo.current_page;

          if(books.length == 0){

            this.setData({"canFreshBook":false})

            return;
          }

          if(page == 1){

              this.setData({"lastBook":books[0]});
              books.splice(0,1);
          }

          //将新的数据放到旧的后面
          this.data.books   = this.data.books.concat(books);
  
          this.setData({"books":this.data.books});
      }
    })
  }
})