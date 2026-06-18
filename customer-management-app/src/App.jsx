import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import CustomerList from './components/CustomerList';
import Login from './components/Login';
import { ThemeProvider } from './context/ThemeContext';
import { useState, useEffect } from 'react'; 
import Register from './components/Register';
import ProfilePage from './components/ProfilePage'

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<CustomerList />} />
              <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />   
              <Route path="/profile"  element={<ProfilePage />} /> 
              
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;