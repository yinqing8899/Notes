/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 导游设备
 * */
Ext.namespace("Ext.manager");
//设备编号 id 所属旅行社travelAgencyId
var guide_equipment_main_check_id,guide_equipment_main_check_travelAgencyId,guide_equipment_main_check_status;
var guide_equipment_checkClick = false;
var guide_equipment_refreshClick = false;
var guide_equipment_reLimit;
var displayGridCount = Math.floor((document.documentElement.clientHeight-207)/26) ;
Ext.manager.guide_enquip=Ext.extend(Ext.grid.GridPanel,{  //从Ext.grid.GridPanel中继承

    id : 'guide_enquip_table',
    border:false,
    loadMask: true,
    viewConfig: {
            forceFit: true,
            emptyText: '系统中还没有任务'
        },
    constructor:function(){//构件器
        	//清空变量
        	guide_equipment_main_check_id="";
        	guide_equipment_main_check_travelAgencyId="";
        	guide_equipment_main_check_status="";
        	
             //登录用户类型 1管理员 2旅行社
             var userType = LoginuserType;
            
             var equipmentNumb = ['0','1','2','3','4','5','6','7','8','9'];
             var status_combo = new Ext.data.ArrayStore({
                 fields:['id', 'text' ],
                 data: [
                         ['', '------------全部-----------'],
                         ['0', '备用'],
                         ['1', '在用'],           
                         ['2', '故障'],           
                         ['3', '报废'],           
                         ['4', '丢失']          
                 ]
         });   
         var topRecord = Ext.data.Record.create(
        		 [{
        			  name : 'id',
        			  type : 'string'
        		  }, 
        		  {
		               name : 'groupName',
		               type : 'string'
        		  }]
        );
        var firstOp = new topRecord({
        	groupName : "------------全部-----------",
	     	id : null
     	});
    	//旅行社下拉框获取
        var total_group_store = new Ext.data.Store({
//        	autoLoad:true,
            proxy:new Ext.data.HttpProxy({
            	method:'post',
            	url:basePath + "//allTotalGroupManagers.do",
            	success:function(data){}}),
            reader: new Ext.data.JsonReader(
                {
                    totalProperty: 'dataCount',
                    idProperty: 'id',
                    root: 'data'
                },
                [
                    { name: 'id',mapping:'id'},
                    { name: 'groupName', mapping:'name'}
                ]
            )
        });
        total_group_store.load({
        	callback:function(){
        		total_group_store.insert(0,firstOp);
        	}
        });
        this.store = new Ext.data.Store({
        			autoLoad:true,
                    proxy:new Ext.data.HttpProxy({
                    	method:'post',
                    	url:basePath + "//selGEByParam.do",
                    	success:function(data){
	                    	var _backInfo = data.responseText;
		      		 		  _backInfo = eval("(" + _backInfo+")"); 
		      		 		if(_backInfo.success=="false"&&_backInfo.message=="unlogin"){
		      		 			Ext.Msg.show({
		      						title: '提示',
		      						msg: '您已经长时间未操作或已经退出登录，请重新登录！',
		      						width: 300,
		      						buttons: Ext.Msg.OK,
		      						icon: Ext.Msg.INFO,
		      						fn:function(btn){
		      		 					var _path = _mainPath;
		      		 					//跳转登录界面
		      		 					window.location.href=_path+ "/index.do";
		      		 				}
		      					});
		      		 		}
                    }}),
                    reader: new Ext.data.JsonReader(
                        {
                            totalProperty: 'results',
                            idProperty: 'id',
                            root: 'data'
                        },
                        [
                            { name: 'id',type:'int'},
                            { name: 'type',mapping:'type'},
                            { name: 'travelAgencyId',mapping:'travelAgencyId'},
                            { name: 'travelAgency',mapping:'travelAgency'},
                            { name: 'phone',mapping:'phone'},
                            { name: 'bugStatus',mapping:'bugStatus'},
                            { name: 'workStatus',mapping:'workStatus'},
                            { name: 'status',mapping:'status'},
                            { name: 'beginDate',mapping:'beginDate'},
                            { name: 'endDate',mapping:'endDate'},
                            { name: 'productTime',mapping:'productTime'},
                            { name: 'createTime',mapping:'createTime'},
                            { name: 'operateType',mapping:'operateType'},
                            { name: 'inDate',mapping:'inDate'}
                        ]
                    ),sorters : [{
        		        property : 'id', // 指定要排序的列索引
        		        direction : 'ASC' // DESC：降序，  ASC：增序
        		    }]
                });
        this.store.on('beforeload',function(s,p){
        	var _start,_limit;
    		if(guide_equipment_refreshClick == false){
    			_start = p.params.start;
    			_limit = displayGridCount;
    		}else if(guide_equipment_refreshClick == true){//点击刷新的时候，刷新当前页
    			_start = (parseInt(guide_equipment_reLimit)-1)*displayGridCount;
    			_limit = p.params.limit;
    		}
    		if(guide_equipment_checkClick ==true){//每次点击查询的时候，默认回到第一页
    			_start=0;
    			_limit=15;
    		}
			p.params = {
					start:_start,
					limit:_limit,
					id:guide_equipment_main_check_id,//设备编号
					travelAgencyId:guide_equipment_main_check_travelAgencyId,//所属旅行社
					status:guide_equipment_main_check_status//设备状态
			};
			guide_equipment_checkClick = false;
			guide_equipment_refreshClick = false;
			console.log(document.body.clientHeight);
			console.info(Ext.getCmp("guide_enquip_table"));
    	});
		 var csm=new Ext.grid.CheckboxSelectionModel(); 
         var _columns = [
                      	csm,
                        {
                            header   : '设备编号', 
                            width    : "30%", 
                            align    : 'center',
                            sortable : true,
                            dataIndex: 'id',
                            css : 'color: green;',
  	                      menuDisabled :true
                        },
                        {
                            header   : 'SIM卡号', 
                            width    : 120, 
                            align    : 'center',
                            sortable : true,
                            dataIndex: 'phone' ,
  	                      menuDisabled :true
                        },
                        {
                     	   header   : '设备状态', 
                     	   width    : 75, 
                     	   align    : 'center',
                     	   sortable : true,
                     	   dataIndex: 'status' ,
                     	   renderer:function(val){
                         	   if(val==0){return '备用';}
                         	   if(val==1){return '在用';}
                         	   if(val==2){return '故障';}
                         	   if(val==3){return '报废';}
                         	   if(val==4){return '丢失';}
                            },
  	                      menuDisabled :true
                        },
                        {
                            header   : '开通日期', 
                            width    : 150, 
                            align    : 'center',
                            sortable : true,
                            id:'guide_eq_productTime_id',
                            dataIndex: 'beginDate',
                            renderer:function(v, p, record, rowIndex, index, store){
                        		var operateType = record.get("operateType");//4 为归还，如果是归还状态，则开通日期和截止日期就不显示了
                        		if(operateType==4||operateType==1){
                        			v = "";
                        		}
                        		return v;
                        	},
  	                      menuDisabled :true
                        },
                        {
                            header   : '截止日期', 
                            width    : 150, 
                            align    : 'center',
                            sortable : true,
                            dataIndex: 'endDate',
                            renderer:function(v, p, record, rowIndex, index, store){
	                    		var operateType = record.get("operateType");//4 为归还，1是出库如果是归还状态，则开通日期和截止日期就不显示了
	                    		if(operateType==4||operateType==1){
	                    			v = "";
	                    		}
	                    		return v;
	                    	},
		                      menuDisabled :true
                        }];
         if(userType =='1'){
 	    	_columns.splice(3,0, {
 	            header   : '所属旅行社', 
 	            width    : 120, 
 	            sortable : true,
 	            align    : 'center',
 	            dataIndex: 'travelAgency',
 	            renderer:function(value){
 	    			if(value==""){
 	    				value = "易通星云";
 	    			}
 	    			return value;
 	    		},
                menuDisabled :true
 	        });
 	    }
        Ext.manager.guide_enquip.superclass.constructor.call(this,{ //对父类初始化                 
        store: this.store, 
        mode :'SIMPLE',
        sm : csm,
        columns: _columns,
        listeners:{
        	'rowdblclick':function(grid, index, e){
        	var sm = grid.getSelectionModel();    
            var newFormData = sm.getSelected().data;
			 var prodectTime = newFormData.productTime.time;
			 var newTime = new Date(prodectTime); //就得到普通的时间了 
			 var _status = newFormData.status;
			 var win = new Ext.manager.win.guide_equipment_win(newFormData.status);
			 win.show(this);
			 if(newFormData.productTime&&newFormData.productTime.time){
					var prodectTime = newFormData.productTime.time;
					var newTime = new Date(prodectTime); //就得到普通的时间了 
					newFormData.productTime = newTime.format('Y-m-d');
				}
			 if(newFormData.travelAgencyId==""){
				 newFormData.travelAgency = "易通星云";
			 }
			 Ext.getCmp('guide_equipment_form_ids').getForm().setValues(newFormData);
			 Ext.getCmp('guide_eq_win_productTime_ids').setValue(newTime.dateFormat('Y-m-d'));
			 var _phone = newFormData.phone;
			 if(newFormData.status ==3){
				 Ext.getCmp('guide_eq_win_work_status_combo').setReadOnly(true);
			 }
			 if(_phone!=""){
				 Ext.getCmp('guideep_mobile_text_id').setReadOnly(true);
			 }
			 Ext.getCmp('guide_equipment_idss').setReadOnly(true) ;
	  	}
	},
        stripeRows: true,
        tbar:[
                     '设备编号： ' ,  
                    {
                        xtype:'textfield',
                        id:'enquip_serial',
                        width:140,
                        maxLength: 15,
                        emptyText:"请输入15位设备编号...",
                        enableKeyEvents:true,
                        listeners:{
                        	keyup:function(src,evt){
		                    	var str = evt.target.value;
		 		              	var newStr = str.substring(str.length-1);
		 		              	var index = equipmentNumb.indexOf(newStr);
		 		              	if (index=='-1'){
		 		              		var oldValue = Ext.getCmp('enquip_serial').getValue();
		 		              		var newValue = oldValue.substring(0,oldValue.length-1);
		 		              		Ext.getCmp('enquip_serial').setValue(newValue);
		 		              	}else{
		 		              		var factoryId= Ext.getCmp('enquip_serial').getValue();
		 		              		var length = factoryId.length;
		 		              		if(length>15){
		 		              			Ext.getCmp('enquip_serial').setValue(factoryId.substring(0,15));
		 		              		}
		 		              	}
                        	}
                        }
                    },
                    {
                    	xtype:'label',
                    	text:'所属旅行社：',
                    	style:{marginLeft:'15px'},
                    	id:'guide_eq_main_check_travelAgency_id'
                    },
                    {
	                    xtype:'combo',
	                    id:'guide_eq_belong_institute',
	                    hiddenName: 'travelAgencyId',
	                    anchor:'90%'  ,
	                    mode : 'local',//本地
	                    forceSelection: true,
	                    editable: false,
	                    store: total_group_store,
	                    valueField:'id',
	                    displayField:'groupName',
	                    typeAhead: true,
	                    triggerAction: 'all',
	                    selectOnFocus:true,//用户不能自己输入,只能选择列表中有的记录
	                    width:155,
	                    emptyText:"请选择旅行社..."
        			},'&nbsp&nbsp&nbsp&nbsp设备状态： ' ,
                    {
	                    xtype:'combo',
	                    id:'guide_equipment_main_check_status',
	                    hiddenName: 'status',
	                    anchor:'90%'  ,
	                    mode : 'local',//本地
	                    forceSelection: true,
	                    editable: false,
	                    store: status_combo,
	                    valueField:'id',
	                    displayField:'text',
	                    typeAhead: true,
	                    triggerAction: 'all',
	                    selectOnFocus:true,//用户不能自己输入,只能选择列表中有的记录
	                    width:155,
	                    emptyText:"请选择设备状态..."
        			},"   ",
                    { 
                    tooltip:"查询",
                    text:"查询",
                    icon:"images/filter.png",
                    style : {
                         marginRight : '5px'
                                },
                    handler:function(){
                    		this.searchfn();
                    },
                    scope:this
                 
                    },"   ",
                    {
                                tooltip:"导出excel",
                                text:"导出",
                                icon:"images/icon/excel-icon.png",
                                style : {
                                    marginRight : '5px'
                                },
                                handler : function() {
                                    var fileName = "导游设备信息";
                                 	var vExportContent = Ext.getCmp('guide_enquip_table').getExcelXml(fileName,guideEqFormatFun);
                                 	function guideEqFormatFun(f,v) {
                                 		if(f == "设备状态") {
                                 			if(v==0){return '备用';}
                                 			else if(v==1){return '在用';}
                                 			else if(v==2){return '故障';}
                                 			else if(v==3){return '报废';}
                                 			else if(v==4){return '丢失';}
                                 		} else if(f == "生产日期") {
                                 			if(!!v){
                                    			var newTime = new Date(v.time); 
                                    			return newTime.format('Y-m-d');
                                    		}
                                 		}
                                 		return v;
                                 	}
//                                 	 var vExportContent = grid.getExcelXml();
                                      //if (Ext.isChrome || Ext.isIE8||Ext.isIE6 || Ext.isIE7 || Ext.isSafari || Ext.isSafari2 || Ext.isSafari3) {
                                          var fd=Ext.get('frmDummy');
                                          if (!fd) {
                                              fd=Ext.DomHelper.append(Ext.getBody(),{tag:'form',method:'post',id:'frmDummy',action:'expertUrl.jsp', target:'_blank',name:'frmDummy',cls:'x-hidden',cn:[
                                                  {tag:'input',name:'fileName',id:'fileName',type:'hidden'}, 
                                                  {tag:'input',name:'exportContent',id:'exportContent',type:'hidden'}
                                              ]},true);
                                          }
                                          fd.child('#fileName').set({value:fileName}); 
                                          fd.child('#exportContent').set({value:vExportContent});
                                          fd.dom.submit();
                            }
                        }
                ] ,
             bbar:new Ext.PagingToolbar({
                pageSize:15,
                store:this.store, //设置数据源
                displayInfo: true,
                displayMsg:"当前 {0}-{1} 条记录 /共 {2} 条记录",
                emptyMsg: "无显示数据",
                doRefresh:function(){  
            	 	Ext.getCmp('guide_enquip_table').getSelectionModel().clearSelections(true);
            	 	guide_equipment_reLimit = this.getPageData().activePage;
            	 	guide_equipment_refreshClick = true;
 	        	this.store.reload();
         	} 
             })
        });
        if(userType!='1'){
//        	this.getColumnModel().setHidden(3,true);
        	Ext.getCmp('guide_eq_belong_institute').hide();
        	Ext.getCmp('guide_eq_main_check_travelAgency_id').hide();
        }
        Ext.getCmp('guide_enquip_table').addListener('cellclick',function(grid, rowIndex, columnIndex, e){
          	 autoCheckGridHead(grid);
          });
       //this.getStore().load();
    },
    listeners : {     //將第二個bar渲染到tbar裏面，通过listeners事件
			'render' : function() {
    		var userType = LoginuserType;
    		if(userType==1){//超级管理员
    			new Ext.Toolbar({
    				renderTo : Ext.grid.GridPanel.tbar,// 其中grid是上边创建的grid容器
    				items : [
    				         {
		    					text : '入库',
		    					style:'font-size:15px', 
		    					icon:"images/icon/add.png",
		    					handler : function()
		    					{	
			    					var win = new Ext.manager.win.guide_equipment_in_storage_win();
			//    					var win = new Ext.manager.win.guide_equipment_win();
			    					win.show(this);
			    					//获取入库单号（这是自动生成的）
			    					$.ajax({
			    						type : 'post',
			    						url:basePath+"//findEquipmentDynamicNo.do",
			    						data:{operateType:0,terminalType:1},
			    						success:function(data){
			    							var result = Ext.decode(data);
			    							if(result.success=="true"){
			    								var ordno =result.no;//流水单号  是后台自动生成的
			    								Ext.getCmp("guideEquipmentInstoreNoId").setValue(ordno);
			    							}
			    						}
			    					});
		    					}
		    				}, 
		    				{
		    					xtype : "tbseparator"
		    				},
		    				{
		    					text : '出库',
		    					style:'font-size:15px', 
		    					icon:"images/icon/allocation.png",
		    					handler : function()
		    					{	
			    					var win = new Ext.manager.win.guide_equipment_allocation_win();
			//    					var win = new Ext.manager.win.guide_equipment_win();
			    					win.show(this);
			    					$.ajax({
			    						type : 'post',
			    						url:basePath+"//findEquipmentDynamicNo.do",
			    						data:{operateType:1,terminalType:1},
			    						success:function(data){
			    							var result = Ext.decode(data);
			    							if(result.success=="true"){
			    								var ordno =result.no;//流水单号  是后台自动生成的
			    								Ext.getCmp("guideEquipmentOutstoreNoId").setValue(ordno);
			    							}
			    						}
			    					});
		    					}
		    				}, {
		    					xtype : "tbseparator"
		    				},  {
		    					text : "编辑",
		    					style:'font-size:15px', 
		    					icon:"images/icon/page_edit.png",
		    					handler : function()
		    					{
		    					var obj_data =  Ext.getCmp('guide_enquip_table').getSelectionModel();
		    					var sl = obj_data.selections.length;
		    					if(sl=='0'){
		    						Ext.Msg.show({
		    							title: '提示',
		    							msg: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp请先选中一条信息！',
		    							width: 300,
		    							buttons: Ext.Msg.OK,
		    							icon: Ext.Msg.INFO
		    						});
		    					}else if(sl=='1'){
		    							 var newFormData = obj_data.getSelected().data;
		    							 var _status = newFormData.status;
										 var win = new Ext.manager.win.guide_equipment_win(newFormData.status);
										 win.show(this);
										 if(newFormData.productTime&&newFormData.productTime.time){
												var prodectTime = newFormData.productTime.time;
												var newTime = new Date(prodectTime); //就得到普通的时间了 
												newFormData.productTime = newTime.format('Y-m-d');
											}
										 if(newFormData.travelAgencyId==""){
											 newFormData.travelAgency = "易通星云";
										 }
										 Ext.getCmp('guide_equipment_form_ids').getForm().setValues(newFormData);
										 Ext.getCmp('guide_eq_win_productTime_ids').setValue(newTime.dateFormat('Y-m-d'));
										 var _phone = newFormData.phone;
										 if(newFormData.status ==3){
											 Ext.getCmp('guide_eq_win_work_status_combo').setReadOnly(true);
										 }
										 if(_phone!=""){
											 Ext.getCmp('guideep_mobile_text_id').setReadOnly(true);
										 }
										 Ext.getCmp('guide_equipment_idss').setReadOnly(true) ;
		    						 
		    					}else if(sl>1){
		    						Ext.Msg.show({
		    							title: '提示',
		    							msg: '&nbsp&nbsp每次只能编辑一条信息，请重新选择！',
		    							width: 300,
		    							buttons: Ext.Msg.OK,
		    							icon: Ext.Msg.INFO
		    						});
		    					}
		    					}
		    				}, {
		    					xtype : "tbseparator"
		    				}, {
		    					text : "删除",
		    					style:'font-size:15px', 
		    					icon:"images/icon/cross.png",
		    					handler : function()
		    					{
		    					var sm=Ext.getCmp('guide_enquip_table').getSelectionModel(); // 获得grid的SelectionModel
		    					var sl = sm.selections.length;
		    					if(sl=='0'){
		    						Ext.Msg.show({
		    							title: '提示',
		    							msg: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp请先选中一条信息！',
		    							width: 300,
		    							buttons: Ext.Msg.OK,
		    							icon: Ext.Msg.INFO
		    						});
		    					}else{
		    						if(sm.getSelected()){
		    							var recs=sm.getSelections(); // 把所有选中项放入数组      
		    							Ext.Msg.show({
		    								title: '提示',
		    								msg: '&nbsp您确定要删除当前选择的数据吗?',
		    								width: 300,
		    								buttons: Ext.Msg.YESNO,
		    								icon: Ext.Msg.QUESTION,
		    								fn:function(btn){
			    								if(btn=='yes'){
			    									//下面是和后台数据库交互操作
			    									var _taId = [];
			    									for(var j=0;j<recs.length;j++){
			    										var id=recs[j].get("id");  
			    										var _travelAgencyId=recs[j].get("travelAgencyId");  
			    										if(_travelAgencyId!=""){
			    											_taId.push(id);
			    										}
			    									}
			    									var nullFlag = false;
			    									if(_taId.length>0){
			    										nullFlag = true;
			    									}
			    									if(nullFlag==true){
			    										for(var i=0;i<recs.length;i++){
				    										var id=recs[i].get("id");  
				    										var _travelAgencyId=recs[i].get("travelAgencyId");  
				    										if(_travelAgencyId!=""){
				    											Ext.Msg.show({
			    													title: '提示',
			    													msg:'设备编号：'+'</br>'+_taId.toString().replace(/,/g,'\n')+'</br>'+'已调拨到旅行社，无法删除！',
			    													width: 300,
			    													buttons: Ext.Msg.OK,
			    													icon: Ext.Msg.INFO
			    												});
				    										}else{
				    											$.post(basePath + "//deleteGuideEquipment.do",{"id":id},
				    													function(data){
				    												if(data==0||data=='0'){
				    													Ext.getCmp('guide_enquip_table').getStore().reload();
				    												}else{
				    													Ext.Msg.show({
				    														title: '提示',
				    														msg:'<div style="margin-left:50px;">没有删除权限！</div>',
				    														width: 300,
				    														buttons: Ext.Msg.OK,
				    														icon: Ext.Msg.INFO
				    													});
				    													Ext.getCmp('guide_enquip_table').getStore().reload();
				    												}
				    											},
				    											"json");
				    										}
				    									}
			    									}else{
			    										for(var i=0;i<recs.length;i++){
			    											var id=recs[i].get("id");  
			    												$.post(basePath + "//deleteGuideEquipment.do",{"id":id},
			    														function(data){
			    													if(data==0||data=='0'){
			    														Ext.Msg.show({
			    															title: '提示',
			    															msg:'<div style="margin-left:50px;">删除成功！</div>',
			    															width: 300,
			    															buttons: Ext.Msg.OK,
			    															icon: Ext.Msg.INFO
			    														});
			    														Ext.getCmp('guide_enquip_table').getStore().reload();
			    													}else{
			    														Ext.Msg.show({
			    															title: '提示',
			    															msg:'<div style="margin-left:50px;">没有删除权限！</div>',
			    															width: 300,
			    															buttons: Ext.Msg.OK,
			    															icon: Ext.Msg.INFO
			    														});
			    														Ext.getCmp('guide_enquip_table').getStore().reload();
			    													}
			    												},
			    												"json");
			    										}
			    									}
			    								}
		    								}
		    							});
		    						}
		    					}
		    					}
		    				},
		    				{
		    					xtype : "tbseparator"
							},
							{
		        				text:"设备导入模板",
		        				icon:"images/icon/instorage.png",
		        				handler:function(){
			        				window.location.href = basePath+'//guideEqNewImportTemplateDownload.do ' 
			        			}
			        		 }
//							{
//								text:'导入模板下载',
//								icon:"images/export_xy.png",
//								  menu:
//								      [
//								         new Ext.menu.CheckItem(
//								        		{
//							        				text:"入库导入模板",
//							        				icon:"images/icon/instorage.png",
//							        				handler:function(){
//								        				window.location.href = basePath+'//guideEqNewImportTemplateDownload.do ' 
//								        			}
//								        		 }
//								        		 
//								         ),
//								         new Ext.menu.CheckItem(
//								        		 {
//								        				text:"调拨导入模板",
//								        				icon:"images/icon/allocation.png",
//								        				handler:function(){
//									        				window.location.href = basePath+'//guideEqDbImportTemplateDownload.do' 
//									        			}
//									        		 }
//								         )
//								      ]
//							}
							,{
		    					xtype : "tbseparator"
		    				},
		    				{
		    					text:'设备归还',
		    					icon:"images/icon/return.png",
		    					handler:function(){
			    					var win = new Ext.manager.win.equipmentReturn_win("1");
			    					win.show();
			    					Ext.getCmp("equipmentReturn_terminalType_id").setValue(1);
			    					win.setTitle("导游设备归还信息");
			    					$.ajax({
			    						type : 'post',
			    						url:basePath+"//findEquipmentDynamicNo.do",
			    						data:{operateType:4,terminalType:1},
			    						success:function(data){
			    							var result = Ext.decode(data);
			    							if(result.success=="true"){
			    								var ordno =result.no;//流水单号  是后台自动生成的
			    								Ext.getCmp("equipmentReturnNoId").setValue(ordno);
			    							}
			    						}
			    					});
			    				}
		    				},
		    				{
		    					xtype : "tbseparator"
		    				},
		    				{
		    					text:'设备开通',
		    					icon:"images/icon/openEquipment.png",
		    					handler:function(){
		    						var win = new Ext.manager.win.equipmentOpen_win('1');
		    						win.show();
		    						Ext.getCmp("equipmentOpen_terminalType_id").setValue(1);
		    						win.setTitle("导游设备开通信息");
		    						$.ajax({
			    						type : 'post',
			    						url:basePath+"//findEquipmentDynamicNo.do",
			    						data:{operateType:2,terminalType:1},
			    						success:function(data){
			    							var result = Ext.decode(data);
			    							if(result.success=="true"){
			    								var ordno =result.no;//流水单号  是后台自动生成的
			    								Ext.getCmp("equipmentOpenNoId").setValue(ordno);
			    							}
			    						}
			    					});
		    					}
		    				},
		    				{
		    					xtype : "tbseparator"
		    				},
		    				{
		    					text:'设备续期',
		    					icon:"images/icon/renewal.png",
		    					handler:function(){
		    					var win = new Ext.manager.win.equipmentFree_win('1');
		    					win.show();
		    					Ext.getCmp("equipmentFree_terminalType_id").setValue(1);
		    					Ext.getCmp("equipmentFree_isGuideEquipment_id").setValue(0);
		    					win.setTitle("导游设备续期信息");
		    					$.ajax({
		    						type : 'post',
		    						url:basePath+"//findEquipmentDynamicNo.do",
		    						data:{operateType:3,terminalType:1},
		    						success:function(data){
		    							var result = Ext.decode(data);
		    							if(result.success=="true"){
		    								var ordno =result.no;//流水单号  是后台自动生成的
		    								Ext.getCmp("equipmentFreeNoId").setValue(ordno);
		    							}
		    						}
		    					});
		    				}
		    				}
//							{
//								xtype : "tbseparator"
//							},
//							{
//								text:'导入入库信息',
//								icon:"images/import_xy.png",
//								handler:function(){
//									var win = new Ext.manager.win.guide_equipment_upload_win('instorage');
//									win.title="上传入库信息Excel文件";
//									win.show();
//								}
//							},
//							{
//								xtype : "tbseparator"
//							},
//							{
//								text:'导入调拨信息',
//								icon:"images/import_xy.png",
//								handler:function(){
//									var win = new Ext.manager.win.guide_equipment_upload_win('allocation');
//									win.title="上传调拨信息Excel文件";
//									win.show();
//								}
//							}
		    				]
    				
    			}).render(this.tbar);
    		}else{
    			new Ext.Toolbar({
    				renderTo : Ext.grid.GridPanel.tbar,// 其中grid是上边创建的grid容器
    				items : [
    				         {
		    					text : "编辑",
		    					style:'font-size:15px', 
		    					icon:"images/icon/page_edit.png",
		    					handler : function()
		    					{
		    					var obj_data =  Ext.getCmp('guide_enquip_table').getSelectionModel();
		    					var sl = obj_data.selections.length;
		    					if(sl=='0'){
		    						Ext.Msg.show({
		    							title: '提示',
		    							msg: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp请先选中一条信息！',
		    							width: 300,
		    							buttons: Ext.Msg.OK,
		    							icon: Ext.Msg.INFO
		    						});
		    					}else if(sl=='1'){
		    						 var newFormData = obj_data.getSelected().data;
		    							 var prodectTime = newFormData.productTime.time;
		    							 var newTime = new Date(prodectTime); //就得到普通的时间了 
		    							 var win = new Ext.manager.win.guide_equipment_win(newFormData.status);
		    							 win.show(this);
		    							 var prodectTime = newFormData.productTime.time;
		    							 var newTime = new Date(prodectTime); //就得到普通的时间了 
		    							 if(newFormData.travelAgencyId==""){
											 newFormData.travelAgency = "易通星云";
										 }
		    							 Ext.getCmp('guide_equipment_form_ids').getForm().setValues(newFormData);
		    							 Ext.getCmp('guide_eq_win_productTime_ids').setValue(newTime.dateFormat('Y-m-d'));
		    							 if(newFormData.status ==3){
											 Ext.getCmp('guide_eq_win_work_status_combo').setReadOnly(true);
										 }
		    							 Ext.getCmp('guide_equipment_idss').setReadOnly(true) ;
		    						 
		    					}else if(sl>1){
		    						Ext.Msg.show({
		    							title: '提示',
		    							msg: '&nbsp&nbsp每次只能编辑一条信息，请重新选择！',
		    							width: 300,
		    							buttons: Ext.Msg.OK,
		    							icon: Ext.Msg.INFO
		    						});
		    					}
		    					}
		    				}]
    				
    			}).render(this.tbar);
    		}
                                                            
							}
						},
    searchfn:function(){
		Ext.getCmp('guide_enquip_table').getSelectionModel().clearSelections(true);
    	//查询
		//设备编号 id 所属旅行社travelAgencyId
		guide_equipment_main_check_id = Ext.getCmp('enquip_serial').getValue();
		guide_equipment_main_check_travelAgencyId = Ext.getCmp('guide_eq_belong_institute').getValue();
		guide_equipment_main_check_status = Ext.getCmp('guide_equipment_main_check_status').getValue();
    	var _store = Ext.getCmp('guide_enquip_table').getStore();
    	guide_equipment_checkClick = true;
    	_store.reload();
    },
    advancefn:function(){
        Ext.getCmp('log_grid').getStore().removeAll(false);
        
    },
    addwin:function()
    {
         var win = new Ext.manager.win.guide_equipment_win();
         win.items.items[0].getForm().load({url: window.location.protocol + "//" + window.location.host + "/" + 'extjscar/dao/carinfo.jsp?id=' + value,
        	 								waitTitle:'请稍后',
        	 								watiMsg:'数据正在处理，请稍后！',
        	 								success:function(action,form){
        	 								}});
                            win.show(this);
    },
    getlineNum:function (){
        
   var grid =Ext.getCmp('guide_enquip_table');
   var sm=Ext.getCmp('guide_enquip_table').getSelectionModel(); // 获得grid的SelectionModel
   if(sm.getSelected()){
        var recs=sm.getSelections(); // 把所有选中项放入数组
        var linenum;                  // 行号
        for(var i=0;i<recs.length;i++){
            linenum=grid.getStore().indexOfId(recs[i].get("id"));   //当前每行的ID获得当前行号
            return linenum;
        }
   }else{
     return -1;
    }
}
});
