import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

function RecordingResults() {
    const navigate = useNavigate();

    // Пример текста с ошибками (слово: тип ошибки)
    const textWithErrors = {
        text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenae',
        errors: {
            'consectetur': 'pronunciation',
            'pellentesque': 'pronunciation',
            'cursus': 'pronunciation',
            'pretium': 'pronunciation',
            'convallis': 'pronunciation',
            'fringilla': 'pronunciation',
            'bibendum': 'grammar',
            'malesuada': 'grammar',
            'hendrerit': 'grammar',
            'aptent': 'accent'
        }
    };

    const [hoveredWord, setHoveredWord] = React.useState(null);
    const [isCompact, setIsCompact] = React.useState(window.innerWidth <= 900);

    React.useEffect(() => {
        const handleResize = () => {
            setIsCompact(window.innerWidth <= 900);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const pageStyle = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#FFFFFF',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
    };

    const titleStyle = {
        fontSize: '32px',
        fontWeight: 800,
        color: '#1F1F1F',
        margin: '0 0 24px 0',
        textAlign: 'center'
    };

    const resultsCardStyle = {
        width: '640px',
        maxWidth: '100%',
        height: '700px',
        background: '#FDFDFE',
        borderRadius: '18px',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)',
        border: '2px solid #E19EFB',
        padding: isCompact ? '24px 20px' : '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '24px'
    };

    const textContentStyle = {
        fontSize: isCompact ? '16px' : '18px',
        lineHeight: 1.8,
        color: '#222222',
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        maxHeight: '600px',
        overflowY: 'auto'
    };

    const errorWordStyle = (errorType) => {
        let textDecoration = 'underline wavy #E74C3C';

        if (errorType === 'pronunciation') {
            textDecoration = 'underline wavy #E74C3C';
        } else if (errorType === 'grammar') {
            textDecoration = 'underline wavy #3498DB';
        } else if (errorType === 'accent') {
            textDecoration = 'underline wavy #F39C12';
        }

        return {
            textDecoration,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block'
        };
    };

    const tooltipStyle = (errorType) => {
        let backgroundColor = '#E74C3C';
        let textColor = '#FFFFFF';

        if (errorType === 'pronunciation') {
            backgroundColor = '#E74C3C';
        } else if (errorType === 'grammar') {
            backgroundColor = '#3498DB';
        } else if (errorType === 'accent') {
            backgroundColor = '#F39C12';
        }

        return {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor,
            color: textColor,
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            zIndex: 10,
            marginBottom: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none'
        };
    };

    const tooltipArrowStyle = (errorType) => {
        let backgroundColor = '#E74C3C';

        if (errorType === 'pronunciation') {
            backgroundColor = '#E74C3C';
        } else if (errorType === 'grammar') {
            backgroundColor = '#3498DB';
        } else if (errorType === 'accent') {
            backgroundColor = '#F39C12';
        }

        return {
            position: 'absolute',
            bottom: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: `4px solid ${backgroundColor}`,
            zIndex: 10
        };
    };

    const getErrorDescription = (errorType) => {
        const descriptions = {
            'pronunciation': 'Ошибка в произношении. Слово произнесено неправильно.',
            'grammar': 'Грамматическая ошибка. Проверьте форму слова или структуру предложения.',
            'accent': 'Акцент. Слово произнесено с неправильным ударением.'
        };
        return descriptions[errorType] || 'Ошибка в речи';
    };

    const getErrorLabel = (errorType) => {
        if (errorType === 'pronunciation') return '🔊 Произношение';
        if (errorType === 'grammar') return '📝 Грамматика';
        if (errorType === 'accent') return '🎯 Ударение';
        return 'Ошибка';
    };

    const renderTextWithErrors = () => {
        const words = textWithErrors.text.split(' ');
        return words.map((word, index) => {
            // Убираем пунктуацию для проверки
            const cleanWord = word.replace(/[.,!?;:'"]/g, '');
            const isError = textWithErrors.errors[cleanWord] || textWithErrors.errors[word];

            if (isError) {
                const isHovered = hoveredWord === `${cleanWord}-${index}`;
                return (
                    <span
                        key={index}
                        style={errorWordStyle(isError)}
                        onMouseEnter={() => setHoveredWord(`${cleanWord}-${index}`)}
                        onMouseLeave={() => setHoveredWord(null)}
                    >
                        {isHovered && (
                            <span style={tooltipStyle(isError)}>
                                {getErrorLabel(isError)}
                                <span style={tooltipArrowStyle(isError)}></span>
                            </span>
                        )}
                        {word}{' '}
                    </span>
                );
            }
            return <span key={index}>{word} </span>;
        });
    };

    const controlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '24px',
        flexWrap: 'wrap'
    };

    const buttonStyle = {
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 600,
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'opacity 0.2s ease'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        background: '#E19EFB',
        color: '#FFFFFF',
        minWidth: '180px'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        background: '#EEE',
        color: '#666',
        minWidth: '120px'
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

    return (
        <div style={pageStyle}>
            <style>{`
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #D0D0D0;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #A0A0A0;
                }
            `}</style>
            <Header background="#FFFFFF" animated={false} />
            <div style={backgroundWrapperStyle}></div>
            <div style={tornadoStyle}></div>
            <div style={tornado2Style}></div>
            <div style={sunStyle}></div>
            <div style={freedomStyle}></div>
            <div style={vectorStyle}></div>
            <div style={vector2Style}></div>
            <div style={contentStyle}>
                <h1 style={titleStyle}>Результаты анализа</h1>

                <div style={resultsCardStyle}>
                    <div style={textContentStyle}>
                        {renderTextWithErrors()}
                    </div>

                    <div style={controlsStyle}>
                        <button
                            style={primaryButtonStyle}
                            onClick={() => navigate(-1)}
                        >
                            ▶ Перечитать ошибки
                        </button>
                        <button
                            style={secondaryButtonStyle}
                            onClick={() => navigate('/texts')}
                        >
                            ✕ Выход
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordingResults;

