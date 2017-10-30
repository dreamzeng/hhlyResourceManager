import { LoginByUser, logout, getInfo } from 'api/login';
import Cookies from 'js-cookie';
import md5 from 'js-md5';

let userSuper = Cookies.get('User-Super');
if(!userSuper || typeof userSuper == 'undefined' || userSuper == 'undefined'){
  userSuper = 'false';
}
console.log('超级管理员:',userSuper);

let userMenus = sessionStorage.getItem('User-Menus');
if(!userMenus || typeof userMenus == 'undefined' || userMenus == 'undefined'){
  userMenus = '[]';
}


const formatObj = (obj)=>{
    var arr = [];
    for(let i = 0,l=obj.length;i<l;i++){
        if(obj[i]['resourceType']['code'] == 0){ //如果资源是菜单类型
          var temp = { 
              hiddenFlag:obj[i]['hiddenFlag'],
              dropDownFlag:obj[i]['dropDownFlag'],
              url : obj[i]['url'],
              icon : obj[i]['icon'] || '',
              resourceName : obj[i]['resourceName'],
              children:[]
          };
          if(obj[i]['children'] && obj[i]['children'].length > 0){
              temp.children = formatObj(obj[i]['children']);
          }
          arr.push(temp);
        }
    }
    return arr;
}

const user = {
  state: {
    user: '',
    status: '',
    userName: Cookies.get('User-Name'),
    super: JSON.parse(userSuper),
    code: '',
    uid: undefined,
    auth_type: '',
    token: Cookies.get('Admin-Token'),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    menus:JSON.parse(userMenus)
  },

  mutations: {
    SET_AUTH_TYPE: (state, type) => {
      state.auth_type = type;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_SUPER: (state, usuper) => {
      state.super = usuper;
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    },
    SET_MENUS: (state, menus) => {
      Object.assign(state.menus, menus);
    },
  },

  actions: {
    // 用户登录
    LoginByUser({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim();
      const pwd = md5(userInfo.password);
      return new Promise((resolve, reject) => {
        LoginByUser(loginName, pwd).then(response => {
          const data = response.data;
          if(data.code == 1){
              Cookies.set('User-Super', JSON.stringify(data.data.super));
              Cookies.set('Admin-Token', loginName);
              Cookies.set('User-Name', loginName);
              commit('SET_SUPER',data.data.super);
              commit('SET_TOKEN', loginName);
              commit('SET_USERNAME', loginName);

              let res  = formatObj(data.data.res);
              let resString = JSON.stringify(res);
              sessionStorage.setItem('User-Menus', resString);
              commit('SET_MENUS', res);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        let roles = state.userName;
        commit('SET_ROLES', [roles]);
        resolve();
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_USERNAME', '');
          commit('SET_ROLES', []);
          Cookies.remove('User-Super','');
          Cookies.remove('Admin-Token');
          Cookies.remove('User-Name');
          sessionStorage.removeItem('User-Menus');
          commit('SET_MENUS', []);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_USERNAME', '');
        commit('SET_ROLES', []);
        Cookies.remove('User-Super','');
        Cookies.remove('Admin-Token');
        Cookies.remove('User-Name');
        sessionStorage.removeItem('User-Menus');
        commit('SET_MENUS', []);
        resolve();
      });
    }
  }
};

export default user;
