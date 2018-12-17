// pages/company/source/source.js
var app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeType:"all",
        hasNextPage:true,
        page:0,
        sources:[],
        types:[
            {title:"全部",active:1,type:'all'},
            {title:"视频",active:0,type:'video'},
            {title:"音频",active:0,type:'audio'},
            {title:"文章",active:0,type:'article'}
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
        this.getCompanySource();
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.getCompanySource();
    },
    changeType:function(e){

        var type = e.currentTarget.dataset.type;
        console.log(type);
        if(type == this.data.activeType){

            return;
        }


        var types = this.data.types;

        for(var t of types){

            t.active = t.type == type ? 1: 0;
        }

        this.setData({
            activeType:type,
            types:types,
            page:0,
            hasNextPage:true
        });

        this.getCompanySource();
    },

    //获得企业资源
    getCompanySource:function(){

        if(this.data.hasNextPage == false){

            return;
        }


        var url = app.data.api + "company/page_company_source";
        var data = {
            contentType:this.data.activeType,
            page:this.data.page+1,
            readPartyId:this.data.readPartyId
        };

        app.request(url,data,(res,error)=>{

            res             = res.data;

            var sources     = res.data.sources;

            if(sources.current_page == 1) {

                var newSources  = sources.data;

            }else{

                var newSources = this.data.sources.concat(sources.data);

            }

            var hasNextPage = sources.data.length < sources.per_page ? false : true;

            this.setData({
                hasNextPage:hasNextPage,
                sources:newSources,
                page:sources.current_page,

            });
        });
    }
})