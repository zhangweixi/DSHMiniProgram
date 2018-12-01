var app = getApp();
var common  = require('../../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEdit:false,
        isManager:false,
        departments:[],
        editDepartmentId:0,
        readPartyId:0,
        companyId:0,
        selectedNum:0,
        selectedArr:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
        this.getDepartments();

        this.getReadPartyInfo();
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
    getReadPartyInfo:function(){

        var url = app.data.api + "readparty/get_read_party_detail";

        var data = {readPartyId:this.data.readPartyId};

        app.request(url,data,(res,error)=>{

            if(res.data.data.readPartyInfo.MemNumber == app.data.memNumber)
            {
                this.setData({isManager:true});
            }

        });
    },
    getDepartments:function(){

        var companyId   = this.data.companyId;
        var readPartyId = this.data.readPartyId;
        var departments = common.readparty.cacheDepartments(readPartyId,(departments)=>{

            for(var depart of departments)
            {
                if(this.data.selectedArr.indexOf(depart.department_id) > -1){
                    
                    depart.select = true;    

                }else{

                    depart.select = false;
                }
            }

            this.setData({departments:departments});
            this.freshSelectedArr();

        });
    },
    nav:function(e){

        if(this.data.isEdit == true){

            return;
        }
        var departmentId = e.currentTarget.dataset.departmentId;
        var url = "/pages/readparty/member/member?";
            url +="readPartyId="+this.data.readPartyId+"&departmentId="+ departmentId;
        wx.navigateTo({
            url: url
        });
    },
    activeEdit:function(e){

        var isEdit = e.currentTarget.dataset.edit;
            isEdit = isEdit == 1 ? true : false;
        this.setData({isEdit:isEdit});
    },
    freshSelectedArr:function(){

        var selectedArr = [];

        for( var depart of this.data.departments){

            if(depart.select){

                selectedArr.push(depart.department_id);
            }
        }

        var num = selectedArr.length

        this.setData({selectedArr:selectedArr,selectedNum:num});
    },
    selectDepartment:function(e){

        var dataset      = e.currentTarget.dataset;
        var departmentId = dataset.departmentId;
        var select       = dataset.select;
        var departments = this.data.departments;
       
        for(var part of departments){

            if(part.department_id == departmentId){

                part.select = ! part.select;
            }
        }

        this.setData({departments:departments});
        this.freshSelectedArr();
    },
    showEditInput:function(e){
       
        var type = e.currentTarget.dataset.type;
        var editDepartmentId = 0;
        if(type == 'add'){
            
            var title   = "添加部门";
            var msg     = "请输入部门名称";
            var val     = "";

        }else if(type == 'edit'){


            var title   = "修改部门";
            var msg     = "请输入新部门名称";
            var val     = "";
            var num     = 0;
            

            for(var depart of this.data.departments){
                
                if(depart.select){

                    num ++;
                    val = depart.department_name;
                    editDepartmentId = depart.department_id;
                }
            }

            if(num != 1){

                return;
            }
        }
        this.setData({editDepartmentId:editDepartmentId});
        common.confirmInput(this,val,title,msg,this.editDepartment,null,"确定","取消");
    },
    editDepartment:function(e){
        
        var departmentName = e.detail.value.confirminput;

        //检查部门不能为空
        if(departmentName.length == 0){

            wx.showToast({
                title: '名称不能为空',
                icon: 'none', 
            })
            return;
        }

        //检查是否已经存在
        for(var depart of this.data.departments){

            if(depart.department_name == departmentName){

                wx.showToast({
                    title: '部门已存在',
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false
                })

                return;
            }
        }


        var url = app.data.api + "company/add_department";
        var data = {
            departmentId:this.data.editDepartmentId,
            departmentName:departmentName,
            readPartyId:this.data.readPartyId,
            companyId:this.data.companyId,
            userId:app.data.userId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                common.confirmInputClose(this);

                wx.showToast({
                    title: '成功',
                    icon: 'success', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                    success: (res) => {
                        this.getDepartments();    
                    }
                })
            }
        });
    },
    deleteDepartment:function(){

        wx.showModal({
            title: '删除部门',
            content: '删除后不可恢复，确定吗',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (res) => {

                if(res.confirm) {
                    this.deleteDepartmentAction();
                }
            }
        })
    },
    deleteDepartmentAction:function(){

        var url = app.data.api + "company/delete_department";

        var data = {
            departments:this.data.selectedArr.join(','),
            companyId:this.data.companyId,
            readPartyId:this.data.readPartyId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                this.getDepartments();
            }
        })

    }

})