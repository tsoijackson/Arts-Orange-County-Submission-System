import axios from 'axios';

const _api = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json',
  }
});
// Handle re-routing for when we are not authenticated.
_api.interceptors.response.use(
  res => res,
  err => {
    if (err.status === 401 /* Unauthenticated */) {
      console.log("reached error")
      // localStorage.removeItem('admin_id');
    }
    return Promise.reject(err);
  }
);

// const apiUrl = 'http://127.0.0.1:5000';
const apiUrl = 'http://167.99.109.168:5000';

function get(url, ...args) {
  console.log(...args)
  return _api.get(apiUrl + url, ...args);
}

function post(url, ...args) {
  return _api.post(apiUrl + url, ...args);
}

function put(url, ...args) {
  return _api.put(apiUrl + url, ...args);
}

function del(url, args) {
  console.log(args)
  return axios({method: 'delete', url: apiUrl + url, data: args, withCredentials:true, headers: {'Content-Type': 'application/json'}})
}

export default {
  get, post, put, del
};
