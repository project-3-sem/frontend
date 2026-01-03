import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TEXTS_ENDPOINT = `${API_BASE_URL}/texts/`;

const loremText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nIaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenae';

const sections = [
    {
        id: 'easy',
        title: 'Лёгкий',
        texts: [
            { title: 'Love', body: loremText },
            { title: 'Eat', body: loremText },
            { title: 'Animals', body: loremText },
            { title: 'Scool', body: loremText }
        ]
    },
    {
        id: 'medium',
        title: 'Средний',
        texts: [
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText }
        ]
    },
    {
        id: 'hard',
        title: 'Сложный',
        texts: [
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText },
            { title: 'De Finibus', body: loremText }
        ]
    }
];

function TextReading() {
    const { sectionId, textIndex } = useParams();
    const navigate = useNavigate();

    const [sectionsData, setSectionsData] = React.useState(null);
    const [isLoadingTexts, setIsLoadingTexts] = React.useState(true);
    const [loadError, setLoadError] = React.useState(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const [recordingTime, setRecordingTime] = React.useState(0);
    const [mediaRecorder, setMediaRecorder] = React.useState(null);
    const [hasRecording, setHasRecording] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [recordingBlob, setRecordingBlob] = React.useState(null);
    const mediaStreamRef = React.useRef(null);
    const audioRef = React.useRef(null);
    const chunksRef = React.useRef([]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [sectionId, textIndex]);

    React.useEffect(() => {
        // Загружаем данные с бэкенда
        // Загружаем кэш для мгновенного отображения (опционально)
        const cached = sessionStorage.getItem('lingai_sections');
        let cachedData = null;
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) {
                    cachedData = parsed;
                    setSectionsData(parsed);
                }
            } catch (e) {
                console.error('Failed to parse cached sections on reading page', e);
            }
        }

        // Всегда запрашиваем свежие данные с бэкенда
        const fetchSections = async () => {
            try {
                setIsLoadingTexts(true);
                setLoadError(null);

                console.log('Fetching texts from:', TEXTS_ENDPOINT);
                const response = await fetch(TEXTS_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Unknown error');
                    console.error('API Error:', response.status, errorText);
                    throw new Error(`Failed to load texts: ${response.status} ${response.statusText}`);
                }

                const texts = await response.json();
                console.log('Received texts from backend:', texts);
                
                // Преобразуем массив текстов в формат секций по сложности
                const difficultyMap = {
                    'easy': { id: 'easy', title: 'Лёгкий', texts: [] },
                    'medium': { id: 'medium', title: 'Средний', texts: [] },
                    'hard': { id: 'hard', title: 'Сложный', texts: [] }
                };

                if (Array.isArray(texts) && texts.length > 0) {
                    texts.forEach(text => {
                        if (difficultyMap[text.difficulty]) {
                            difficultyMap[text.difficulty].texts.push({
                                id: text.id,
                                title: text.title,
                                body: text.body
                            });
                        }
                    });
                }

                const remoteSections = Object.values(difficultyMap).filter(section => section.texts.length > 0);
                console.log('Processed sections:', remoteSections);
                console.log('Sections count:', remoteSections.length);

                if (remoteSections.length) {
                    setSectionsData(remoteSections);
                    sessionStorage.setItem('lingai_sections', JSON.stringify(remoteSections));
                } else {
                    console.warn('Empty response from backend');
                    // если бэк вернул пустой массив — используем кэш или локальные заглушки
                    if (cachedData) {
                        console.log('Using cached data');
                        setSectionsData(cachedData);
                    } else {
                        console.log('Using fallback sections');
                        setSectionsData(sections);
                        setLoadError('Пустой ответ от сервера, показаны примеры.');
                    }
                }
            } catch (e) {
                console.error('Error loading sections on reading page', e);
                // При ошибке используем кэш, если он есть, иначе fallback
                if (cachedData) {
                    console.log('Error occurred, using cached data');
                    setSectionsData(cachedData);
                } else {
                    console.log('Error occurred, using fallback sections');
                    setSectionsData(sections);
                    setLoadError('Не удалось загрузить текст с сервера, показан пример.');
                }
            } finally {
                setIsLoadingTexts(false);
            }
        };

        fetchSections();
    }, [sectionId, textIndex]);

    const section = sectionsData?.find((s) => String(s.id) === String(sectionId));
    const textItem = section?.texts?.[parseInt(textIndex, 10)];

    // Отладочная информация (логируем только при наличии данных)
    if (sectionsData) {
        console.log('Sections data:', sectionsData);
        console.log('Looking for sectionId:', sectionId);
        console.log('Found section:', section);
        console.log('Looking for textIndex:', textIndex);
        console.log('Found textItem:', textItem);
    }

    // ВСЕ ХУКИ ДОЛЖНЫ БЫТЬ ДО РАННИХ RETURN'ОВ
    React.useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    if (isLoadingTexts) {
        return (
            <div>
                <Header background="#FFFFFF" animated={false} />
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p>Загружаем текст...</p>
                </div>
            </div>
        );
    }

    if (!textItem) {
        return (
            <div>
                <Header background="#FFFFFF" animated={false} />
                <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ marginBottom: '16px', fontSize: '16px', color: '#666' }}>
                        {loadError || 'Текст не найден'}
                    </p>
                    {sectionsData && (
                        <div style={{ marginBottom: '16px', fontSize: '14px', color: '#999' }}>
                            <p>Доступные секции: {sectionsData.map(s => s.id).join(', ')}</p>
                            {section && (
                                <p>Текстов в секции "{section.title}": {section.texts?.length || 0}</p>
                            )}
                            {!section && (
                                <p>Секция с id "{sectionId}" не найдена</p>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={() => navigate('/texts')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            backgroundColor: '#E19EFB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Вернуться к выбору текстов
                    </button>
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

    const textCardStyle = {
        width: '640px',
        maxWidth: '100%',
        height: isCompact ? 'auto' : '700px',
        background: '#FDFDFE',
        borderRadius: '18px',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)',
        border: '2px solid #E19EFB',
        padding: isCompact ? '24px 20px' : '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    };

    const textHeaderStyle = {
        fontWeight: 700,
        fontSize: '20px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#7A4AA5',
        textAlign: 'center'
    };

    const textBodyStyle = {
        margin: 0,
        fontSize: '16px',
        lineHeight: 1.6,
        color: '#222222',
        maxHeight: isCompact ? 'none' : '600px',
        overflowY: isCompact ? 'visible' : 'auto'
    };

    const controlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        width: '100%'
    };

    const recordingControlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isCompact ? '8px' : '12px',
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        width: '100%',
        flexWrap: isCompact ? 'wrap' : 'nowrap'
    };

    const reviewButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: isCompact ? '7px 14px' : '8px 18px',
        borderRadius: 16,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        fontSize: isCompact ? '13px' : '14px',
        fontWeight: 600,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        background: '#F9F5FF',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.7) inset',
        transition: 'background-color 0.15s ease, opacity 0.15s ease'
    };

    const recordBarStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        background: '#F4F0F8',
        borderRadius: '14px',
        padding: isCompact ? '4px 6px' : '5px 8px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.6) inset',
        gap: 0
    };

    const recordButtonStyle = {
        border: 'none',
        background: '#E0DADF',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isCompact ? '38px' : '40px',
        height: isCompact ? '32px' : '34px',
        padding: 0,
        outline: 'none'
    };

    const playButtonStyle = {
        ...recordButtonStyle,
        borderRadius: '10px',
        background: isRecording ? '#D4CED5' : '#E0DADF'
    };

    const timerStyle = {
        padding: isCompact ? '0 8px' : '0 10px',
        fontWeight: 600,
        fontSize: isCompact ? '12px' : '13px',
        color: '#222222',
        minWidth: isCompact ? '52px' : '60px',
        textAlign: 'center',
        background: '#F4F0F8'
    };

    const redDotStyle = {
        width: isCompact ? '7px' : '8px',
        height: isCompact ? '7px' : '8px',
        borderRadius: '50%',
        backgroundColor: '#E53935',
        marginRight: isCompact ? '4px' : '6px',
        opacity: 1,
        animation: isRecording ? 'recordBlink 1s ease-in-out infinite' : 'none'
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartRecording = async () => {
        try {
            chunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstart = () => {
                setIsRecording(true);
                setRecordingTime(0);
            };

            recorder.onstop = () => {
                setIsRecording(false);
                setHasRecording(true);
                stream.getTracks().forEach(track => track.stop());
                
                // Создаём Blob из записанных chunks
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordingBlob(blob);
                
                // Создаём URL для воспроизведения
                const url = URL.createObjectURL(blob);
                if (audioRef.current) {
                    audioRef.current.src = url;
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Ошибка доступа к микрофону');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    const handlePlayRecording = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleAudioEnd = () => {
        setIsPlaying(false);
    };

    const handleDeleteRecording = () => {
        setHasRecording(false);
        setRecordingTime(0);
        setIsRecording(false);
        setIsPlaying(false);
        setRecordingBlob(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
    };

    const handleSendForReview = () => {
        if (recordingBlob) {
            // TODO: Отправить recordingBlob на бэкенд
            console.log('Отправка записи на проверку:', recordingBlob);
            navigate('/processing');
        }
    };

    return (
        <div style={pageStyle}>
            <style>{`
                @keyframes recordBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.15; }
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
                <div style={textCardStyle}>
                    <div style={textHeaderStyle}>Текст для чтения</div>
                    <p style={textBodyStyle}>{textItem.body}</p>
                    <audio 
                        ref={audioRef} 
                        onEnded={handleAudioEnd}
                        style={{ display: 'none' }}
                    />
                    {!hasRecording ? (
                        <div style={controlsStyle}>
                            <div style={recordBarStyle}>
                                <button
                                    style={playButtonStyle}
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    title={isRecording ? 'Остановить запись' : 'Начать запись'}
                                >
                                    {isRecording ? '⏹' : '▶'}
                                </button>
                                <span style={timerStyle}>{formatTime(recordingTime)}</span>
                                <span style={redDotStyle}></span>
                            </div>
                        </div>
                    ) : (
                        <div style={recordingControlsStyle}>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    background: '#E1DDE8',
                                    minWidth: isCompact ? '150px' : '170px'
                                }}
                                onClick={handlePlayRecording}
                                title={isPlaying ? 'Пауза' : 'Прослушать запись'}
                            >
                                <span style={{ fontSize: 14 }}>▶</span>
                                <span>{isPlaying ? 'Пауза' : 'Прослушать'}</span>
                            </button>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    minWidth: isCompact ? '160px' : '190px'
                                }}
                                onClick={handleSendForReview}
                            >
                                Отправить на проверку
                            </button>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    background: '#F4F4F4',
                                    minWidth: isCompact ? '130px' : '150px',
                                    color: '#555555'
                                }}
                                onClick={handleDeleteRecording}
                                title="Удалить запись"
                            >
                                <span style={{ fontSize: 14 }}>✕</span>
                                <span>Удалить</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div style={compactContentStyle}>
                <div style={textCardStyle}>
                    <div style={textHeaderStyle}>Текст для чтения</div>
                    <p style={textBodyStyle}>{textItem.body}</p>
                    {!hasRecording ? (
                        <div style={controlsStyle}>
                            <div style={recordBarStyle}>
                                <button
                                    style={playButtonStyle}
                                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                                    title={isRecording ? 'Остановить запись' : 'Начать запись'}
                                >
                                    {isRecording ? '⏹' : '▶'}
                                </button>
                                <span style={timerStyle}>{formatTime(recordingTime)}</span>
                                <span style={redDotStyle}></span>
                            </div>
                        </div>
                    ) : (
                        <div style={recordingControlsStyle}>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    background: '#E1DDE8',
                                    minWidth: isCompact ? '150px' : '170px'
                                }}
                                onClick={handlePlayRecording}
                                title={isPlaying ? 'Пауза' : 'Прослушать запись'}
                            >
                                <span style={{ fontSize: 14 }}>▶</span>
                                <span>{isPlaying ? 'Пауза' : 'Прослушать'}</span>
                            </button>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    minWidth: isCompact ? '160px' : '190px'
                                }}
                                onClick={handleSendForReview}
                            >
                                Отправить на проверку
                            </button>
                            <button
                                style={{
                                    ...reviewButtonStyle,
                                    background: '#F4F4F4',
                                    minWidth: isCompact ? '130px' : '150px',
                                    color: '#555555'
                                }}
                                onClick={handleDeleteRecording}
                                title="Удалить запись"
                            >
                                <span style={{ fontSize: 14 }}>✕</span>
                                <span>Удалить</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TextReading;

