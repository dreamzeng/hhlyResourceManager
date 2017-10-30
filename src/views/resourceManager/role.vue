<template>
   <div class="app-container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-4">角色列表</div>
                        <div class="col-md-4 col-md-offset-4" style="text-align: right">
                            <router-link :to="{name: 'resourceManager_role_add'}" class="btn btn-info  btn-sm">
                                <span aria-hidden="true" class="glyphicon glyphicon-plus"></span>新增角色
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="dataTables_wrapper form-inline" id="list-content">
                    <!-- 搜索 -->
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="panel-body">
                                
                            </div>
                        </div>
                    </div>
                    <!-- 搜索结束 -->
                    <div class="table-scrollable">
                        <div class="panel-body">
                            <!--表格-->
                            <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
                                <el-table-column  align="center" label="角色名称">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.roleName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="角色编码">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.roleCode}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="描述">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.description}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
                                        </el-button>
                                        <el-button size="small" type="info" @click="dispenseRole(scope.row)">分配权限
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<style scoped>
    .activeTag{
        color: #FFF;background: #2185D0
    }
</style>
<script>
    import {roleApi} from 'api/resourceManager'
    
    export default {
      name: 'resourceManagerIndex',
      data() {
        return {
            list: null,
            listLoading: true
        }
      },
      computed: {
        super(){
            return this.$store.getters.super;
        }
      },
      mounted(){
        this.getList();
       
      },
      methods: {
          test(){
              let profile = this.$refs.profile;
              profile.getFileList();
          },
        //获取数据列表
        getList() {
          this.listLoading = true;
          roleApi.fetchList(this.listQuery).then(response => {
            let res = response.data;
            this.list = null;
            this.total = 0;
            if(res.code == 1){
              this.list = res.data && res.data;
            }
            this.listLoading = false;
          })
        },
        //更新
        handleUpdate(row) {
          this.$router.push({name: 'resourceManager_role_edit', params: { id: row.uuid}});
        },
        dispenseRole(row){
             this.$router.push({name: 'resourceManager_role_dispense', params: { id: row.uuid}});
        },
         // 删除
        handleDelete(row) {
            let _this = this;
            this.$confirm('确认删除 角色：'+row.roleName+'？', '确定删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              roleApi.update({uuid:row.uuid,userState:0}).then(response=>{
                 _this.getList();
                let res = response.data;
                if(res.code == 1){
                    _this.$notify({
                    title: '成功',
                    message: res.msg,
                    type: 'success',
                    duration: 2000
                    });
                }
              });
            }).catch(() => {

            });
        }
      }
    }
</script>

