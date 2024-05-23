// App.js
import React from 'react';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import { AuthProvider } from './component/AuthContext';

import Header from './component/Header';
import Page1 from './component/Page1';
import Page2 from './component/Page2';
import SnakeGame from './component/SnakeGame';
import FileUpload from './component/FileUpload';
import Admin from './component/Admin';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route index path="/" element={<Page1 />} />
          <Route path="/signin" element={<Page2 />} />
          <Route path="/snakegame" element={<SnakeGame />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={<Page1 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};


export default App;
