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
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="formParam.roleName" ></el-input>
                        </el-form-item>
                        <el-form-item label="角色编码" prop="roleCode">
                            <el-input v-model="formParam.roleCode" ></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" prop="description">
                            <el-input type="textarea" v-model="formParam.description" ></el-input>
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
    import {roleApi} from 'api/resourceManager'

    export default {
      name: 'resourceManagerRoleEdit',
      data() {
        return {
            formParam: {
                uuid: undefined,
                roleName:'', //角色名称
                roleCode:'',//角色编码
                description:''//角色描述
            },
            rules: {
                roleName:[
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
                ],
                roleCode:[
                    {required: true, message: '请输入角色编码', trigger: 'blur'}
                ],
                description:[
                    {required: true, message: '请输入角色描述', trigger: 'blur'}
                ]
            },
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
        if(this.isEdit) {
            this.fetchData();
        }
      },
      methods: {
        //获取详情
        fetchData(){
          let id = this.$route.params.id;
          if(!id) return;
          roleApi.itemInfo(id).then(response=>{
            let res = response.data;
            if(res.code == 1){
                //res.data
                this.formParam = {
                    uuid: res.data.uuid,
                    roleName:res.data.roleName, //角色名称
                    roleCode:res.data.roleCode,//角色编码
                    description:res.data.description//描述
                    
                }
            }
          });
        },
        create(formName){
            let _this = this;
            this.$refs[formName].validate(function(valid){
                if (valid) {
                     _this.dialogFormVisible = true;
                    roleApi.add(_this.formParam).then(response=>{
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
                    _this.dialogFormVisible = true;
                    roleApi.update(_this.formParam).then(response=>{
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
