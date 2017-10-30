<template>
   <div class="app-container">
    <pcenter-list></pcenter-list>

    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-md-4">我的待办</div>
                        <div class="col-md-4 col-md-offset-4" style="text-align: right"></div>
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
                                <el-table-column align="center" label="创建日期">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.resourceApplyTime}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="名称">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.resourceName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="申请人">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.resourceApplyerName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" label="状态">
                                    <template slot-scope="scope">
                                    <span>{{scope.row.auditStatus}}</span>
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
    import {remainApi} from 'api/resourceManager'
    import PcenterList from './pcenter_list';

    export default {
      name: 'resourceManagerIndex',
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
        //获取数据列表
        getList() {
          this.listLoading = true;
          remainApi.fetchList(this.listQuery).then(response => {
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
        }
      }
    }
</script>

