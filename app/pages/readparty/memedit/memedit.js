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

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);

        setTimeout(()=>{

            common.readparty.cacheDepartments(this.data.readPartyId,(departments)=>{

                this.setData({departments:departments});
            });

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
    showDepartment:function(){
        
        var departmentNames = [];
        for(var depart of this.data.departments){

            departmentNames.push(depart.department_name);
        }
        wx.showActionSheet({
            itemList:departmentNames,
            success: (res) => {

                var d = this.data.departments[res.tapIndex];

                this.setData({selectedDepartment:d});
            }
        })
    },

    //添加会员
    addMember:function(e){

        var value = e.detail.value;

        var url = app.data.api + "readparty/add_read_party_member";
        var data = {

            managerUserId:app.data.userId,
            readPartyId:this.data.readPartyId,
            userMobile:value.mobile,
            userName:value.name,
            job:value.job,
            departmentId:this.data.selectedDepartment.department_id
        };

        app.request(url,data,(res,error)=>{

            var res = res.data;

            if(res.code == 200){

                common.showToast("添加成功","success",()=>{
                    wx.navigateBack({delta: 1});
                });
            }
        })

    }

})