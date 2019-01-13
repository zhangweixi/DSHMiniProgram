// pages/readparty/memdetail/memdetail.js
var app =getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEdit:false,
        isAdmin:false,
        memberInfo:null,
        isSelf:false,
        departments:[],
        departNames:[],
        waitingMember:false,
        departIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        //common.readparty.cache(options.readPartyId);

        setTimeout(()=>{

            this.setData(options);
            this.getReadPartyMmeberInfo();

            if(this.data.userId == app.data.userId){

                this.setData({isSelf:true});
            }

            var readpartyInfo = common.readparty.get();

            if(readpartyInfo.MemNumber == app.data.memNumber){

                this.setData({isAdmin:true});
            }
            this.setData({readPartyInfo:readpartyInfo});


            


            setTimeout(()=>{

                this.getDepartments();

            },1000);

        },app.data.debugTime);
        
    },
    getDepartments:function(){

        common.readparty.cacheDepartments(this.data.readPartyId,(departments)=>
        {

            this.setData({departments:departments});
            var departs = [];
            var i       = 0;
            var departIndex = 0;

            for(var depart of departments){

                //查找当前的index
                if(depart.department_id == this.data.memberInfo.department_id){

                    departIndex = i;
                }
                departs.push(depart.department_name);
                i++;
            }
            
            this.setData({departNames:departs,departIndex:departIndex});
        })
    },
    onShow:function(){

        if(this.data.waitingMember){ //等待选择一个会员

            this.confirmNewManager();
        }
    },
    //触发编辑状态
    activeEdit:function(){

        this.setData({isEdit:true});
    },
    cancelEdit:function(){

        this.setData({isEdit:false});  
    },
    //获取成员详细信息
    getReadPartyMmeberInfo:function(){


        var url = app.data.api + "readparty/read_party_member_detail";

        var data = {readPartyId:this.data.readPartyId,userId:this.data.userId};

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                var memberInfo = res.data.memberInfo;

                memberInfo.leanTime = (memberInfo.leanTime / 3600).toFixed(2);
                memberInfo.AddDate  = memberInfo.AddDate.substr(0,11);

                this.setData({memberInfo:memberInfo});
            }

        })
    },

    //编辑信息
    editMemberInfo:function(e){

        var memberInfo  = this.data.memberInfo;
        var values      = e.detail.value;

        var department  = this.data.departments[values.department]; 


        var data = {
            readPartyId:this.data.readPartyId,
            departmentId:department.department_id,
            memberUserId:memberInfo.UserID,
            userMobile:values.mobile,
            job:values.job,
            managerUserId:app.data.userId
        };

        //检查数据
        if(data.job.length == 0){

            common.showToast("职位为空",'none');
            return;
        }

        if(data.userMobile.length == 0){

            common.showToast('手机号为空','none');
            return;
        }


        wx.showLoading({
            title: '请稍等',
            mask: false,
        })
        
        
        var url = app.data.api+ "readparty/update_read_party_member";
        app.request(url,data,(res,error)=>{
            
            wx.hideLoading();
            res = res.data;
            if(res.code == 200){

                common.showToast("",'success');
                this.setData({isEdit:false});
                this.freshPrev();
            }
            
        })
    },
    deleteMember:function(){

        wx.showModal({
            title: '删除成员',
            content: '不可撤销，确定删除吗',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (res) => {
                // res.confirm 为 true 时，表示用户点击了确定按钮
                if(res.confirm) {

                    this.deleteAction();
                }
            }
        })

    },
    deleteAction:function(){

        var url     = app.data.api + "readparty/manager_remove_read_party_member";
        var data    = {
            memberUserId:this.data.memberInfo.UserID,
            readPartyId:this.data.readPartyId,
            managerUserId:app.data.userId
        }; 
        
        wx.showLoading({
            title: '请稍等',
            mask: false
        })

        app.request(url,data,(res,error)=>{

            wx.hideLoading();

            res = res.data;

            if(res.code == 200){

                common.showToast("已删除","success");
                this.freshPrev();
                setTimeout(()=>{

                    wx.navigateBack({delta: 1});    

                },1000);
            }
        });
    },
    //改变部门
    changeDepartment:function(e){

       this.setData({departIndex:parseInt(e.detail.value)});
    },
    replaceManager:function(){

        this.setData({waitingMember:true});    
        wx.setStorageSync('waitingMember', true)
    
        //显示通讯录
        wx.navigateTo({
            url: '/pages/readparty/member/member?from=memberdetail&readPartyId='+this.data.readPartyId
        })
    },
    //确定新的管理员
    confirmNewManager:function(){ 

        var newMember = wx.getStorageSync('selectedMember');
        wx.removeStorageSync("waitingMember");
        wx.removeStorageSync('selectedMember');

        if(!newMember){

            return;
        }

        common.showModel("权限转让","确定将管理员转给"+newMember.YourName+"吗",()=>{

            this.replaceManagerAction(newMember);

        },null);
    },
    //提交转让管理员
    replaceManagerAction:function(newMember){

        var url = app.data.api+ "readparty/assignmentAdmin";
        var data = {
            userId:newMember.UserID,
            memNumber:app.data.memNumber,
            readPartId:this.data.readPartyId
        };

        app.request(url,data,(res,error)=>{
            res = res.data;

            if(res.code == 200){

                //刷新前一页的数据
                this.setData({isAdmin:false});
                common.showToast(res.message);    

            }else{

                common.showToast(res.message,"none");
            }
            
            
            common.readparty.cache(this.data.readPartyInfo.ReaParID,null);
            this.freshPrev();
        });
    },
    freshPrev:function(){

        //通知前一个界面
        var pages   = getCurrentPages();
        var prevPage= pages[pages.length -2];
        prevPage.getMembers();
    }
})