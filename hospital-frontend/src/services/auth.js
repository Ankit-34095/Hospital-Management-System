import api from './api';

export function login(username, password, role){
  return api.post('/api/auth/login', { username, password, role });
}

export function register(data){
  return api.post('/api/auth/register', data);
}

export function registerDoctor(data){
  return api.post('/api/auth/register-doctor', data);
}
