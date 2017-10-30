<template>
  <div class="app-container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-body">
                     {{title}}
                </div>
            </div>    
        </div>
    </div>
     <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-body">
                     <el-form class="small-space" :model="formParam" :rules="rules" ref="formParam" label-position="left" label-width="120px">
                        <el-form-item label="资源名称" prop="resourceName">
                            <el-input v-model="formParam.resourceName" ></el-input>
                        </el-form-item>
                        <el-form-item label="资源类型" prop="resourceType">
                            <el-select v-model="formParam.resourceType" placeholder="请选择类型" style="width:100%">
                                <el-option label="政府" value="1"></el-option>
                                <el-option label="媒体" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资源详情" prop="content">
                            <el-input type="textarea" v-model="formParam.content" ></el-input>
                        </el-form-item>
                        <el-form-item label="维护注意事项" prop="matters">
                            <el-input type="textarea" v-model="formParam.matters" ></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-row>
                                <span style="color:red;font-weight: bold;">联系人列表</span>
                            </el-row>
                            <el-row>
                                <el-form v-for="(item , index ) in contactsParam" :key="index" class="small-space"  label-position="left" label-width="80px" style="margin: 10px 0;">
                                    <el-row :gutter="20">
                                        <el-col :span="5" >
                                            <el-form-item label="联系人*">
                                                <el-input v-model="item.linkMan"></el-input>
                                                <span style="color:red">{{item.err && item.err.linkManMsg || ""}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="联系方式*">
                                                <el-input v-model="item.contactsWay" ></el-input>
                                                <span style="color:red">{{item.err &&  item.err.contactsWayMsg || ""}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="地址*">
                                                <el-input v-model="item.address" ></el-input>
                                                <span style="color:red">{{item.err &&  item.err.addressMsg || ""}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-form-item label="备注*">
                                                <el-input v-model="item.remark" ></el-input>
                                                <span style="color:red">{{item.err &&  item.err.remarkMsg || ""}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                             <a class="btn btn-info btn-sm" @click="updateRow(1)">
                                                <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                                新增一行
                                             </a>
                                             <a class="btn btn-danger btn-sm" @click="updateRow(2,item)" v-if="contactsParam.length > 1">
                                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                                删除
                                             </a>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="update('formParam')" :loading="dialogFormVisible" v-if="isEdit">保存</el-button>
                            <el-button type="primary" @click="create('formParam')" :loading="dialogFormVisible" v-else>添加</el-button>
                            <el-button @click="back" :loading="dialogFormVisible" >返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>    
        </div>
    </div>
  </div>
</template>

<script>
    import {myResApi} from 'api/resourceManager';
     import { Loading } from 'element-ui';

    export default {
      name: 'resourceManagerMyResEdit',
      data() {
        return {
            formParam: {
                uuid: undefined,
                resourceName:'', //资源名称
                resourceType:'',//资源类型
                content:'',//资源详情
                matters:'', //维护注意事项
                contactsList:[] //联系人列表
            },
            rules: {
                resourceName:[
                    {required: true, message: '请输入资源名称', trigger: 'blur'}
                ],
                resourceType:[
                    {required: true, message: '选择资源类型', trigger: 'change'}
                ],
                content:[
                    {required: true, message: '请输入资源详情', trigger: 'blur'}
                ],
                matters:[
                    {required: true, message: '请输入维护注意事项', trigger: 'blur'}
                ]
            },
            contactsParam:[],
            dialogFormVisible:false,
            bufContacts:[] //将后台返回过来的联系人列表缓存起来，提交时做对比
        }
      },
      computed: {
        isEdit() {
          return this.$route.meta.isEdit // 根据meta判断
        },
        title(){
            return this.$route.meta.title
        }
      },
      created() {
        this.addRow();
        if(this.isEdit) {
            this.fetchData();
        }
      },
      methods: {
        //获取详情
        fetchData(){
          let id = this.$route.params.id;
          if(!id) return;
          myResApi.itemInfo(id).then(response=>{
            let res = response.data;
            if(res.code == 1){
                let data = res.data || {};
                this.formParam = {
                    resourceId: data['resourceId'],
                    resourceName:data['resourceName'], //资源名称
                    resourceType:data['resourceType']+'',//资源类型
                    content:data['content'],//资源详情
                    matters:data['matters'], //维护注意事项
                    contactsList:[] //联系人列表
                };
                let contacts = data['contacts'] || [],l = contacts.length;
                if(l > 0){
                    this.contactsParam = [];
                }
                for(let i = 0;i<l; i++){
                   let temp = contacts[i];
                   let contact = {
                        id:temp['id'],
                        uuid:temp['uuid'],
                        contactId:temp['uuid'],
                        linkMan: temp['linkMan'], //联系人
                        contactsWay: temp['contactsWay'], //联系方式
                        address: temp['address'], //地址
                        remark:temp['remark'],//备注
                   };
                   this.bufContacts.push(Object.assign({},contact));
                   let _contact = Object.assign({},contact);
                   _contact['err'] = {linkManMsg:'',contactsWayMsg:'',addressMsg:'',remarkMsg:''};
                   this.contactsParam.push(_contact);
                };
            }
          });
        },
        create(formName){
            let _this = this;
            this.$refs[formName].validate(function(valid){
                if (valid) {
                    if(_this.checkParam()){
                        return;
                    }
                    _this.pushParam();
                    let temp = Object.assign({},_this.formParam);
                    temp['contactsList'] = JSON.stringify(temp['contactsList']);
                    _this.dialogFormVisible = true;
                    myResApi.add(temp).then(response=>{
                        let res = response.data;
                        _this.dialogFormVisible = false;
                        if(res.code == 1){
                            _this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                            });
                            _this.back();   
                        }
                    })
                }
            })          
        },
        update(formName) {
          let _this = this;
          this.$refs[formName].validate(function(valid){
              if (valid) {
                    if(_this.checkParam()){
                        return;
                    }
                    _this.pushParam();
                    let temp = Object.assign({},_this.formParam);
                    temp['contactsList'] = JSON.stringify(temp['contactsList']);
                    _this.dialogFormVisible = true;
                     
                    myResApi.update(temp).then(response=>{
                        let res = response.data;
                         _this.dialogFormVisible = false;
                        if(res.code == 1){
                            _this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                            });
                        _this.back();   
                        }
                    })
              }
          })  
        },
        checkParam(){
            let args = this.contactsParam;
            let flg = false;
            for(let i = 0,l = args.length;i<l;i++){
                let item = args[i];
                item.err.linkManMsg = '';
                item.err.contactsWayMsg = '';
                item.err.addressMsg = '';
                item.err.remarkMsg =  '';
                if (item.linkMan == '') {
                    item.err.linkManMsg = '请输入联系人！';
                    flg = true;
                }
                if (item.contactsWay == '') {
                    item.err.contactsWayMsg = '请输入联系方式！';
                    flg = true;
                }
                if (item.address == '') {
                    item.err.addressMsg =   '请输入地址！';
                    flg = true;
                }
                if (item.remark == '') {
                    item.err.remarkMsg =   '请输入备注！';
                    flg = true;
                }
            }
            return flg;
        },
        pushParam(){
            this.formParam.contactsList = [];
            let stringContacts = JSON.stringify(this.contactsParam);
            let args = JSON.parse(stringContacts);
            if(!this.isEdit) {
                for(let i = 0,l = args.length;i<l;i++){
                    let item = args[i];
                    this.formParam.contactsList.push({
                        linkMan: item['linkMan'], //联系人
                        contactsWay: item['contactsWay'], //联系方式
                        address: item['address'], //地址
                        remark:item['remark']//备注
                    });
                }
                return;
            }
            let arrArgs = [],arrBuf = [];
            for(let i = 0,l = args.length;i<l;i++){
                delete args[i]['err'];
                arrArgs.push(JSON.stringify(args[i]));
            }
            for(let i = 0,l = this.bufContacts.length;i<l;i++){
                    arrBuf.push(JSON.stringify(this.bufContacts[i]));
            }
            /*console.log('arrArgs:',arrArgs);
            console.log('arrBuf:',arrBuf);
            
            console.log('bufContacts:'+JSON.stringify(this.bufContacts));
            console.log('contactsParam:'+JSON.stringify(args));
            */
            //比较差异
            for(let i = 0, l = arrBuf.length;i<l;i++){
                let index = $.inArray(arrBuf[i],arrArgs);
                if(index != -1){
                    arrArgs.splice(index,1);
                }
            }
            let finalArr = [];
            for(let i = 0, l = arrArgs.length;i<l;i++){
                finalArr.push(JSON.parse(arrArgs[i]));
            }
            this.formParam.contactsList = finalArr.concat();
            console.log('finalArr:'+JSON.stringify(finalArr));
        },
        addRow: function(){
            this.contactsParam.push({
                linkMan: '', //联系人
                contactsWay: '', //联系方式
                address: '', //地址
                remark:'',//备注
                err:{
                    linkManMsg:'',contactsWayMsg:'',addressMsg:'',remarkMsg:''
                }
            });
        },
        updateRow(editType,item){
            if(editType == 1){
                this.addRow();
                return;    
            }
            if(editType == 2){
                if(this.contactsParam.length <= 1) return;
                if(this.isEdit && item.id){
                    let uuid = item.uuid;
                    let loadingInstance = Loading.service();
                    let _this = this;
                    myResApi.removeContacts({contactsId:uuid}).then(() => {
                       loadingInstance.close();
                       let bufContacts =  _this.bufContacts;
                       for(let i = 0,l=bufContacts.length;i<l;i++){
                            if(bufContacts[i]['uuid'] == uuid){
                                bufContacts.splice(i,1);

                                let index = _this.contactsParam.indexOf(item);
                                _this.contactsParam.splice(index,1);
                                _this.$message({
                                    message: '删除成功！',
                                    type: 'success'
                                });
                                return;
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                        loadingInstance.close();
                    });
                    return;
                }
                let index = this.contactsParam.indexOf(this.item);
                this.contactsParam.splice(index,1);
            }
        },
        back:function(){
            this.$router.go(-1);
        }
      }
    };
</script>