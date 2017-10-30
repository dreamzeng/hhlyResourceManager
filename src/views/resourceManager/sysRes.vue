<template>
    <div class="app-container">
         <div class="row" id="show-res" v-loading.body="listLoading">
                <div class="col-lg-3" >
                    <div class="panel">
                        <div class="panel-body">
                            <div class="panel-heading">
                                <div class="row">
                                    <div class="col-md-4">资源结构树</div>
                                </div>
                            </div>
                            <div class="panel-body">
                                <div class="portlet-body">
                                    <div style="margin-bottom:15px;">
                                        <el-input
                                            placeholder="输入关键字进行过滤"
                                            v-model="filterText">
                                        </el-input>
                                    </div>
                                    <el-tree class="filter-tree"
                                        :data="resList"
                                        :props="defaultProps"
                                        default-expand-all
                                        :highlight-current="highlight"
                                        :filter-node-method="filterNode"
                                        @node-click="nodeClick"
                                        ref="treeRes">
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-9">
                    <div class="panel">
                        <div class="panel-body">
                            <div class="panel-heading">
                                <div class="row">
                                    <div class="col-md-4">资源详情</div>
                                    <div class="col-md-8" style="text-align: right">
                                        <a class="btn btn-info  btn-sm" :class="{ 'btn-danger' : activeType == '0' }" @click="active('add',0)">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            新增父资源
                                        </a>
                                        <a class="btn btn-info  btn-sm" :class="{ 'btn-danger' : activeType == '1' }"  @click="active('add',1)">
                                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                                            新增子资源
                                        </a>
                                        <a class="btn btn-info  btn-sm" :class="{ 'btn-danger' : activeType == '2' }" @click="active('update')">
                                            <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                            编辑此资源
                                        </a>
                                        <a class="btn btn-info  btn-sm" :class="{ 'btn-danger' : activeType == '3' }" @click="deleteItem()">
                                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                            删除此资源
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top:15px;">
                                <el-form class="small-space" :model="formParam" :rules="rules" ref="formParam" label-width="120px">
                                    <el-form-item label="名称" prop="resourceName">
                                        <el-input v-model="formParam.resourceName" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="图标" prop="icon" >
                                        <el-col :span="20">
                                             <el-input v-model="formParam.icon" :disabled="isDisabled"></el-input>
                                        </el-col>
                                        <el-col :span="2">&nbsp;</el-col>
                                        <el-col :span="2">
                                            <el-button type="success" @click="dialogIconVisible = true" :disabled="isDisabled">选择图标</el-button>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="类型" prop="resourceType">
                                       <el-select v-model="formParam.resourceType" placeholder="请选择类型" :disabled="isDisabled" style="width:100%">
                                            <el-option label="MENU" value="MENU"></el-option>
                                            <el-option label="API" value="API"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="路由" prop="url">
                                        <el-input v-model="formParam.url" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="排序" prop="sortNo">
                                        <el-input v-model="formParam.sortNo" :disabled="isDisabled"></el-input>
                                    </el-form-item>
                                    <el-form-item label="操作" prop="method">
                                        <el-select v-model="formParam.method" multiple placeholder="请选择" style="width:100%" :disabled="isDisabled">
                                            <el-option label="GET" value="GET"></el-option>
                                            <el-option label="POST" value="POST"></el-option>
                                            <el-option label="PUT" value="PUT"></el-option>
                                            <el-option label="DELETE" value="DELETE"></el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="是否隐藏" prop="hiddenFlag">
                                        <el-select v-model="formParam.hiddenFlag" placeholder="请选择类型" style="width:100%" :disabled="isDisabled">
                                            <el-option label="隐藏" value="1"></el-option>
                                            <el-option label="不隐藏" value="0"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="是否下拉" prop="dropDownFlag">
                                        <el-select v-model="formParam.dropDownFlag" placeholder="请选择类型" style="width:100%" :disabled="isDisabled">
                                            <el-option label="下拉" value="0"></el-option>
                                            <el-option label="不可下拉" value="1"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    
                                    <el-form-item>
                                        <el-button type="primary" @click="save('formParam')" :loading="dialogFormVisible" :disabled="isDisabled">保存</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <el-dialog title="选择图标" :visible.sync="dialogIconVisible">
                <wscnIconList ref="wscnIconList"></wscnIconList>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogIconVisible = false">取 消</el-button>
                    <el-button type="primary" @click="selectIcon">确 定</el-button>
                </div>
            </el-dialog>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
   
</style>

<script>
    import {sysResApi} from 'api/resourceManager';
    import wscnIconList from 'components/Icon-svg/wscn-icon-list';

    export default {
        name: 'resourceList',
        components: {
            wscnIconList
        },
        data: function () {
            return {
                formParam:{
                    parentUuid:null, //父菜单ID，-1表示当前是顶级菜单
                    uuid:null,
                    resourceName:'', //资源名称
                    icon:'', //菜单图标
                    resourceType:'MENU', //菜单类型
                    url:'', //菜单URL
                    sortNo:'', //菜单排序
                    method:[], //资源操作方法(GET,POST,PUT,DELETE),多个用逗号分隔
                    hiddenFlag	:'1', //是否隐藏:1：隐藏0：不隐藏
                    dropDownFlag	:'0' //是否下拉0：下拉1：不可下拉
                },
                rules:{
                    resourceName:[
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    resourceType:[
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ],
                    url:[
                        {required: true, message: '请输入路由', trigger: 'blur'}
                    ],
                    sortNo:[
                        {required: true, message: '请输入排序', trigger: 'blur'}
                    ],
                    method:[
                        {type: 'array',required: true, message: '请选择操作', trigger: 'blur'}
                    ],
                    hiddenFlag:[
                        {required: true, message: '是否隐藏', trigger: 'blur'}
                    ],
                    dropDownFlag:[
                        {required: true, message: '是否下拉', trigger: 'blur'}
                    ],
                },
                parentUuid:null,
                filterText: '',
                highlight:true,
                listLoading:true,
                dialogFormVisible:false,
                resList: [],
                defaultProps: {
                    children: 'children',
                    label: 'resourceName'
                },
                isDisabled:true,
                dotype:null,
                dialogIconVisible: false,
                nodeItem:null,
                activeType:'-1'
            }
        },
        watch: {
            filterText(val) {
                this.$refs.treeRes.filter(val);
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.getAllResources();
            });
        },
        methods: {
            getAllResources(){
                sysResApi.getAllResources().then(response => {
                    let res = response.data;
                    if(res.code == 1){
                        this.resList = res.data;
                    }
                    this.listLoading = false;
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.resourceName.indexOf(value) !== -1;
            },
            nodeClick(data,node,group){
                this.nodeItem = data;
                this.isDisabled = true;
                this.parentUuid = null;
                this.activeType = '-1';
                sysResApi.itemInfo(data.uuid).then(response => {
                    let res = response.data;
                    this.list = null;
                    this.total = 0;
                    if(res.code == 1 && res.data){
                       let _formParam = {
                            parentUuid:res.data['uuid'],
                            uuid:res.data['uuid'],
                            resourceName:res.data['resourceName'],
                            icon:res.data['icon'],
                            resourceType:res.data['resourceType'] && res.data['resourceType']['value'] || '',
                            url:res.data['url'],
                            sortNo:res.data['sortNo']+'',
                            method: res.data['method'] && res.data['method'].split(',') || [],
                            hiddenFlag	:res.data['hiddenFlag'] ? '1' :'0',
                            dropDownFlag	:res.data['dropDownFlag'] ? '1' :'0'
                       }
                       this.parentUuid = res.data['uuid'];
                       this.formParam = _formParam;
                    }
                    this.listLoading = false;
                })
            },
            resetParam(){
               this.formParam = {
                    parentUuid:null, //父菜单ID，-1表示当前是顶级菜单
                    uuid:null,
                    resourceName:'', //资源名称
                    icon:'', //菜单图标
                    resourceType:'MENU', //菜单类型
                    url:'', //菜单URL
                    sortNo:'', //菜单排序
                    method:[], //资源操作方法(GET,POST,PUT,DELETE),多个用逗号分隔
                    hiddenFlag:'1', //是否隐藏:1：隐藏0：不隐藏
                    dropDownFlag :'0' //是否下拉1：下拉0：不可下拉
                }
            },
            /**
             * @dotype : 行为类型 add 为新增， update 为 修改
             * @type： 节点类型 0 为添加父节点，1为添加子节点
             */
            active(dotype,type){
                if(typeof dotype == 'undefined' || dotype == '') return;
                this.dotype = dotype;
                if(dotype == 'add' && type == 1){
                    this.resetParam();
                }
                if(dotype == 'add' && type == 0){
                    this.parentUuid = null;
                    this.resetParam();
                }
                this.activeType = type+'';
                if(dotype == 'update'){
                    if(!this.formParam['uuid']){
                        this.$message({
                            message: '请选择要编辑的节点',
                            type: 'warning'
                        });
                        return;
                    }
                    this.activeType = '2';
                }
                this.isDisabled = false;
            },
            save(formName){
                let _this = this;
                this.$refs[formName].validate(function(valid){
                    if (valid) {
                        let temp = Object.assign({}, _this.formParam);
                        temp['parentUuid'] = -1;
                        temp['method'] = temp['method'].join(",");
                        temp['hiddenFlag'] = temp['hiddenFlag'] == '1' ? true :false;
                        temp['dropDownFlag'] = temp['dropDownFlag'] == '1' ? true :false;
                        
                        if(_this.dotype == 'add' && _this.parentUuid){
                            delete temp['uuid'];
                            temp['parentUuid'] = _this.parentUuid;
                        }
                        if(_this.dotype == 'update'){
                            delete temp['parentUuid'];
                        }
                        _this.dialogFormVisible = true;
                        sysResApi[_this.dotype](temp).then(response=>{
                            let res = response.data;
                             _this.dialogFormVisible = false;
                            if(res.code == 1){
                                _this.$notify({
                                    title: '成功',
                                    message: res.msg,
                                    type: 'success',
                                    duration: 2000
                                });
                                _this.getAllResources();
                            }
                        })
                    }
                });
            },
            deleteItem() {
                let _this = this;
                if(!_this.formParam['uuid']) {
                    this.$message({
                        message: '请选择要删除的节点',
                        type: 'warning'
                    });
                    return ;
                }
                if(this.nodeItem['children'].length > 0){
                    this.$message({
                        message: '请先删除子节点',
                        type: 'warning'
                    });
                    return ;
                }
                this.activeType = '3';
                this.$confirm('确认删除 节点：'+_this.formParam.resourceName+'？', '确定删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sysResApi.updateState({uuid:_this.formParam.uuid,resourceState:0}).then(response=>{
                        _this.getAllResources();
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
            },
            selectIcon(){
               const wscnIconList = this.$refs.wscnIconList;
               let icon =  wscnIconList.getIcon();
               this.formParam['icon'] = icon;
               this.dialogIconVisible = false;
            }
        }
    }
</script>