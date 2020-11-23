import {INCREMENT} from "./mutations-types";

export default {
  updateLoading(state,flag){
    state.loading = flag;
  },
  updateFormObject(state,obj){
    state.formObject = obj;
  },
  updateOpinions(state,list){
    state.opinions = list;
  },

}
