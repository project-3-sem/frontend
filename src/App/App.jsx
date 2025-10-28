import React from 'react';
import Header from '../widgets/Header/Header.jsx';
import Home from '../pages/Home/Home.jsx';


function App() {
  const pageStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  };

  return (
      <div style={pageStyle}>
        <Header />
        <Home />
      </div>
  );
}

export default App;
