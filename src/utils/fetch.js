import axios from 'axios';
import { Message,MessageBox } from 'element-ui';
import store from '../store';
const qs = require('qs');

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  //timeout: 5000,                  // 请求超时时间
  withCredentials: true,         //跨域设置
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});
console.log('请求api：'+process.env.BASE_API);

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    //config.headers['token'] = store.getters.token; // 让每个请求携带token--['token']为自定义key, 本项目不用 token

  }
  console.log('请求串 body：'+JSON.stringify(config.data));
  config.data = qs.stringify(config.data);
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
    console.log('返回串：',response);
    const res = response.data;
    if(res.code == 0 || res.code == 401){
      Message({
        showClose: true,
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      });
    }
    if(res.code == 10){
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
           confirmButtonText: '重新登录',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload();// 为了重新实例化vue-router对象 避免bug
            });
         }).catch(() => {

         });
    }
    return response;
  },
  error => {
    console.log(error);// for debug
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;
