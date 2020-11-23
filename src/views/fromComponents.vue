<template>
  <div id="fromView">
    <el-row type="flex" justify="space-between" align="bottom">
      <el-col :span="22">
        <el-link type="primary" href="${ctx}zjsj/zjsjProject/list" icon="el-icon-d-arrow-left">返回 签证列表
        </el-link>
      </el-col>
      <!--<el-col :span="2">
        <el-link type="primary" @click="submitForm('fromChangeVisa')" icon="el-icon-finished">保存</el-link>
      </el-col>-->
      <el-col :span="2" :offset="2">
        <el-link type="primary" v-print="'#preview'" icon="el-icon-printer">打印</el-link>
      </el-col>
    </el-row>
    <el-form :model="fromChangeVisa" ref="fromChangeVisa">
      <div id="preview">
        <p style="text-align: center;font-family:宋体;font-size: 19px;font-weight: bolder">
          工程签证单
        </p>
        <p style="text-align: left">
          <el-row type="flex" justify="space-between">
            <el-col>
              签证编号：{{(fromChangeVisa.fromType==0?'Q':'B') + fromChangeVisa.fromId}}
            </el-col>
            <el-col>
              工程名称：{{fromChangeVisa.fromProjectName}}
            </el-col>
          </el-row>
        </p>
        <table id="table1" style="border-collapse:collapse;">
          <tbody>
          <tr style="height:39px" class="firstRow">
            <td width="110" valign="middle">
              分部分项位置
            </td>
            <td width="160" valign="middle">

              <el-input v-model.trim="fromChangeVisa.fromPosition" placeholder="请填写分部分项位置"
                        :readonly="readonly"></el-input>

            </td>
            <td width="110" valign="middle">
              施工时间

            </td>
            <td width="160" valign="middle">
              <el-date-picker type="date" placeholder="请选择施工时间" style="width: 190px"
                              v-model.trim="fromChangeVisa.fromConstructionDate"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"
                              :clearable="false" :readonly="readonly"></el-date-picker>
            </td>
            <td width="110" valign="middle" placeholder="请填写费用">
              建设单位

            </td>
            <td width="160" valign="middle">

              <el-input v-model.trim="fromChangeVisa.fromBuild" placeholder="请填写建设单位" :readonly="readonly"></el-input>

            </td>
          </tr>
          <tr style="height:39px">
            <td width="110" valign="middle">
              工期（天）

            </td>
            <td width="160" valign="middle" id="td2">

              <el-input v-model.trim.number="fromChangeVisa.fromDays" placeholder="请填写工期" type="number" max="100000"
                        min="1" :readonly="readonly"></el-input>

            </td>

            <td width="110" valign="middle">
              施工单位

            </td>
            <td width="160" valign="middle">

              <el-input v-model.trim="fromChangeVisa.fromConstruction" placeholder="请填写施工单位"
                        :readonly="readonly"></el-input>

            </td>
            <td width="110" valign="middle">
              费用（元）
            </td>
            <td width="160" valign="middle">

              <el-input v-model.number="fromChangeVisa.fromCost" placeholder="请填写费用" type="number" max="100000000"
                        defaultValue="0"
                        min="0" :readonly="readonly"></el-input>

            </td>
          </tr>

          <tr>
            <td valign="top" colspan="6">

                <span style="margin:0;margin-top: 5px;text-align:center;font-family:宋体;color:rgb(164,164,164);font-size:13px">
                  签证原因</span>
              <el-input type="textarea" v-model.trim="fromChangeVisa.fromReason" autosize resize="none"
                        style="min-height: 40px"></el-input>

            </td>
          </tr>

          <tr>
            <td valign="top" colspan="6">

                <span style="margin:0;margin-top: 5px;text-align:center;font-family:宋体;color:rgb(164,164,164);font-size:13px">
                  签证内容</span>
              <el-input type="textarea" v-model.trim="fromChangeVisa.fromContent" autosize resize="none"
                        style="min-height: 40px"></el-input>

            </td>
          </tr>

          </tbody>
        </table>

        <table id="table2" style="border-collapse:collapse;">

          <tr v-for="(item,index) in $store.getters.getOpinions" v-if="index % 2 == 0">

            <td width="426" valign="top" colspan="3" height="151" v-for="it in $store.getters.getOpinions.slice(index,index+2)" >

              <div style="margin: 10px">
                <p>
                  {{it.nodeConstructionName}}意见：
                </p>

                <p align="center">

                  <el-input type="textarea" v-model.trim="it.nodeOpinion" autosize resize="none" :readonly="true"
                            style="min-height: 40px"></el-input>


                </p>
                <p align="right">
                  {{$moment(it.nodeDate).format("YYYY-MM-DD HH:mm:ss")}}
                </p>
              </div>

            </td>

          </tr>

        </table>

      </div>
    </el-form>

  </div>
</template>

<script>
  import {requestFromCommit, requestNodeInit} from "network/request";
  import qs from 'qs'

  export default {
    name: "fromComponents",
    data() {
      return {
        // fromChangeVisa: {
        //   fromId: null,
        //   fromType: null,
        //   fromStatus: 'WAIT',
        //   fromProjectName: null,
        //   fromPosition: null,
        //   fromBuild: null,
        //   fromConstructionDate: new Date(),
        //   fromConstruction: null,
        //   fromCost: null,
        //   fromDays: null,
        //   fromReason: null,
        //   fromContent: null,
        //   fromSponsor: null,
        //   fromProjectId: null,
        //   fromFlowId: null,
        //   fromFlowModeId: null,
        // },
        opinionList: [],
      }
    },
    computed: {
      fromChangeVisa(){
        return this.$store.getters.getFormObject;
      },
      readonly() {
        return this.fromChangeVisa.fromStatus === 'WAIT' ? false : true
      }
    },
    methods: {
      validateForm() {
        /*验证表单*/
        let errorMessage;
        if (!this.fromChangeVisa.fromPosition) {
          errorMessage = "请填写分部分项位置";
        } else if (!this.fromChangeVisa.fromConstructionDate) {
          errorMessage = "请选择施工时间";
        } else if (!this.fromChangeVisa.fromBuild) {
          errorMessage = "请填写建设单位";
        } else if (!this.fromChangeVisa.fromDays) {
          errorMessage = "请填正确写工期";
        } else if (isNaN(this.fromChangeVisa.fromDays)) {
          errorMessage = "请填正确写工期";
        } else if (!this.fromChangeVisa.fromConstruction) {
          errorMessage = "请填写施工单位";
        } else if (!this.fromChangeVisa.fromCost) {
          if (this.fromChangeVisa.fromType == 0)
            errorMessage = "请填写费用";
        } else if (isNaN(this.fromChangeVisa.fromDays)) {
          errorMessage = "费用不能为字符";
        } else if (!this.fromChangeVisa.fromReason) {
          errorMessage = "请输填写原因";
        } else if (!this.fromChangeVisa.fromContent) {
          errorMessage = "请输入内容";
        }
        return errorMessage;
      },
      submitForm() {
        //向 fromChangeVisa 追加 fromStatus:ACTION
        this.$set(this.fromChangeVisa, "fromStatus", "ACTION")

        //提交表单
        requestFromCommit({
          url: "save",
          method: "post",
          data: qs.stringify(this.fromChangeVisa),
        }).then(res => {

          this.$store.commit("updateFormObject", res.data);

        }, error => {

          console.log(error);

        });

      },
    },

  }


</script>


<style>

  #fromView {
    width: 866px;
    margin: 0 auto;
    overflow: hidden;
  }

  #preview {
    /*padding: 10px;*/
    flex: 1;
  }

  #preview * {
    font-family: sans-serif;
    font-size: 14px;
  }

  #table1, #table1 td {
    text-align: center;
    border: solid #000 1px;
  }

  #table2, #table2 td {
    border: solid #000 1px;
    border-top-width: 0;
  }

  #table1 td input {
    outline: none;
    border: none;
  }

  #preview textarea {
    overflow: hidden;
    border: none;
  }


</style>