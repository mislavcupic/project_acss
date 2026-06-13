import { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const ACTION = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION.LOGIN:
    case ACTION.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case ACTION.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch({
          type: ACTION.RESTORE_SESSION,
          payload: { token, user: decoded }
        });
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (token, user) => {
    const decoded = jwtDecode(token);
    console.log("Sadržaj dekodiranog tokena:", decoded);
    const userData = { ...user, ...decoded };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    dispatch({
      type: ACTION.LOGIN,
      payload: { token, user: userData }
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ACTION.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {console.log("Stanje auth-a:", state.isAuthenticated)}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider');
  }
  return context;
};