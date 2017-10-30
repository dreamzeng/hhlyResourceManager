<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <div class="panel">
                    <div class="panel-body">
                        <router-link :to="{name: 'resourceManager_index'}">
                            <el-tag :class="{ activeTag : utype == '1' }">我的待办</el-tag>
                        </router-link>
                        <router-link :to="{name: 'resourceManager_myRes'}">
                            <el-tag :class="{ activeTag : utype == '2' }">我的资源</el-tag>
                        </router-link>
                        <router-link :to="{name: 'resourceManager_index'}">
                            <el-tag :class="{ activeTag : utype == '3' }">集团资源池</el-tag>
                        </router-link>
                    </div>
                </div>    
            </div>
        </div>
    </div>
</template>
<script>
    export default {
      props: {
        utype: {
          type: String,
           default: '1'
        }
      }
    }
</script>
<style scoped>
    .activeTag{
        color: #FFF;background: #2185D0
    }
</style>
