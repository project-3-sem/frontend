import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

function ProcessingRecording() {
    const navigate = useNavigate();

    React.useEffect(() => {
        // Имитация обработки (3 секунды)
        const timer = setTimeout(() => {
            navigate('/results');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);
    const pageStyle = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const headerWrapperStyle = {
        position: 'relative',
        zIndex: 2,
        width: '100%'
    };

    const mainContentStyle = {
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    };

    const backgroundStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '90%',
        backgroundImage: 'url("/background/свобода.svg")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: 0
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px'
    };

    const loaderStyle = {
        width: '60px',
        height: '60px',
        border: '4px solid #E19EFB',
        borderTop: '4px solid #DB80FF',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const textStyle = {
        fontSize: '20px',
        fontWeight: 600,
        color: '#1F1F1F',
        textAlign: 'center',
        margin: 0
    };

    const subtextStyle = {
        fontSize: '16px',
        fontWeight: 400,
        color: 'rgba(31, 31, 31, 0.6)',
        textAlign: 'center',
        margin: '8px 0 0 0'
    };

    return (
        <>
            <style>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
            <div style={pageStyle}>
                <div style={headerWrapperStyle}>
                    <Header background="#FFFFFF" animated={false} />
                </div>
                <div style={mainContentStyle}>
                    <div style={backgroundStyle}></div>
                    <div style={contentStyle}>
                        <div style={loaderStyle}></div>
                        <div>
                            <p style={textStyle}>Подождите, запись в обработке</p>
                            <p style={subtextStyle}>Нейросеть анализирует вашу запись...</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProcessingRecording;

