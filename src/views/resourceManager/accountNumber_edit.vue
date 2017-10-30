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
                        <el-form-item label="账号" prop="loginName">
                            <el-input v-model="formParam.loginName" ></el-input>
                        </el-form-item>
                        <el-form-item label="公司" prop="company">
                            <el-input v-model="formParam.company" ></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="department">
                            <el-input v-model="formParam.department" ></el-input>
                        </el-form-item>
                        <el-form-item label="职称" prop="position">
                            <el-input v-model="formParam.position" ></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="realName">
                            <el-input v-model="formParam.realName" ></el-input>
                        </el-form-item>
                        <el-form-item label="角色类型" prop="roleUuids">
                            <el-select v-model="formParam.roleUuids" multiple placeholder="请选择" style="width:100%">
                                <el-option
                                v-for="item in roleOptions"
                                :key="item.uuid"
                                :label="item.roleName"
                                :value="item.uuid">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="update('formParam')" :loading="dialogFormVisible" v-if="isEdit">编辑</el-button>
                            <el-button type="primary" @click="create('formParam')" :loading="dialogFormVisible" v-else>添加</el-button>
                            <el-button @click="back" :loading="dialogFormVisible" >取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>    
        </div>
    </div>

    
  </div>
</template>

<script>
    import {roleApi,accountNumberApi} from 'api/resourceManager'

    export default {
      name: 'resourceManagerAccountNumberEdit',
      data() {
        return {
            formParam: {
                uuid: undefined,
                loginName:'', //账号
                company:'',//公司
                department:'',//部门
                position:'',//职称
                realName:'',//姓名
                roleUuids:[] //角色类型
            },
            rules: {
                loginName:[
                    {required: true, message: '请输入账号', trigger: 'blur'}
                ],
                company:[
                    {required: true, message: '请输入公司名称', trigger: 'blur'}
                ],
                department:[
                    {required: true, message: '请输入部门名称', trigger: 'blur'}
                ],
                position:[
                    {required: true, message: '请输入职称', trigger: 'blur'}
                ],
                realName:[
                    {required: true, message: '请输入姓名', trigger: 'blur'}
                ],
                roleUuids:[
                    {type: 'array',required: true, message: '请输选择角色', trigger: 'change'}
                ],
            },
            roleOptions:[],
            dialogFormVisible:false
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
        this.getRole();
        if(this.isEdit) {
            this.fetchData();
        }
      },
      methods: {
        getRole(){
            roleApi.fetchList(this.listQuery).then(response => {
                let res = response.data;
                if(res.code == 1){
                    this.roleOptions = res.data;
                }
            })
        },
        //获取详情
        fetchData(){
          let id = this.$route.params.id;
          if(!id) return;
          accountNumberApi.itemInfo(id).then(response=>{
            let res = response.data;
            if(res.code == 1){
                //res.data
                this.formParam = {
                    uuid: res.data.uuid,
                    loginName:res.data.loginName, //账号
                    company:res.data.company,//公司
                    department:res.data.department,//部门
                    position:res.data.position,//职称
                    realName:res.data.realName,//姓名
                    roleUuids:[] //角色类型
                }
                if(res.data.roles){
                    let _roles = res.data.roles;
                    for(let i = 0,l = _roles.length;i<l;i++){
                        this.formParam.roleUuids.push(_roles[i]['uuid']);
                    }
                }
            }
          });
        },
        create(formName){
            let _this = this;
            this.$refs[formName].validate(function(valid){
                if (valid) {
                    let temp = Object.assign({}, _this.formParam);
                    temp['roleUuids'] = temp['roleUuids'].join(",");
                    _this.dialogFormVisible = true;
                    accountNumberApi.add(temp).then(response=>{
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
                    let temp = Object.assign({}, _this.formParam);
                    temp['roleUuids'] = temp['roleUuids'].join(",");
                    _this.dialogFormVisible = true;
                    accountNumberApi.update(temp).then(response=>{
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
        back:function(){
            this.$router.go(-1);
        }
      }
    };
</script>
