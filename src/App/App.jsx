import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../widgets/Header/Header.jsx';
import Home from '../pages/Home/Home.jsx';
import TextPage from '../pages/TextPage/TextPage.jsx';
import TextReading from '../pages/TextReading/TextReading.jsx';

function HomePage() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/texts" element={<TextPage />} />
      <Route path="/text/:sectionId/:textIndex" element={<TextReading />} />
    </Routes>
  );
}

export default App;
