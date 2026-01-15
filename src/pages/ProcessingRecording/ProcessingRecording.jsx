import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

function ProcessingRecording() {
    const navigate = useNavigate();
    const [status, setStatus] = React.useState('pending'); // pending | success | error | timeout
    const [message, setMessage] = React.useState(null);

    React.useEffect(() => {
        const startedAt = Date.now();
        const timeoutMs = 90000; // Увеличиваем до 90 секунд (обработка аудио + синтез речи может занимать время)
        let timeoutTriggered = false;

        const interval = setInterval(() => {
            const current = sessionStorage.getItem('lingai_analysis_status') || 'pending';
            if (current === 'success') {
                setStatus('success');
                clearInterval(interval);
                navigate('/results', { replace: true });
                return;
            }
            if (current === 'error') {
                setStatus('error');
                setMessage(sessionStorage.getItem('lingai_analysis_error_message') || 'Ошибка анализа');
                clearInterval(interval);
                return;
            }
            // Показываем предупреждение о долгом ожидании, но продолжаем ждать
            if (!timeoutTriggered && Date.now() - startedAt > timeoutMs) {
                timeoutTriggered = true;
                setStatus('timeout');
                setMessage('Сервер долго отвечает. Обработка может занять некоторое время, пожалуйста, подождите...');
                // НЕ останавливаем интервал - продолжаем ждать ответа
            }
        }, 300);

        return () => clearInterval(interval);
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
                            <p style={subtextStyle}>
                                {status === 'pending' && 'Нейросеть анализирует вашу запись...'}
                                {status === 'error' && (message || 'Ошибка анализа')}
                                {status === 'timeout' && (message || 'Таймаут ожидания')}
                            </p>
                            {status === 'error' && (
                                <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button onClick={() => navigate(-1)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                                        Назад
                                    </button>
                                    <button onClick={() => window.location.reload()} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#E19EFB', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                        Обновить
                                    </button>
                                </div>
                            )}
                            {status === 'timeout' && (
                                <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button onClick={() => navigate(-1)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>
                                        Назад
                                    </button>
                                    <button onClick={() => {
                                        // При нажатии "Обновить" просто продолжаем ждать - не перезагружаем страницу
                                        setStatus('pending');
                                        setMessage(null);
                                    }} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: '#E19EFB', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                        Продолжить ожидание
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProcessingRecording;

