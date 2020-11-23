<template>
  <!--展示-->
  <!--wait——灰色 / process —— 黑色 / finish —— 蓝色 / error —— 红色 / success —— 绿色 -->
  <!--<el-steps :active="currentNode" process-status="wait" finish-status="error" refs="flow"-->

  <el-steps :active="currentNode-1" :finish-status="finish" :process-status="process" ref="node"
            direction="vertical" :space="80">
    <el-step title="建设单位" v-for="(item,index) in flowList"
             :key="item.id">

      <template slot="icon">
        <strong>{{item.nodeId}}</strong>
      </template>
      <template slot="title">
        <span>{{item.nodeConstructionName + ' —— ' + item.nodeUserName}}</span>
      </template>


      <!--已审批-->
      <template slot="description" v-if="item.nodeId<currentNode">
        <div class="step-row" :class="finish">
          审批人 <span style="color:#219AFF">{{item.nodeUserName}}</span> 通过审批
        </div>

      </template>

      <!--审批中-->
      <template slot="description" v-if="item.nodeId==currentNode">

        <div v-if="$store.getters.getFormObject.fromStatus==='STOP'" class="step-row error">
          审批人 <span style="color:#219AFF">{{item.nodeUserName}}</span> 驳回审批
        </div>

        <div v-else-if="currentUser!==item.nodeUserCode" class="step-row process">
          审批人 <span style="color:#219AFF">{{item.nodeUserName}}</span> 正在审批中 ...
        </div>

        <el-form v-else :model="node" :rules="nodeRules" ref="node">

          <!--流程ID-->
          <!--单位名称-->
          <!--用户名称-->
          <!--审批时间 -->

          <!--审批意见-->
          <el-form-item label="会签栏：" prop="nodeOpinion">
            <el-input type="textarea" v-model="node.nodeOpinion" :autosize="{minRows:5,maxRows:1000}"
                      resize="none"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="success" @click="resolveOrReject(1,item,node.nodeOpinion)">
              下一级审批人
            </el-button>
            <el-button type="danger" @click="resolveOrReject(0,item,node.nodeOpinion)">驳回</el-button>
          </el-form-item>

          <!--info——灰色 / primary —— 黑色 / primary —— 蓝色 / danger —— 红色 / success —— 绿色 -->
          <!--          <el-form-node >
                      <el-row >
                        <el-col :span="5">
                          <el-button type="info">签字</el-button>
                        </el-col>
                        <el-col :span="5">
                          <el-button type="info">盖章</el-button>
                        </el-col>
                        <el-col :span="8">
                          <el-button type="info">下一级审批人</el-button>
                        </el-col>
                        <el-col :span="5"  :offset="1">
                          <el-button type="danger">驳回</el-button>
                        </el-col>
                      </el-row>
                    </el-form-node>-->


        </el-form>
        <!--        </div>-->


      </template>

      <!--待审批-->
      <template slot="description" v-if="item.nodeId>currentNode">
        <div class="step-row wait">
          {{item.nodeUserName}} 待审批
        </div>
      </template>

    </el-step>
  </el-steps>
</template>

<script>

  import {requestNodeInit, requestNodeCommit} from "network/request";


  export default {
    name: "stepsShowComponents",
    data() {
      return {
        node: {   // 审批意见表单
          nodeOpinion: '',
        },
        nodeRules: { // 审批意见表单的验证规则
          nodeOpinion: [
            {required: true, message: '请填写会签栏', trigger: 'blur'},
            { min: 1, max: 255, message: '意见字符长短超出', trigger: 'blur' }
          ]
        },

        flowList: [], // 审批进行时的集合
        currentUser: '',   //当前用户
        currentNode: 0,  // 激活的步骤条

      }
    },
    computed: {
      finish() {
        const status = this.$store.getters.getFormObject.fromStatus;

        return status === "ACTION" || status === "END" ? "success" : "success";
      },
      process() {
        const status = this.$store.getters.getFormObject.fromStatus;

        return status === "STOP" ? "error" : "finish";
      },
    },
    methods: {
      validate(resultBack) {
        const node = this.$refs.node[0];

        node.validate((valid) => {
          if (valid) {
            return resultBack()
          }
        })

      },
      resolveOrReject(flag, node, nodeOpinion) {

        node.nodeOpinion = nodeOpinion;
        node.nodeDate = new Date();

        this.validate(() => {

          //状态
          let formObject = this.$store.getters.getFormObject;
              formObject.fromStatus =  flag ? node.nodeId==this.flowList.length?'END':'ACTION' : 'STOP';
          this.$store.commit("updateFormObject",formObject)

          //意见
          let opinions = this.$store.getters.getOpinions;
              opinions.push(node);
          this.$store.commit("updateOpinions", opinions);

          //执行
          let result = flag ? this.resolve(node,formObject.fromStatus) : this.reject(node);

        })


      },
      resolve(node,status) {

        //清空表单
        this.$refs.node[0].resetFields();

        //节点增加
        this.currentNode++;

        return requestNodeCommit({
          url: "resolve",
          method: "post",
          data: node,
          params: {
            fromId: this.$store.getters.getFormObject.fromId,
            fromStatus: status,
          }
        }).then(res => {
          // this.$message.success(res.message)
          return res;
        }).catch(error => {
          return error;
        })


      },
      reject(node) {

        return requestNodeCommit({
          url: "reject",
          method: "post",
          data: node,
          params: {
            fromId: this.$store.getters.getFormObject.fromId,
            fromStatus: "STOP",
          }
        }).then(res => {
          // this.$message.success(res.message)
          return res;
        }, error => {
          return error;
        })

      },
      initData() {
        const id = this.$store.getters.getFormObject.fromId;
        requestNodeInit({
          url: 'getNodeList',
          method: "get",
          params: {
            fromId: id,
            nodeFromId: id
          }
        }).then(res => {

          this.flowList = res.flowList;
          this.currentUser = res.currentUser;
          this.currentNode = res.currentNode;

          console.log(this.flowList.length != this.currentNode);

          this.$store.commit("updateOpinions",this.flowList.length != this.currentNode?res.flowList.filter(flow => {

            return flow.nodeId < res.currentNode;
          }):this.flowList);

        }, error => {
          console.log(error);
        })
      },
    },
    created() {
      this.initData();
    },
    mounted() {
    },
    filters: {}
  }
</script>

<style scoped>


  .step-row {
    width: 372px;
    min-height: 33px;
    margin: 5px 0 10px;
    padding: 5px 5px 5px;
    color: #919192;
    font-size: 14px;
    line-height: 33px;
  }

  .success {
    background-color: #c2e2c0
  }


  .wait {
    background-color: #eeeeee
  }

  .process {
    background-color: #D9E5F9
  }

  .error {
    background-color: #ffe0e0;
  }




</style>