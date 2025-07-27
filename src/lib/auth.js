// Client-side auth utilities only
export const getStoredUser = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }
  
  return null;
};

export const storeUser = (user, token) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};