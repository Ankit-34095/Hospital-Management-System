import api from './api';

export function login(username, password, role){
  return api.post('/auth/login', { username, password, role });
}

export function register(data){
  return api.post('/auth/register', data);
}

export function registerDoctor(data){
  return api.post('/auth/register-doctor', data);
}
