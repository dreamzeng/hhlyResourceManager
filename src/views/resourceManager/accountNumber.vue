<template>
   <div class="app-container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-4">用户列表</div>
                        <div class="col-md-4 col-md-offset-4" style="text-align: right">
                            <router-link :to="{name: 'resourceManager_accountNumberManager_add'}" class="btn btn-info  btn-sm">
                                <span aria-hidden="true" class="glyphicon glyphicon-plus"></span>新增用户
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
                                <el-table-column  align="center" label="角色类型">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.roleName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="账号">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.loginName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="公司">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.company}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="部门">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.department}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="职称">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.position}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="姓名">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.realName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
                                        </el-button>
                                        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <div v-show="!listLoading" class="pagination-container">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                                    :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
                                </el-pagination>
                            </div>

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
    import {accountNumberApi} from 'api/resourceManager'
    
    export default {
      name: 'resourceManagerIndex',
      data() {
        return {
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20
            }
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
          accountNumberApi.fetchList(this.listQuery).then(response => {
            let res = response.data;
            this.list = null;
            this.total = 0;
            if(res.code == 1){
              this.list = res.data && res.data.items;
              this.total = res.data && res.data.total;
            }
            this.listLoading = false;
          })
        },
        //分页信息
        handleSizeChange(val) {
          this.listQuery.limit = val;
          this.getList();
        },
        //分页信息
        handleCurrentChange(val) {
          this.listQuery.page = val;
          this.getList();
        },
        //更新
        handleUpdate(row) {
          this.$router.push({name: 'resourceManager_accountNumberManager_edit', params: { id: row.uuid}});
        },
         // 删除
        handleDelete(row) {
            let _this = this;
            this.$confirm('确认删除 账号：'+row.loginName+'？', '确定删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              accountNumberApi.del({uuid:row.uuid,userState:0}).then(response=>{
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

