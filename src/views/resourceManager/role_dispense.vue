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
                <div class="panel-body" v-loading.body="listLoading">
                     <el-form class="small-space" :model="formParam" ref="formParam" label-position="left" label-width="120px">
                        <el-form-item label="角色名称">
                            <el-input v-model="formParam.roleName" disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="角色编码">
                            <el-input v-model="formParam.roleCode" disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述">
                            <el-input type="textarea" v-model="formParam.description" disabled="disabled"></el-input>
                        </el-form-item>
                        <el-form-item label="选择菜单">
                            <!--<div style="margin-bottom:15px;">
                                <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                                </el-input>
                            </div>    
                            <el-tree
                            :data="resList"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            ref="treeRes"
                            highlight-current
                            :check-strictly="checkStrictly"
                            :filter-node-method="filterNode"
                            :default-checked-keys="defKeys"
                            :props="defaultProps">
                            </el-tree>-->

                             <div id="resourceTree" style="min-height: 400px;padding:10px; border: 1px solid #e2e2e4;"></div>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="update()" :loading="dialogFormVisible" >保存</el-button>
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
    import {roleApi,sysResApi} from 'api/resourceManager'

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
            dialogFormVisible:false,
            listLoading:true,
            checkStrictly:false,
            filterText: '',
            resList: [],
            defKeys:['5cd995d495ed4ebb90618a1c4148c5ae',"39384cc020a44fbbb76680bb22adb667"],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
      },
      computed: {
        title(){
            return this.$route.meta.title
        }
      },
      watch: {
        filterText(val) {
            this.$refs.treeRes.filter(val);
        }
      },
      created() {
        this.fetchData();
      },
      methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //获取详情
        fetchData(){
            let id = this.$route.params.id;
            if(!id) return;
            roleApi.itemInfo(id).then(response=>{
                let res = response.data;
                if(res.code == 1){
                    this.formParam = {
                        uuid: res.data.uuid,
                        roleName:res.data.roleName, //角色名称
                        roleCode:res.data.roleCode,//角色编码
                        description:res.data.description//描述
                        
                    }   
                }
            });
            sysResApi.getAllResources({roleUuid:id}).then(response => {
                let res = response.data;
                if(res.code == 1){
                    //this.resList= this.formatObj(res.data);

                    let resList =  this.formatObj(res.data);
                    let tree=$("#resourceTree").jstree({
                        "checkbox":{"keep_selected_style":false},
                        "core":{
                            "multiple":true,
                            "animation":0,
                            "themes":{
                                theme:"classic",
                                "dots":true,
                                "icons":false
                            },
                            "check_callback":true,
                            'data':resList
                        },
                        "plugins":["wholerow","checkbox"]
                    });
                }
                this.listLoading = false;
            });
        },
        formatObj(obj){
            var arr = [];
            for(let i = 0,l=obj.length;i<l;i++){
                var temp = { 
                    id:obj[i]['uuid'],
                    //label:obj[i]['resourceName'],
                    text:obj[i]['resourceName'],
                    state : {'selected' : obj[i]['selected'] || false},
                    children:[]
                };
                if(obj[i]['children'] && obj[i]['children'].length > 0){
                    temp.children = this.formatObj(obj[i]['children']);
                }
                arr.push(temp);
            }
            return arr;
        },
        update(formName) {
            let array = $.jstree.reference('#resourceTree').get_selected(true);
            let ar=[];
            if(array){
                for(let i=0; i<array.length; i++){
                    let a=array[i];
                    ar.push(a.id);
                    let parents = a.parents;
                    if(parents){
                        for(let j=0;j<parents.length;j++){
                            let b = parents[j];
                            if(b!="#"){
                                ar.push(b);
                            }
                        }
                    }else{
                        if(a.parent!="#"){
                            ar.push(a.parent);
                        }
                    }
                }
            }
            let uuids = Array.from(new Set(ar));
            uuids = uuids.join(',');
          /* let nodes = this.$refs.treeRes.getCheckedNodes();
           console.log(nodes);
           let uuids = [];
           for(let i = 0,_l = nodes.length;i<_l; i++){
                if(nodes[i]['id']){
                    uuids.push(nodes[i]['id'])
                }
           }
           uuids = uuids.join(',');
           console.log(uuids);*/
           this.dialogFormVisible = true;
           roleApi.dispenseRole({
               roleUuid:this.formParam['uuid'],
               resourceUuids:uuids
           }).then(response=>{
                let res = response.data;
                this.dialogFormVisible = false;
                if(res.code == 1){
                    this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        duration: 2000
                    });
                    this.back();
                }
            })
        },
        back:function(){
            this.$router.go(-1);
        }
      }
    };
</script>
