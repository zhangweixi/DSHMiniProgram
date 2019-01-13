var app     = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        index:0,
        selectedDepartment:null,
        departments:[],
        departIndex:0,
        departNames:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);

        common.readparty.cacheDepartments(this.data.readPartyId,(departments)=>
        {
            this.setData({departments:departments});
            var departs = [];
            
            for(var depart of departments){

                departs.push(depart.department_name);                    
            }
            
            this.setData({departNames:departs});
        })        
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
    changeDepartment:function(e){
        
         this.setData({departIndex:parseInt(e.detail.value)});
    },

    //添加会员
    addMember:function(e){

        var values = e.detail.value;

        var url = app.data.api + "readparty/add_read_party_member";
        var department  = this.data.departments[values.department]; 

        var data = {

            managerUserId:app.data.userId,
            readPartyId:this.data.readPartyId,
            userMobile:values.mobile,
            userName:values.name,
            job:values.job,
            departmentId:department.department_id
        };

        app.request(url,data,(res,error)=>{

            var res = res.data;

            if(res.code == 200){

                var pages = getCurrentPages();
                var prev  = pages[pages.length - 2];
                prev.getMembers();

                common.showToast("添加成功","success");

                setTimeout(()=>{
                    wx.navigateBack({delta: 1});
                },2000);
            }
        })

    }

})