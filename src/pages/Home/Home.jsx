import React from 'react';

function Home() {
  const pageStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .hero { width: 501px; height: 277px; margin-top: 201px; margin-left: 186px; opacity: 1; }
        .hero-text { margin: 0; font-weight: 600; font-size: 48px; line-height: 100%; letter-spacing: 0.02em; text-align: center; color: #000000; }
        .hero-text .accent { color: #E19EFB; }

        @media (max-width: 1024px) {
          .hero { width: 560px; height: auto; margin: 140px auto 0 auto; }
        }

        @media (max-width: 640px) {
          .hero { width: calc(100% - 32px); max-width: 520px; margin: 96px auto 0 auto; }
          .hero-text { font-size: 32px; }
        }
      `}</style>
      <div className="hero">
        <p className="hero-text">
          Добро пожаловать
          <br />
          в сервис произношения <span className="accent">английских слов!</span>
        </p>
      </div>
    </div>
  );
}

export default Home;


