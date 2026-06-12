// import { createContext, useContext, useReducer, useEffect } from 'react';

// const AuthContext = createContext();

// const ACTION = {
//   LOGIN: 'LOGIN',
//   LOGOUT: 'LOGOUT',
//   RESTORE_SESSION: 'RESTORE_SESSION'
// }
// // Reducer za upravljanje auth stanjem
// // treba mi const[state,dispatch] = useReducer(authReducer,dispatch)

// const authReducer = (state, action) => {
//   switch (action.type){
//     case ACTION.LOGIN:
//       localStorage.setItem('token', action.payload.token);
//       localStorage.setItem('user', JSON.stringify(action.payload.user));
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//         token: action.payload.token
//       };
//     case ACTION.LOGOUT:
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         token: null
//       };
//     case ACTION.RESTORE_SESSION:
//       return {
//         ...state,
//         isAuthenticated: !!action.payload.token,
//         user: action.payload.user,
//         token: action.payload.token
//       };
//     default:
//       return state;
//   }
// };

// const initialState = {
//   isAuthenticated: false,
//   user: null,
//   token: null
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Učitaj session iz localStorage pri mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const user = localStorage.getItem('user');
    
//     if (token && user) {
//       dispatch({
//         type: ACTION.RESTORE_SESSION,
//         payload: {
//           token,
//           user: JSON.parse(user)
//         }
//       });
//     }
//   }, []);

//   const login = (token, user) => {
//     dispatch({
//       type: ACTION.LOGIN,
//       payload: { token, user }
//     });
//   };

//   const logout = () => {
//     dispatch({ type: ACTION.LOGOUT });
//   };

//   return (
//     <AuthContext.Provider value={{ ...state, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth mora biti korišten unutar AuthProvider');
//   }
//   return context;
// };

import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const ACTION = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION'
}
// Reducer za upravljanje auth stanjem
// treba mi const[state,dispatch] = useReducer(authReducer,dispatch)

const authReducer = (state, action) => {
  switch (action.type){
    case ACTION.LOGIN:
    
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
    case ACTION.RESTORE_SESSION:
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        user: action.payload.user,
        token: action.payload.token
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

  // Učitaj session iz localStorage pri mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch({
        type: ACTION.RESTORE_SESSION,
        payload: {
          token,
          user: JSON.parse(user)
        }
      });
    }
  }, []);

  const login = (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    dispatch({
      type: ACTION.LOGIN,
      payload: { token, user }
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
      localStorage.removeItem('user');
    dispatch({ type: ACTION.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
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
