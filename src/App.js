import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Home />} >
        </Route>
        <Route path='/favorites' element={<Favorites />} >
        </Route>
        <Route path='*' element={<Home />} >
        </Route>

      </Routes>

    </BrowserRouter>
  );
};

export default App;
