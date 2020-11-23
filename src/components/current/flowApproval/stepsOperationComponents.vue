<template>
  <div>
    <!--操作-->
    <el-steps :active="approvalProcessConstructionList.length"
              process-status="process"
              finish-status="process"
              direction="vertical"
              :space="80">

      <el-step v-for="(item,index) in approvalProcessConstructionList"
               :key="item.nodeId">

        <template slot="icon">
          <strong>{{index+1}}</strong>
        </template>

        <template slot="title">
          <el-row type="flex" justify="start">

            <el-col>
              <el-popover
                      placement="bottom"
                      title="请根据单位选择人员"
                      width="400"
                      trigger="click">

                <el-cascader-panel size="medium" ref="cascaderComponents"
                                   :options="constructionAndEmployeeList"
                                   :props="{expandTrigger:'hover',emitPath:true}"
                                   @change="((data)=>{changeConstructionAndEmployee(data,index)})">
                </el-cascader-panel>

                <span slot="reference" style='cursor:pointer'>
                  <span v-if="typeof(item.nodeConstructionCode)=='undefined'">
                      <span style='color: #409EFF'>点击选择单位和人员</span>
                  </span>
                  <span v-else>
                      <span>{{item.nodeConstructionName + ' —— ' + item.nodeUserName}}</span>
                  </span>
                </span>

              </el-popover>
            </el-col>

            <el-col :span="7">
              <el-button circle size="small" icon="el-icon-plus" @click="pushNode(index)">
                <!--添加审批单位-人员-->
              </el-button>
              <el-button circle size="small" icon="el-icon-minus" @click="splitNode(index)">
                <!--移除审批单位-人员-->
              </el-button>
            </el-col>

          </el-row>
        </template>

      </el-step>

    </el-steps>

    <!--提交-->
    <el-row type="flex" justify="end">
      <el-col :span="6">
        <el-button type="primary" size="small" icon="el-icon-check"
                   @click="commitFlowNodeAndFromAndFile">
          提交审批
        </el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>

  import {requestConstructionAndEmployeeList, requestFlowCommit} from "network/request";


  export default {
    name: "stepsOperationComponents",
    data() {
      return {

        constructionAndEmployeeList: [], //单位和人员的集合

        approvalProcessConstructionId: 0, //流程节点ID

        approvalProcessConstructionList: [{}],//流程节点的集合

      }
    },
    methods: {
      // 创建流程节点
      changeConstructionAndEmployee(data, index) {

        let construction = this.constructionAndEmployeeList.find(c => {
          return c.value === data[0]
        });

        let user = construction.children.find(u => {
          return u.value === data[1]
        });


        this.approvalProcessConstructionList.splice(index, 1, {
          nodeId: this.approvalProcessConstructionId++,
          nodeConstructionCode: construction.value,
          nodeConstructionName: construction.label,
          nodeUserCode: user.value,
          nodeUserName: user.label,
          nodeFromId: this.$store.getters.getFormObject.fromId,
        });

      },
      // 提交流程————提交表单
      commitFlowNodeAndFromAndFile() {

        /*
        ————验证节点
          1、判断每个流程节点是否不为空
          2、两个数组的长度相等则
        */
        const ts = this.approvalProcessConstructionList.filter(obj => {
          if (Object.keys(obj).length != 0) {
            return true;
          }
        });
        if (this.approvalProcessConstructionList.length !== ts.length) {
          this.$message({
            title: '提示',
            message: "请您将节点上的信息选择完整！",
            type: 'error',
            offset: 40,
            duration: 2000
          });
          return false;
        }

        /*
        ————验证表单
          1、判断每个选项是否为空
          2、判断工期和费用是否为数字
          3、判断fromType==0的 签证 单费用 != 0
          4、判断fromType==1的 变更 单费用 == 0
        */
        let message = this.$root.$children[0].$refs.fromComponents.validateForm();
        if (message != null) {
          this.$message({
            title: '提示',
            message,
            type: 'error',
            offset: 40,
            duration: 2000
          });
          return false;
        }

        //加载层
        const loading = this.$loading({
          lock: true,
          text: '审批创建中，请稍后...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        let id = 1;


        /*提交流程*/
        requestFlowCommit({
          url: 'commitConstructionAndEmployeeFlowList',
          method: "post",
          data: this.approvalProcessConstructionList.map(flow => {
            //重置nodeId
            flow.nodeId =  id++
            return flow;
          }),
          params: {
            fromId: this.$store.getters.getFormObject.fromId,
          }
        }).then(res => {

          if (JSON.parse(res.result)) {
            /*提交表单*/
            this.$root.$children[0].$refs.fromComponents.submitForm();

            /*加载文件*/
            this.$root.$children[0].$refs.tabsComponents.$refs.uploadOperationComponents.init()
          }

        }).catch(e => {
          console.log(e);
        }).finally(e => {
          loading.close();//关闭加载层
        })


      },
      //添加节点
      pushNode(index) {

        /*
          one: 需要添加修改删除元素的索引
          two: 0为添加 >1需要替换或删除元素的个数
          three: 添加或替换的元素
        */
        this.approvalProcessConstructionList.splice(index + 1, 0, {})

      },
      //移除节点
      splitNode(index) {
        if (this.approvalProcessConstructionList.length > 1) {
          this.approvalProcessConstructionList.splice(index, 1)
        }
      },
      //初始化
      init() {
        requestConstructionAndEmployeeList({
          url: 'getConstructionAndEmployeeList',
          method: "get",
          params: {
            fromId: this.$store.getters.getFormObject.fromId,
          }
        }).then(res => {
          if (res.result !== 'login') {
            this.constructionAndEmployeeList = res.data;
          }
        }).catch(e => {
          console.log(e);
        })
      },
    },
    //初始化单位人员
    created() {
      this.init();
    }
  }


</script>

<style scoped>

</style>