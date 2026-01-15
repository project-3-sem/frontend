import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeTab from '../../widgets/HomeTab/HomeTab.jsx';
import StartSpeakButton from '../../widgets/buttons/StartSpeakButton.jsx';

function Home() {
  const navigate = useNavigate();

  const pageStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  };

  const handleStartClick = () => {
    navigate('/texts');
  };

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes heroFadeIn {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes homeCardFadeIn {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .home-canvas {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 16px 96px;
          box-sizing: border-box;
        }

        .home-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
        }

        .hero-abs {
          flex: 1 1 320px;
          opacity: 0;
          animation: heroFadeIn 0.9s ease-out 0.25s forwards;
        }

        .hero-text {
          margin: 0;
          font-weight: 600;
          font-size: 50px;
          line-height: 110%;
          letter-spacing: 0.02em;
          text-align: left;
          color: #000000;
        }

        .space-06 { letter-spacing: 0.06em; font-weight: 600; color: #000000; }
        .accent-800 { letter-spacing: 0.06em; font-weight: 800; color: #E19EFB; }
        .space-regular { letter-spacing: 0.06em; font-weight: 400; color: #000000; }

        .home-sections {
          margin-top: 64px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .home-card {
          border-radius: 20px;
          padding: 28px 28px 32px;
          box-sizing: border-box;
          display: flex;
          gap: 24px;
          align-items: center;
          min-height: 260px;
          opacity: 0;
          transform: translateY(24px);
        }

        .home-card--blue {
          background: #C4ECF3;
          animation: homeCardFadeIn 0.7s ease-out 0.25s forwards;
        }

        .home-card--blue .home-card__side {
          background: #B3DAE0;
        }

        .home-card--yellow {
          background: #FFFFDB;
          animation: homeCardFadeIn 0.7s ease-out 0.45s forwards;
        }

        .home-card--yellow .home-card__side {
          background: #F3F3D0;
        }

        .home-card--pink {
          background: #F9CAF9;
          animation: homeCardFadeIn 0.7s ease-out 0.65s forwards;
        }

        .home-card--pink .home-card__side {
          background: #E0B3E0;
        }

        .home-card__side {
          flex: 0 0 220px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .home-card__image-main {
          width: 100%;
          max-width: 220px;
          height: auto;
          object-fit: contain;
        }

        .home-card__content {
          flex: 1 1 0;
          position: relative;
        }

        .home-card__stars {
          width: 44px;
          height: 60px;
          object-fit: contain;
          position: absolute;
          top: 0;
          right: 0;
        }

        .home-card__title {
          margin: 0 0 12px 0;
          font-weight: 800;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: 0.01em;
          color: #000000;
        }

        .home-card__subtitle {
          margin: 0 0 16px 0;
          font-weight: 800;
          font-size: 24px;
          line-height: 1.1;
          letter-spacing: 0.02em;
          color: rgba(31, 88, 104, 0.8);
        }

        .home-card__subtitle--muted {
          color: rgba(0, 0, 0, 0.35);
        }

        .home-card__text {
          margin: 0;
          font-weight: 550;
          font-size: 18px;
          line-height: 150%;
          letter-spacing: 0.03em;
          color: #000000;
          text-align: left;
        }

        .home-cta {
          margin-top: 48px;
          display: flex;
          justify-content: center;
        }

        /* Tablets & small desktops */
        @media (max-width: 1024px) {
          .home-canvas {
            padding: 64px 16px 80px;
          }

          .hero-text {
            font-size: 40px;
          }

          .home-card {
            padding: 24px 22px 28px;
          }

          .home-card__side {
            flex-basis: 200px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .home-canvas {
            padding: 56px 16px 72px;
          }

          .home-hero {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-text {
            font-size: 32px;
            text-align: left;
          }

          .home-card {
            flex-direction: column;
          }

          .home-card__side {
            width: 100%;
            max-width: 260px;
            margin: 0 auto 12px auto;
          }

          .home-card__stars {
            position: static;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 480px) {
          .hero-text {
            font-size: 28px;
          }

          .home-card__title {
            font-size: 26px;
          }

          .home-card__subtitle {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="home-canvas">
        <section className="home-hero">
          <div className="hero-abs">
            <p className="hero-text">
              Добро пожаловать
              <br />
              в сервис произношения<span className="space-06">&nbsp;</span>
              <br />
              <span className="accent-800">английских слов!</span>
              <span className="space-regular">&nbsp;</span>
            </p>
          </div>
          <HomeTab />
        </section>

        <section className="home-sections">
          <article className="home-card home-card--blue">
            <div className="home-card__side">
              <img
                className="home-card__image-main"
                src="/Мозг by iconSvg.co 1.svg"
                alt="Мозг"
              />
            </div>
            <div className="home-card__content">
              <img
                className="home-card__stars"
                src="/звезды.svg"
                alt="Звезды"
              />
              <h2 className="home-card__title">Проверка произношения с ИИ-ассистентом</h2>
              <p className="home-card__text">
              Интеллектуальная система мгновенно обрабатывает вашу речь. Продвинутые алгоритмы анализируют каждый произнесенный звук, чтобы помочь вам значительно повысить качество произношения и звучания.
              </p>
            </div>
          </article>

          <article className="home-card home-card--yellow">
            <div className="home-card__side">
              <img
                className="home-card__image-main"
                src="/кубок.svg"
                alt="Кубок"
              />
            </div>
            <div className="home-card__content">
              <img
                className="home-card__stars"
                src="/звезды (1).svg"
                alt="Звезды"
              />
              <h2 className="home-card__title">Интерактивная панель с результатами</h2>
              <p className="home-card__text">
                Получайте детальную статистику после каждой тренировки. Система наглядно показывает прогресс, выявляет проблемные места и отслеживает динамику улучшений в режиме реального времени.
              </p>
            </div>
          </article>

          <article className="home-card home-card--pink">
            <div className="home-card__side">
              <img
                className="home-card__image-main"
                src="/ионка текста.svg"
                alt="Иконка текста"
              />
            </div>
            <div className="home-card__content">
              <img
                className="home-card__stars"
                src="/звезды (2).svg"
                alt="Звезды"
              />
              <h2 className="home-card__title">Читайте свой текст или выберите из предложенных</h2>
              <p className="home-card__text">
                Тренируйтесь на материалах любой сложности. Используйте готовые тексты для разных уровней или загружайте собственные — система адаптируется под ваши цели и темп обучения.
              </p>
            </div>
          </article>
        </section>

        <div className="home-cta">
          <StartSpeakButton onClick={handleStartClick} />
        </div>
      </div>
    </div>
  );
}

export default Home;


