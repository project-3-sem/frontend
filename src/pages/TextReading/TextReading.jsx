import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

const sections = [
    {
        id: 'easy',
        title: 'Лёгкий',
        texts: [
            { title: 'Love', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'Eat', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'Animals', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'Scool', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' }
        ]
    },
    {
        id: 'medium',
        title: 'Средний',
        texts: [
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' }
        ]
    },
    {
        id: 'hard',
        title: 'Сложный',
        texts: [
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' }
        ]
    }
];

function TextReading() {
    const { sectionId, textIndex } = useParams();
    const navigate = useNavigate();

    const section = sections.find(s => s.id === sectionId);
    const textItem = section && section.texts[parseInt(textIndex)];

    if (!textItem) {
        return (
            <div>
                <Header background="#FFFFFF" animated={false} />
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p>Текст не найден</p>
                    <button onClick={() => navigate('/texts')}>Вернуться к выбору текстов</button>
                </div>
            </div>
        );
    }

    const isCompact = typeof window !== 'undefined' && window.innerWidth <= 900;

    const pageStyle = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#FFFFFF',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        width: '100%'
    };

    const backgroundWrapperStyle = isCompact
        ? {
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '35vh',
              zIndex: 0,
              backgroundImage: 'url("/background/облака.svg")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center bottom',
              opacity: 1,
              pointerEvents: 'none'
          }
        : {
              position: 'absolute',
              top: '504.9px',
              left: '-344.73px',
              width: '2790.82px',
              height: '729.76px',
              zIndex: 0,
              backgroundImage: 'url("/background/облака.svg")',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              opacity: 1,
              pointerEvents: 'none'
          };

    const tornadoStyle = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              bottom: '0px',
              left: '26.14px',
              width: '352.3px',
              height: '307.62px',
              zIndex: 0,
              backgroundImage: 'url("/background/tornado-1-svgrepo-com 1.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center bottom',
              transform: 'rotate(-0.66deg)',
              opacity: 1,
              pointerEvents: 'none'
          };

    const tornado2Style = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              top: '108.23px',
              left: '1308.92px',
              width: '340px',
              height: '385px',
              zIndex: 0,
              backgroundImage: 'url("/background/tornado-1-svgrepo-com 2.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              opacity: 1,
              pointerEvents: 'none'
          };

    const freedomStyle = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              bottom: '0px',
              right: '50px',
              width: '300px',
              height: '400px',
              zIndex: 0,
              backgroundImage: 'url("/background/свобода.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center bottom',
              opacity: 1,
              pointerEvents: 'none'
          };

    const sunStyle = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              top: '58.48px',
              left: '131.9px',
              width: '344.73px',
              height: '300.22px',
              zIndex: 0,
              backgroundImage: 'url("/background/солнце.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              opacity: 1,
              pointerEvents: 'none'
          };

    const vectorStyle = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              top: '318.68px',
              right: '0px',
              width: '131.83px',
              height: '219.94px',
              zIndex: 0,
              backgroundImage: 'url("/background/Vector.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              opacity: 1,
              pointerEvents: 'none'
          };

    const vector2Style = isCompact
        ? { display: 'none' }
        : {
              position: 'absolute',
              top: '337.55px',
              left: '173px',
              width: '180px',
              height: '300px',
              zIndex: 0,
              backgroundImage: 'url("/background/Vector.svg")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              transform: 'rotate(58.58deg) scaleX(-1) scaleY(-1)',
              opacity: 1,
              pointerEvents: 'none'
          };

    const contentStyle = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '48px 24px 80px',
        display: isCompact ? 'none' : 'flex',
        justifyContent: 'center'
    };

    const compactContentStyle = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '100%',
        margin: '0 auto',
        padding: '48px 24px 200px',
        display: isCompact ? 'flex' : 'none',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const textCardStyle = isCompact
        ? {
              width: '100%',
              maxWidth: '340px',
              background: '#FDFDFE',
              borderRadius: '18px',
              boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)',
              border: '2px solid #E19EFB',
              padding: '24px 20px 28px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
          }
        : {
              width: '640px',
              maxWidth: '100%',
              background: '#FDFDFE',
              borderRadius: '18px',
              boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)',
              border: '2px solid #E19EFB',
              padding: '28px 36px 32px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
          };

    const textHeaderStyle = isCompact
        ? {
              fontWeight: 700,
              fontSize: '16px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#7A4AA5',
              textAlign: 'center'
          }
        : {
              fontWeight: 700,
              fontSize: '20px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#7A4AA5',
              textAlign: 'center'
          };

    const textBodyStyle = isCompact
        ? {
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.5,
              color: '#222222',
              maxHeight: '300px',
              overflowY: 'auto'
          }
        : {
              margin: 0,
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#222222',
              maxHeight: '380px',
              overflowY: 'auto'
          };

    return (
        <div style={pageStyle}>
            <Header background="#FFFFFF" animated={false} />
            <div style={backgroundWrapperStyle}></div>
            <div style={tornadoStyle}></div>
            <div style={tornado2Style}></div>
            <div style={sunStyle}></div>
            <div style={freedomStyle}></div>
            <div style={vectorStyle}></div>
            <div style={vector2Style}></div>
            <div style={contentStyle}>
                <div style={textCardStyle}>
                    <div style={textHeaderStyle}>Текст для чтения</div>
                    <p style={textBodyStyle}>{textItem.body}</p>
                </div>
            </div>
            <div style={compactContentStyle}>
                <div style={textCardStyle}>
                    <div style={textHeaderStyle}>Текст для чтения</div>
                    <p style={textBodyStyle}>{textItem.body}</p>
                </div>
            </div>
        </div>
    );
}

export default TextReading;

