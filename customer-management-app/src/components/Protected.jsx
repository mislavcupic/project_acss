import { useAuth } from '../context/AuthContext';

export const Protected = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : null;
};