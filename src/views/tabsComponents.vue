<template>

  <el-tabs v-model="activeTabs" tab-position="top" >

    <!--wait——灰色 / process —— 黑色 / finish —— 蓝色 / error —— 红色 / success —— 绿色 -->
    <el-tab-pane label="审批流程" name="first">

      <steps-operation-components v-if="activeSteps"></steps-operation-components>
      <steps-show-components v-else></steps-show-components>

    </el-tab-pane>

    <el-tab-pane label="附件上传" name="second">
      <upload-operation-components ref="uploadOperationComponents"></upload-Operation-components>
    </el-tab-pane>

  </el-tabs>
</template>

<script>

  import stepsOperationComponents from "components/current/flowApproval/stepsOperationComponents";
  import stepsShowComponents from "components/current/flowApproval/stepsShowComponents";
  import uploadOperationComponents from "components/current/fileUploadAccessory/uploadOperationComponents";

  export default {
    name: "tabsComponents",
    data() {
      return {
        activeTabs: 'first', //激活的标签页
      }
    },
    computed:{
      activeSteps(){
        return this.$store.getters.getFormObject.fromStatus === 'WAIT' ? true : false
      }
    },
    components: {
      stepsOperationComponents,
      stepsShowComponents,
      uploadOperationComponents,
    }
  }
</script>

<style scoped>


</style>