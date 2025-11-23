import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

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

    const controlsStyle = isCompact
        ? {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              flexWrap: 'wrap'
          }
        : {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
              flexWrap: 'wrap'
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

    const reviewButtonStyle = isCompact
        ? {
              flex: isCompact ? 1 : 'none',
              minWidth: '100px',
              padding: '10px 12px',
              borderRadius: '8px',
              border: 'none',
              background: '#E19EFB',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'opacity 0.2s ease'
          }
        : {
              flex: 1,
              minWidth: '140px',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#E19EFB',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'opacity 0.2s ease'
          };

    const buttonStyle = isCompact
        ? {
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: 'none',
              background: '#E19EFB',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'opacity 0.2s ease',
              fontWeight: 'bold',
              flexShrink: 0
          }
        : {
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              border: 'none',
              background: '#E19EFB',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'opacity 0.2s ease',
              fontWeight: 'bold'
          };

    const timerStyle = {
        fontWeight: 600,
        fontSize: isCompact ? '13px' : '14px',
        color: isRecording ? '#E19EFB' : '#666666',
        minWidth: isCompact ? '50px' : '60px',
        textAlign: 'center'
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    React.useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

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
                            <button 
                                style={buttonStyle} 
                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                title={isRecording ? "Stop recording" : "Start recording"}
                            >
                                {isRecording ? '⏹' : '▶'}
                            </button>
                            <span style={timerStyle}>{formatTime(recordingTime)}</span>
                            <button 
                                style={{...buttonStyle, background: '#CCC'}} 
                                onClick={handleDeleteRecording}
                                title="Clear"
                                disabled={!isRecording}
                            >
                                🗑
                            </button>
                        </div>
                    ) : (
                        <div style={recordingControlsStyle}>
                            <button 
                                style={{
                                    ...reviewButtonStyle,
                                    minWidth: '160px',
                                    background: '#4A90E2'
                                }}
                                onClick={handlePlayRecording}
                                title={isPlaying ? "Пауза" : "Прослушать запись"}
                            >
                                {isPlaying ? '⏸ Пауза' : '▶ Прослушать'}
                            </button>
                            <button style={reviewButtonStyle} onClick={handleSendForReview}>
                                Отправить на проверку
                            </button>
                            <button 
                                style={{...reviewButtonStyle, background: '#EEE', color: '#666'}}
                                onClick={handleDeleteRecording}
                                title="Удалить запись"
                            >
                                ✕ Удалить
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
                            <button 
                                style={buttonStyle} 
                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                title={isRecording ? "Stop recording" : "Start recording"}
                            >
                                {isRecording ? '⏹' : '▶'}
                            </button>
                            <span style={timerStyle}>{formatTime(recordingTime)}</span>
                            <button 
                                style={{...buttonStyle, background: '#CCC'}} 
                                onClick={handleDeleteRecording}
                                title="Clear"
                                disabled={!isRecording}
                            >
                                🗑
                            </button>
                        </div>
                    ) : (
                        <div style={recordingControlsStyle}>
                            <button 
                                style={{
                                    ...reviewButtonStyle,
                                    minWidth: '160px',
                                    background: '#4A90E2'
                                }}
                                onClick={handlePlayRecording}
                                title={isPlaying ? "Пауза" : "Прослушать запись"}
                            >
                                {isPlaying ? '⏸ Пауза' : '▶ Прослушать'}
                            </button>
                            <button style={reviewButtonStyle} onClick={handleSendForReview}>
                                Отправить на проверку
                            </button>
                            <button 
                                style={{...reviewButtonStyle, background: '#EEE', color: '#666'}}
                                onClick={handleDeleteRecording}
                                title="Удалить запись"
                            >
                                ✕ Удалить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TextReading;

