<template>
  <div>
    <el-upload
            :limit="10"

            :multiple="true"
            :auto-upload="true"
            :accept="fileType"
            :list-type="listType"
            :disabled="disabled"

            :action="uploadURL"
            :data="uploadData"
            :file-list="fileList"

            :on-exceed="exceed"
            :before-upload="before"
            :http-request="upload"
    >

      <i slot="default" class="el-icon-plus"></i>


      <template slot="file" slot-scope="{file}">

        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">

          <span class="el-upload-list__item-preview"
                @click="handlePreview(file)">
                  <i class="el-icon-zoom-in"></i>
          </span>


          <!--v-if="disabled" -->
          <span class="el-upload-list__item-delete"
                @click="handleDownload(file)">
                <i class="el-icon-download"></i>
          </span>

          <span class="el-upload-list__item-delete" v-if="!disabled"
                @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
          </span>

          </span>

      </template>


    </el-upload>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <el-image-viewer v-if="imageShow"
                     :url-list="urlList"
                     :initial-index="imageIndex"
                     :on-close="() => {imageShow=false}"
    ></el-image-viewer>


  </div>
</template>

<script>

  import {requestUploadFile, requestUploadBusiness} from 'network/request'
  import ElImageViewer from "element-ui/packages/image/src/image-viewer";
  import md5 from 'js-md5';
  import qs from 'qs'

  export default {
    name: "uploadAccessoryComponents",
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        imageShow: false,
        imageIndex: 0,

        listType: 'picture-card',
        fileType: ".bmp,.jpg,.jpeg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp",

        uploadData: null,
        uploadURL: '',
        fileList: [],
      }
    },
    computed: {
      disabled() {
        return this.formObject.fromStatus === 'WAIT' ? false : true;
      },
      formObject() {
        return this.$store.getters.getFormObject;
      },
      urlList() {
        return this.fileList.map(file => {
          return file.url
        });
      }
    },
    methods: {
      //预览文件
      handlePreview(file) {

        if (this.disabled) {
          this.imageIndex = this.computedIndex(file.uid);
          this.imageShow = true;
        } else {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        }

      },
      //下载文件
      handleDownload(file) {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = file.url
        a.setAttribute('download', file.name)
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)

      },
      //删除文件
      handleRemove(file) {

        this.$confirm('确定删除此附件吗？')
            .then(_ => {

              this.fileList.splice(this.computedIndex(file.uid), 1)

              requestUploadBusiness({
                url: '/delete',
                method: "get",
                params: {
                  fileId: file.fileId
                }
              }).then(res => {

                this.$message.success(res.message)

              }).catch(error => {
                console.log(error);
              })
            })
            .catch(_ => {

            });

      },

      //计算索引
      computedIndex(uid) {
        return this.fileList.findIndex(f => {
          return f.uid == uid
        });
      },

      //超出限制时触发
      exceed(files, fileList) {
        this.$message({
          title: '提示',
          message: '超出文件支持个数！（MAX:10）',
          type: 'error',
          offset: 40,
        });
      },
      //文件上传以前
      before(file) {

        const isIMAGE = "image/bmp,image/jpg,image/jpeg,image/image/png,image/tif,image/gif,image/pcx,image/tga,image/exif,image/fpx,image/svg,image/psd,image/cdr,image/pcd,image/dxf,image/ufo,image/eps,image/ai,image/raw,image/WMF,image/webp".includes(file.type);
        const isLt1G = file.size / 1024 / 1024 / 1024 < 1;

        if (!isIMAGE) {
          this.$message.error('上传文件只能是图片格式!');
          return false;
        }
        if (!isLt1G) {
          this.$message.error('上传文件大小不能超过 1MB!');
          return false;
        }
        return isIMAGE && isLt1G;
      },
      // 自定义文件上传
      upload(upload) {

        //从组件中获取文件对象
        let file = upload.file
        //向列表中追加文件
        // this.urlList.push({'url':window.URL.createObjectURL(new Blob([file],{type:'image/jpeg'}))});

        requestUploadFile({
          url: "/upload",
          method: "post",
          data: qs.stringify({
            "fileMd5": md5(file.name),
            "fileName": file.name,
          }),
        }).then(res => {

          if (!JSON.parse(res.result)) {
            return requestUploadFile({
              url: "/upload",
              method: "post",
              data: this.parseToFormData(file, res),
            })
          }

          return res;
        }).then(res => {

          let fileUpload = res.fileUpload;

          // let href = "/zjsj/a/index/abcd/wert";
          /(\/\w+)\//.test(location.pathname);

          return requestUploadBusiness({
            url: '/save',
            method: "post",
            data: qs.stringify({
              fileId: fileUpload.id,
              name: fileUpload.fileName,
              url: RegExp.$1 + fileUpload.fileUrl,
              fileFormId: this.formObject.fromId,
              fileProjectId: this.formObject.fromProjectId,
              isNewRecord: true,
            })
          })

        }).then(res => {
          this.urlList.push(res.data.url)
        }).catch(error => {
          console.log(error);
        })

      },
      // JSON to FROMDATA
      parseToFormData(file, data) {
        let formData = new FormData();
        formData.append("bizKey", this.formObject.fromId);
        formData.append("bizType", "zjsjProjectFrom_from");
        formData.append("uploadType", "image");
        formData.append("fileMd5", data.fileUpload.fileEntity.fileMd5);
        formData.append("fileName", data.fileUpload.fileName);
        formData.append("fileUploadId", data.fileUploadId);
        formData.append("fileEntityId", data.fileEntityId);
        formData.append("name", data.fileUpload.fileName);
        formData.append("lastModifiedDate", file.lastModifiedDate);
        formData.append("file", file);
        return formData;
      },
      init() {
        if (this.disabled) {
          requestUploadBusiness({
            url: '/getFileList',
            method: "get",
            params: {
              fileFormId: this.formObject.fromId,
              fileProjectId: this.formObject.fromProjectId,
            }
          }).then(data => {
            this.fileList = data;
          }).catch(error => {
            console.log(error);
          })
        }
      }
    },
    created() {
      this.init();
    },
    components: {
      ElImageViewer,
    }
  }
</script>

<style>
  .filePlus {
    width: 146px;
    height: 146px
  }

  /deep/ .el-upload--picture-card {
    width: 100px;
    height: 100px;
  }


  /deep/ .el-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    width: 150px;
    height: 100px;
    line-height: 100px;
  }

  /deep/ .avatar {
    width: 100px;
    height: 100px;
  }

</style>