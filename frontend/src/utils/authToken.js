
const TOKEN_KEY = 'authToken';
const ADMIN_TOKEN_KEY = 'adminAuthToken';
export const setAuthToken = (token) => {
  return localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setAdminToken=(token)=>{
   localStorage.setItem(ADMIN_TOKEN_KEY,token)
}

export const getAdminToken= ()=>{
  localStorage.getItem(ADMIN_TOKEN_KEY)
}
export const clearAdminToken=()=>{
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}
