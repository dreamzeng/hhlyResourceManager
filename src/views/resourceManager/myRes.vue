<template>
   <div class="app-container">
    <pcenter-list :utype="utype"></pcenter-list>

    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-4">我的资源</div>
                        <div class="col-md-4 col-md-offset-4" style="text-align: right">
                            <router-link :to="{name: 'resourceManager_myRes_add'}" class="btn btn-info  btn-sm">
                                <span aria-hidden="true" class="glyphicon glyphicon-plus"></span>新增资源
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
                                <el-table-column align="center" label="更新日期">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.updateTime}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="资源名称">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.resourceName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="创建人">
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

<script>
    import {myResApi} from 'api/resourceManager'
    import PcenterList from './pcenter_list';

    export default {
      name: 'resourceManagerMyRes',
      components: {
        PcenterList,
      },
      data() {
        return {
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20
            },
            utype:'2'
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
        //获取数据列表
        getList() {
          this.listLoading = true;
          myResApi.fetchList(this.listQuery).then(response => {
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
          this.$router.push({name: 'resourceManager_myRes_edit', params: { id: row.resourceId}});
        }
      }
    }
</script>

