<template>
   <div class="app-container">
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-heading">当前用户：{{userName}}</div>
            </div>    
        </div>
    </div>

    <!-- 上传测试  -->
    <div class="row">
        <div class="col-lg-12">
            <div class="panel">
                <div class="panel-body">
                     <upload-image ref="profile"></upload-image>
                </div>
            </div>    
        </div>
    </div>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { UploadImage } from 'components/upload';
    export default {
      name: 'home',
      components: {
        UploadImage
      },
      data() {
        return {
         
        }
      },
      computed: {
        ...mapGetters([
          'userName'
        ])
      },
      mounted(){
       
      }
    }
</script>
