<template>
    <div>
        <template v-for="item in routes">
            <router-link v-if="!item.hiddenFlag&&item.dropDownFlag&&item.children.length>0" :to="item.url+'/'+item.children[0].url">
                <el-menu-item :index="item.url+'/'+item.children[0].url">
                    <wscn-icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.children[0].resourceName}}
                </el-menu-item>
            </router-link>
            <el-submenu :index="item.resourceName" v-if="!item.dropDownFlag&&!item.hiddenFlag">
                <template slot="title">
                    <wscn-icon-svg v-if='item.icon' :icon-class="item.icon" /> {{item.resourceName}}
                </template>
                <template v-for="child in item.children" v-if='!child.hiddenFlag'>
                    <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
                    <router-link v-else class="menu-indent" :to="item.url+'/'+child.url">
                        <el-menu-item :index="item.url+'/'+child.url">
                            {{child.resourceName}}
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>

    export default {
      name: 'SidebarItem',
      props: {
        routes: {
          type: Array
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .wscn-icon {
        margin-right: 10px;
        color: #fff;
    }
    .hideSidebar .menu-indent{
        display: block;
        text-indent: 10px;
    }
</style>

