<template>
    <Sticky :zIndex="999">
        <el-menu class="navbar" mode="horizontal">
            <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
            <levelbar></levelbar>
            <tabs-view></tabs-view>
            <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log>
        
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img class="user-avatar" :src="img">
                    <span>{{userName}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class='inlineBlock' to="/">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <screenfull class='screenfull'></screenfull>
        </el-menu>
    </Sticky>
</template>

<script>
    import { mapGetters } from 'vuex';
    import Levelbar from './Levelbar';
    import TabsView from './TabsView';
    import Hamburger from 'components/Hamburger';
    import Screenfull from 'components/Screenfull';
    import ErrorLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';

    import { Loading } from 'element-ui';

    export default {
      components: {
        Levelbar,
        TabsView,
        Hamburger,
        ErrorLog,
        Screenfull
      },
      data() {
        return {
          log: errLogStore.state.errLog,
          img: require ('assets/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'name',
          'avatar',
          'userName'
        ])
      },
      methods: {
        toggleSideBar() {
          this.$store.dispatch('ToggleSideBar')
        },
        logout() {
            let loadingInstance = Loading.service();
            this.$store.dispatch('LogOut').then(() => {
                 loadingInstance.close();
                location.reload();// 为了重新实例化vue-router对象 避免bug
            }).catch(err => {
                console.log(err);
                loadingInstance.close();
            });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        background: #fff;
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 300px;
        }
        .screenfull{
             position: absolute;
             right:25px;
             top: 16px;
             color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 75px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top:-1px;
                position: relative;
                .user-avatar {
                    width: 36px;
                    height: 36px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>



