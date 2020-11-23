import axios from 'axios'

export function requestFromInit(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
})

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    console.log(config);
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.data.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}

export function requestConstructionAndEmployeeList(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
})

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}


export function requestFlowCommit(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
  })

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })


  // 3.发送真正的网络请求
  return instance(config)
}


export function requestFromCommit(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
})

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}

export function requestNodeInit(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
})

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}

export function requestNodeCommit(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/zjsjProjectFrom',
})

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}

export function requestUploadFile(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/file',
  })

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}

export function requestUploadBusiness(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: '/dmsj/a/from/file/zjsjProjectFromFile',
  })

  // 2.1 请求响应
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log("请求失败：", err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    if (res.data.result=='login') {
      throw new Error(res.message)
    }
    return res.data
  }, err => {
    console.log("响应失败：", err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}