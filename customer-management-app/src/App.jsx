import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import CustomerList from './components/CustomerList';
import Login from './components/Login';
import './styles.css';
import { ThemeContext } from './context/ThemeContext';
import { useState, useEffect } from 'react'; // Dodan useEffect

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

useEffect(() => {
  document.documentElement.setAttribute('data-bs-theme', theme);
}, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <BrowserRouter>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<CustomerList />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;