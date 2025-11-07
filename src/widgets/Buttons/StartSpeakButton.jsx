import React from 'react';

function StartSpeakButton({ onClick }) {
  return (
    <div className="start-btn-abs">
      <style>{`
        .start-btn-abs { position: absolute; top: 640px; left: 485px; width: 399.2643737792969px; height: 104px; opacity: 1; }
        .start-btn { width: 100%; height: 100%; border: none; cursor: pointer; border-radius: 15px; background: #E19EFB; display: flex; align-items: center; justify-content: center; }
        .start-btn__label { width: 318px; height: 34px; margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-weight: 900; font-size: 32px; line-height: 100%; letter-spacing: 0; text-align: center; color: #FFFFFF; white-space: nowrap; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1024px) {
          .start-btn-abs { position: static; width: calc(100% - 32px); max-width: 420px; height: 88px; margin: 24px auto 0 auto; }
          .start-btn__label { font-size: 28px; }
        }

        @media (max-width: 640px) {
          .start-btn-abs { max-width: 360px; height: 72px; }
          .start-btn__label { font-size: 24px; }
        }
      `}</style>
      <button type="button" className="start-btn" onClick={onClick}>
        <span className="start-btn__label">Начните говорить</span>
      </button>
    </div>
  );
}

export default StartSpeakButton;


