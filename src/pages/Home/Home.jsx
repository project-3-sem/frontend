import React from 'react';
import HomeTab from '../../widgets/HomeTab/HomeTab.jsx';
import StartSpeakButton from '../../widgets/buttons/StartSpeakButton.jsx';



function Home() {
  const pageStyle = {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  };

  return (
    <div style={pageStyle}>
      <style>{`
        .home-canvas { position: relative; height: 3242px; }
        .hero-abs { position: absolute; top: 318px; left: 409px; width: 551px; height: 277px; opacity: 1; }
        .hero-text { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 50px; line-height: 100%; letter-spacing: 0.02em; text-align: center; color: #000000; }
        .space-06 { letter-spacing: 0.06em; font-weight: 600; color: #000000; }
        .accent-800 { letter-spacing: 0.06em; font-weight: 800; color: #E19EFB; }
        .space-regular { letter-spacing: 0.06em; font-weight: 400; color: #000000; }
        .hp-rect { position: absolute; top: 1081px; left: 210px; width: 1513px; height: 661px; background: #C4ECF3; opacity: 1; transform: rotate(0deg); border-radius: 20px; overflow: hidden; }
        .hp-rect__left { position: absolute; top: 0; left: 0; width: 587px; height: 661px; background: #B3DAE0; opacity: 1; border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
        .hp-rect__brain { position: absolute; top: 151.73px; left: 114.75px; width: 357.42822265625px; height: 357.5469055175781px; transform: none; opacity: 1; object-fit: contain; }
        .hp-rect__stars { position: absolute; top: 92px; left: 602px; width: 44px; height: 60px; transform: none; opacity: 1; object-fit: contain; border: 3px solid transparent; }
        .hp-rect__title { position: absolute; top: 81px; left: 673px; width: 840px; height: 122.70059967041016px; opacity: 1; }
        .hp-rect__title .title { margin: 0; font-weight: 800; font-size: 44px; line-height: 1.08; letter-spacing: 0.01em; color: #000000; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; }
        .hp-rect__title .title::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 72px; height: 4px; border-radius: 2px; background: rgba(0, 0, 0, 0.2); }
        .hp-rect__title .subtitle { margin: 12px 0 0 0; font-weight: 800; font-size: 34px; line-height: 1.1; letter-spacing: 0.02em; color: rgba(31, 88, 104, 0.8); }
        .hp-rect__desc { position: absolute; top: 224px; left: 673.36px; width: 701.8229370117188px; height: 382.6147766113281px; opacity: 1; padding-left: 24px; }
        .hp-rect__desc p { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 550; font-style: normal; font-size: 32px; line-height: 100%; letter-spacing: 0.06em; color: #000000; text-align: left; text-indent: 32px; }
        .hp-rect2 { position: absolute; top: 1811px; left: 210px; width: 1513px; height: 661px; background: #FFFFDB; opacity: 1; transform: rotate(0deg); overflow: hidden; border-radius: 20px; }
        .hp-rect2__right { position: absolute; top: 0; left: 926px; width: 586.9965209960938px; height: 661px; background: #F3F3D0; opacity: 1; transform: rotate(180deg); border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
        .hp-rect2__cup { position: absolute; top: 180.75px; left: 1069.78px; width: 299.4341735839844px; height: 299.4949951171875px; transform: none; opacity: 1; object-fit: contain; border: 12px solid transparent; }
        .hp-rect2__stars { position: absolute; top: 94px; left: 45px; width: 44px; height: 60px; transform: none; opacity: 1; object-fit: contain; border: 3px solid transparent; }
        .hp-rect2__title { position: absolute; top: 85px; left: 110px; width: 817px; height: 122.70059967041016px; opacity: 1; }
        .hp-rect2__title .title { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 44px; line-height: 1.08; letter-spacing: 0.01em; color: #000000; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; }
        .hp-rect2__title .title::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 72px; height: 4px; border-radius: 2px; background: rgba(0, 0, 0, 0.2); }
        .hp-rect2__title .subtitle { margin: 12px 0 0 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 34px; line-height: 1.1; letter-spacing: 0.02em; color: rgba(0, 0, 0, 0.35); }
        .hp-rect2__desc { position: absolute; top: 226px; left: 110px; width: 701.8229370117188px; height: 382.6147766113281px; opacity: 1; padding-left: 24px; }
        .hp-rect2__desc p { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 550; font-style: normal; font-size: 32px; line-height: 100%; letter-spacing: 0.06em; color: #000000; text-align: left; text-indent: 32px; }
        .hp-rect3 { position: absolute; top: 2541px; left: 210px; width: 1513px; height: 661px; background: #F9CAF9; opacity: 1; transform: rotate(0deg); overflow: hidden; border-radius: 20px; }
        .hp-rect3__left { position: absolute; top: 0; left: 0; width: 587px; height: 661px; background: #E0B3E0; opacity: 1; border-top-left-radius: 20px; border-bottom-left-radius: 20px; }
        .hp-rect3__icon { position: absolute; top: 169.32px; left: 132.53px; width: 294.95147705078125px; height: 321.0445556640625px; transform: none; opacity: 1; object-fit: contain; border: 17px solid transparent; }
        .hp-rect3__stars { position: absolute; top: 89px; left: 602px; width: 44px; height: 60px; transform: none; opacity: 1; object-fit: contain; border: 3px solid transparent; }
        .hp-rect3__title { position: absolute; top: 80.48px; left: 668.15px; width: 830px; height: 122.70059967041016px; opacity: 1; }
        .hp-rect3__title .title { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 44px; line-height: 1.08; letter-spacing: 0.01em; color: #000000; text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5); position: relative; }
        .hp-rect3__title .title::after { content: ''; position: absolute; left: 0; bottom: -10px; width: 72px; height: 4px; border-radius: 2px; background: rgba(0, 0, 0, 0.2); }
        .hp-rect3__title .subtitle { margin: 12px 0 0 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 34px; line-height: 1.1; letter-spacing: 0.02em; color: rgba(0,0,0,0.35); }
        .hp-rect3__desc { position: absolute; top: 224.29px; left: 673.36px; width: 701.8229370117188px; height: 382.6147766113281px; opacity: 1; padding-left: 24px; }
        .hp-rect3__desc p { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 550; font-style: normal; font-size: 32px; line-height: 100%; letter-spacing: 0.06em; color: #000000; text-align: left; text-indent: 32px; }
        /* removed hp sections */

        /* Tablet & below: switch to stacked fluid layout */
        @media (max-width: 1024px) {
          .home-canvas { height: auto; padding-bottom: 48px; }
          .hero-abs { position: static; width: calc(100% - 32px); max-width: 640px; height: auto; margin: 96px auto 0 auto; }
          .hero-text { font-size: 40px; }

          /* keep only text for the 3 cards */
          .hp-rect, .hp-rect2, .hp-rect3 { position: static; width: calc(100% - 32px); height: auto; margin: 32px auto 0 auto; border-radius: 16px; box-shadow: none; }
          .hp-rect__left, .hp-rect__brain, .hp-rect__stars,
          .hp-rect2__right, .hp-rect2__cup, .hp-rect2__stars,
          .hp-rect3__left, .hp-rect3__icon, .hp-rect3__stars { display: none; }
          .hp-rect__title, .hp-rect2__title, .hp-rect3__title,
          .hp-rect__desc, .hp-rect2__desc, .hp-rect3__desc { position: static; width: auto; height: auto; margin: 0 16px; }
          .hp-rect__title .title, .hp-rect2__title .title, .hp-rect3__title .title { font-size: 32px; }
          .hp-rect__title .subtitle, .hp-rect2__title .subtitle, .hp-rect3__title .subtitle { font-size: 28px; }
          .hp-rect__desc p, .hp-rect2__desc p, .hp-rect3__desc p { font-size: 20px; line-height: 140%; text-indent: 20px; }
        }

        /* Mobile: smaller type and heights */
        @media (max-width: 640px) {
          .hero-abs { margin-top: 72px; }
          .hero-text { font-size: 32px; }
          .hp-rect, .hp-rect2, .hp-rect3 { width: calc(100% - 24px); margin-top: 24px; }
          .hp-rect__title .title, .hp-rect2__title .title, .hp-rect3__title .title { font-size: 26px; }
          .hp-rect__title .subtitle, .hp-rect2__title .subtitle, .hp-rect3__title .subtitle { font-size: 22px; }
          .hp-rect__desc p, .hp-rect2__desc p, .hp-rect3__desc p { font-size: 18px; line-height: 150%; text-indent: 18px; }
        }
      `}</style>

      <div className="home-canvas">
        <div className="hero-abs">
          <p className="hero-text">
            Добро пожаловать
            <br />
            в сервис произношения<span className="space-06">&nbsp;</span>
            <br />
            <span className="accent-800">английских слов!</span><span className="space-regular">&nbsp;</span>
          </p>
        </div>
        <HomeTab />
        <div className="hp-rect">
          <div className="hp-rect__left"></div>
          <img className="hp-rect__brain" src="/Мозг by iconSvg.co 1.svg" alt="Мозг" />
          <img className="hp-rect__stars" src="/звезды.svg" alt="Звезды" />
          <div className="hp-rect__title">
            <p className="title">Проверка произношения</p>
            <p className="subtitle">ИИ-ассистентом</p>
          </div>
          <div className="hp-rect__desc">
            <p>
              Но я должен объяснить вам, как родилась вся эта ошибочная идея обличения удовольствия и восхваления боли, и я дам вам полное описание этой системы и изложу подлинное учение великого исследователя истины, мастера-строителя человеческого счастья.
            </p>
          </div>
        </div>
        <div className="hp-rect2">
          <div className="hp-rect2__right"></div>
          <img className="hp-rect2__cup" src="/кубок.svg" alt="Кубок" />
          <img className="hp-rect2__stars" src="/звезды (1).svg" alt="Звезды" />
          <div className="hp-rect2__title">
            <p className="title">Интерактивная панель с</p>
            <p className="subtitle">результатами</p>
          </div>
          <div className="hp-rect2__desc">
            <p>
              Но я должен объяснить вам, как родилась вся эта ошибочная идея обличения удовольствия и восхваления боли, и я дам вам полное описание этой системы и изложу подлинное учение великого исследователя истины, мастера-строителя человеческого счастья.
            </p>
          </div>
        </div>
        <div className="hp-rect3">
          <div className="hp-rect3__left"></div>
          <img className="hp-rect3__icon" src="/ионка текста.svg" alt="Иконка текста" />
          <img className="hp-rect3__stars" src="/звезды (2).svg" alt="Звезды" />
          <div className="hp-rect3__title">
            <p className="title">Читайте свой текст</p>
            <p className="subtitle">или выберите из предложенных</p>
          </div>
          <div className="hp-rect3__desc">
            <p>
              Но я должен объяснить вам, как родилась вся эта ошибочная идея обличения удовольствия и восхваления боли, и я дам вам полное описание этой системы и изложу подлинное учение великого исследователя истины, мастера-строителя человеческого счастья.
            </p>
          </div>
        </div>
        <StartSpeakButton />
      </div>
    </div>
  );
}

export default Home;


