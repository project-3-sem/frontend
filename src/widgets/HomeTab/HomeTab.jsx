import React from 'react';

function HomeTab() {
  return (
    <div className="home-tab-wrap">
      <style>{`
        .home-tab-wrap { position: absolute; top: 298px; left: 1114px; width: 354.99993896484375px; height: 517.0652465820312px; opacity: 1; overflow: hidden; border-radius: 30px; }
        .home-tab__image { width: 100%; height: 100%; object-fit: cover; display: block; }

        @media (max-width: 1024px) {
          .home-tab-wrap { position: static; width: 280px; height: 410px; margin: 32px auto 0 auto; border-radius: 24px; }
        }

        @media (max-width: 640px) {
          .home-tab-wrap { width: 260px; height: 380px; margin-top: 24px; border-radius: 20px; }
        }
      `}</style>
      <img className="home-tab__image" src="/hometab.png" alt="Home tab" />
    </div>
  );
}

export default HomeTab;


