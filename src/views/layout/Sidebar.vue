<template>
    <el-menu mode="vertical" theme="dark" :unique-opened="true" :default-active="$route.path">
        <sidebar-item :routes='menus'></sidebar-item>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SidebarItem from './SidebarItem';
    export default {
      name:'siderbar',  
      components: { SidebarItem },
      computed: {
        ...mapGetters([
          'menus'
        ])
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .el-menu {
        min-height: 100%;
    }
</style>
