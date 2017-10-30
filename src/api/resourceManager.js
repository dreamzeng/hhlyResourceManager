import fetch from 'utils/fetch';

//我的待办
export const remainApi = {
   fetchList(query) {
    return fetch({
      url: '/sysResource/myApplyResource',
      method: 'get',
      params: query
    })
   }
};

//我的资源
export const myResApi = {
  fetchList(query){
    return fetch({
      url:'/resource/getMyResources',
      method:'get',
      params:query
    });
  },
  add(params) {
    return fetch({
      url: '/resource/create',
      method: 'POST',
      data: params
    });
  },
  itemInfo(id){
    return fetch({
      url: '/resource/detail',
      method: 'get',
      params:{'resourceId':id}
    });
  },
  update(params){
    return fetch({
      url: '/resource/modify',
      method: 'POST',
      data: params
    });
  },
  removeContacts(params){
    return fetch({
      url: '/resource/removeContacts',
      method: 'POST',
      data: params
    });
  }
}

//集团资源





//账号管理
export const accountNumberApi = {
  fetchList(query) {
    return fetch({
      url: '/user/listSysUserPage',
      method: 'get',
      params: query
    })
  },
  add(params) {
    return fetch({
      url: '/user/add',
      method: 'POST',
      data: params
    });
  },
  itemInfo(id){
    return fetch({
      url: '/user/info/'+id,
      method: 'get'
    });
  },
  update(params){
    return fetch({
      url: '/user/update',
      method: 'POST',
      data: params
    });
  },
  del(params){
    return fetch({
      url: '/user/updateUserState/'+params.uuid,
      method: 'POST',
      data: params
    });
  }
};

//角色管理
export const roleApi = {
  fetchList(query) {
    return fetch({
      url: '/role/listSysRole',
      method: 'get',
      params: query
    })
   },
   add(params) {
    return fetch({
      url: '/role/add',
      method: 'POST',
      data: params
    });
  },
  itemInfo(id){
    return fetch({
      url: '/role/info/'+id,
      method: 'get'
    });
  },
  update(params){
    return fetch({
      url: '/role/update',
      method: 'POST',
      data: params
    });
  },
  dispenseRole(params){
    return fetch({
      url: '/sysRoleResource/save',
      method: 'POST',
      data: params
    });
  }
};

//资源管理
export const sysResApi = {
  getAllResources(query={roleUuid:''}){
    return fetch({
      url: '/sysResource/getAllResources',
      method: 'get',
      params: query
    })
  },
  itemInfo(id){
    return fetch({
      url: '/sysResource/get/'+id,
      method: 'get'
    });
  },
  add(params){
    return fetch({
      url: '/sysResource/add',
      method: 'POST',
      data: params
    });
  },
  update(params){
    return fetch({
      url: '/sysResource/update',
      method: 'POST',
      data: params
    });
  },
  updateState(params){
    return fetch({
      url: '/sysResource/updateState/'+params.uuid+'/'+params.resourceState,
      method: 'get',
      data: params
    });
  }
}