<template>
    <div>
        <el-upload class="image-uploader" :action="uploadApi"
            :file-list="fileList"
            :with-credentials="withCredentials"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-change="handleChange"
            list-type="picture">
            <el-button size="small" type="primary">{{btnName}}</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件（上传图片大小不能超过 {{fsize}}MB!）</div>
        </el-upload>
    </div>
</template>

<script>
    import { uploadApi } from 'utils';

    export default {
      name: 'uploadImage',
      props: {
        fsize: {
            type: Number,
            default: 2
        },
        flength:{
            type:Number,
            default:-1
        },
        btnName:{
            type:String,
            default:'点击上传'
        },
        files:{
            type:Array,
            default: function () {
                /*return [
                    {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
                    {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
                ]*/
                return []
            }
        }
      },
      data() {
        return {
            uploadApi:'',
            withCredentials:true,
            fileList:[]
        }
      },
      mounted(){
        this.uploadApi = uploadApi();
        let _files =  JSON.stringify(this.files);
        this.fileList = JSON.parse(_files);
      },
      methods:{
        getFileList(){
            console.log(this.fileList);
            return this.fileList;
        },  
        handleRemove(file, fileList) {
          this.fileList = fileList;
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < this.fsize;

          if (!isJPG && !isPNG) {
              this.$message.error('上传图片只能是 JPG,PNG 格式!');
              return false;
          }
          if (!isLt2M) {
              this.$message.error(`上传图片大小不能超过 ${this.fsize}MB!`);
              return false;
          }
          return true;
        },
        handleChange(file, fileList) {
            if(file.response && file.response.code == 10){
                let _l = fileList.length-1;
                fileList.splice(_l, 1);
                this.$confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('LogOut').then(() => {
                        location.reload();// 为了重新实例化vue-router对象 避免bug
                    });
                }).catch(() => {

                });
                return;
            }
            if(file.response && file.response.code !=1){
                file.response.msg && this.$message.error(file.response.msg);
                let _l = fileList.length-1;
                fileList.splice(_l, 1);
                this.fileList = fileList;
                return;
            }
            if(file.response && file.response.code == 1){
                file.response.msg && this.$message({
                    message: file.response.msg,
                    type: 'success'
                });
                if(this.flength != -1 && fileList.length > this.flength){
                    fileList.splice(0, 1);
                }
                this.fileList = fileList;
            }
        }
      }
    }
</script>

