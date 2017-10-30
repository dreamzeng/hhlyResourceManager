<template>
  <div class="app-container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">
                    <ul>
                        <li v-for="item in items" :class="{'active':item.icon == icon ? true : false}" :key="item.icon" @click="active(item)">
                            <wscn-icon-svg  :icon-class="item.icon" /> {{item.title}}
                        </li>
                    </ul>
                </div>
            </div>    
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SidebarItem',
    data(){
        return {
            items:[
                {icon:'QQ',title:'QQ'},
                {icon:'weixin',title:'weixin'},
                {icon:'bug',title:'bug'},
                {icon:'tubiaoleixingzhengchang',title:'tubiaoleixingzhengchang'},
                {icon:'quanxian',title:'quanxian'},
                {icon:'mima',title:'mima'},
                {icon:'jiedianyoujian',title:'jiedianyoujian'},
                {icon:'zonghe',title:'zonghe'},
                {icon:'404',title:'404'},
                {icon:'xinrenzhinan',title:'xinrenzhinan'},
                {icon:'theme',title:'theme'},
                {icon:'tuozhuai',title:'tuozhuai'},
                {icon:'wujiaoxing',title:'wujiaoxing'},
                {icon:'EXCEL',title:'EXCEL'},
                {icon:'a',title:'a'},
                {icon:'b',title:'b'},
                {icon:'c',title:'c'},
                {icon:'zujian',title:'zujian'}
            ],
            icon:''
        }
    },
    methods: {
        active(item){
            this.icon = item.icon;
        },
        getIcon(){
            return this.icon;
        },
        execute: function () {
            this.$emit('selectIcon',this.icon);
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/index.scss";
    .panel-heading{
        ul{
             @include clearfix;
             li{
                margin: 8px;
                display: inline-block;
                font-size: 14px;
                margin-right: 16px;
                cursor: pointer;
            }
        } 
        
     }
    .wscn-icon {
        width: 20px;
        height: 20px;
    }
    .active{
        color: #ec6459;
    }
</style>
