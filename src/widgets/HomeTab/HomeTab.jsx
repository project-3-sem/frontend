import React from 'react';

function HomeTab() {
  return (
    <div className="home-tab-wrap">
      <style>{`
        @keyframes homeTabFadeIn {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .home-tab-wrap {
          flex: 0 0 320px;
          max-width: 360px;
          border-radius: 30px;
          overflow: hidden;
          opacity: 0;
          animation: homeTabFadeIn 1s ease-out 0.35s forwards;
        }

        .home-tab__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 768px) {
          .home-tab-wrap {
            width: 100%;
            max-width: 320px;
          }
        }

        @media (max-width: 480px) {
          .home-tab-wrap {
            max-width: 280px;
            border-radius: 24px;
          }
        }
      `}</style>
      <img className="home-tab__image" src="/hometab.png" alt="Home tab" />
    </div>
  );
}

export default HomeTab;


