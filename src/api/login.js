import fetch from 'utils/fetch';

export function LoginByUser(loginName, password) {
  const data = {
    loginName,
    password
  };
  return fetch({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  });
}

