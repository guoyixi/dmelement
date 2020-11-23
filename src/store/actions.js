import {requestFromInit} from "network/request";
import {getUrlParam} from "common/utils/pathUtils";

//获取路径上的表单ID
// let fromId = getUrlParam('fromId');
let fromId = 14

export default {
  initFormObject(context, payload) {
    return requestFromInit({
      url: 'init',
      method: "get",
      // params: {fromId},
      params: {fromId},
    }).then(res => {

      context.commit("updateFormObject",res.data)

    }, error => {

      throw new Error(error);

    });
  }

}
