import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// Нормализуем base URL: убираем trailing slash и необязательный /api в конце
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/$/, '').replace(/\/api$/, '');
const TEXTS_ENDPOINT = `${API_BASE_URL}/api/texts/`;
const AUDIO_PROCESS_ENDPOINT = `${API_BASE_URL}/api/audio/process/`;

// Логируем конфигурацию при загрузке модуля
console.log('TextReading: API Configuration', {
    RAW_API_BASE_URL,
    API_BASE_URL,
    TEXTS_ENDPOINT,
    AUDIO_PROCESS_ENDPOINT
});

const loremText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nLorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.\nIaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenae';

const FALLBACK_SECTIONS = [
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

    const [sections, setSections] = React.useState(FALLBACK_SECTIONS);
    const [isLoadingTexts, setIsLoadingTexts] = React.useState(true);
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

    // Загружаем данные с бэкенда
    React.useEffect(() => {
        // Загружаем кэш для мгновенного отображения
        const cached = sessionStorage.getItem('lingai_sections');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) {
                    setSections(parsed);
                    setIsLoadingTexts(false);
                }
            } catch (e) {
                console.error('Failed to parse cached sections', e);
            }
        }

        // Запрашиваем свежие данные с бэкенда
        const fetchSections = async () => {
            try {
                setIsLoadingTexts(true);

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

                const payload = await response.json();
                console.log('Received payload from backend:', payload);
                
                // Пробуем разные форматы ответа
                let textsArray = [];
                
                if (Array.isArray(payload)) {
                    // Если payload - это массив текстов напрямую
                    textsArray = payload;
                } else if (Array.isArray(payload?.sections)) {
                    // Если payload имеет поле sections (уже в формате секций)
                    setSections(payload.sections);
                    sessionStorage.setItem('lingai_sections', JSON.stringify(payload.sections));
                    setIsLoadingTexts(false);
                    return;
                } else if (Array.isArray(payload?.data)) {
                    // Если payload имеет поле data
                    textsArray = payload.data;
                } else if (payload && typeof payload === 'object') {
                    // Если payload - объект, пробуем найти массив внутри
                    const possibleArrays = Object.values(payload).filter(Array.isArray);
                    if (possibleArrays.length > 0) {
                        textsArray = possibleArrays[0];
                    }
                }
                
                console.log('Texts array:', textsArray);

                // Преобразуем массив текстов в формат секций по сложности
                if (textsArray.length > 0) {
                    const difficultyMap = {
                        'easy': { id: 'easy', title: 'Лёгкий', bannerColor: '#DFF6E2', labelColor: '#7ACF84', texts: [] },
                        'medium': { id: 'medium', title: 'Средний', bannerColor: '#FFF6CF', labelColor: '#E7C35A', texts: [] },
                        'hard': { id: 'hard', title: 'Сложный', bannerColor: '#FFD3D3', labelColor: '#F47B7B', texts: [] }
                    };

                    textsArray.forEach(text => {
                        const difficulty = text.difficulty || text.level || 'easy';
                        if (difficultyMap[difficulty]) {
                            difficultyMap[difficulty].texts.push({
                                id: text.id ?? text.pk ?? text.uuid ?? text.text_id ?? null,
                                title: text.title || text.name || 'Без названия',
                                body: text.body || text.content || text.text || ''
                            });
                        } else {
                            // Если сложность не распознана, добавляем в easy
                            difficultyMap['easy'].texts.push({
                                id: text.id ?? text.pk ?? text.uuid ?? text.text_id ?? null,
                                title: text.title || text.name || 'Без названия',
                                body: text.body || text.content || text.text || ''
                            });
                        }
                    });

                    // Фильтруем только секции с текстами
                    const remoteSections = Object.values(difficultyMap).filter(section => section.texts.length > 0);
                    console.log('Processed sections:', remoteSections);

                    if (remoteSections.length > 0) {
                        setSections(remoteSections);
                    sessionStorage.setItem('lingai_sections', JSON.stringify(remoteSections));
                } else {
                        console.warn('No sections created, using fallback');
                        if (!cached) {
                            setSections(FALLBACK_SECTIONS);
                        }
                    }
                } else {
                    console.warn('Texts response is empty, using fallback sections');
                    if (!cached) {
                        setSections(FALLBACK_SECTIONS);
                    }
                }
            } catch (e) {
                console.error('Error loading sections on reading page', e);
                const cached = sessionStorage.getItem('lingai_sections');
                if (!cached) {
                    setSections(FALLBACK_SECTIONS);
                }
            } finally {
                setIsLoadingTexts(false);
            }
        };

        fetchSections();
    }, []);

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

    // Очищаем состояние записи при смене текста (но НЕ очищаем recordingBlob, если запись уже сделана)
    // Это позволяет пользователю сделать запись, выбрать другой текст и отправить запись для нового текста
    React.useEffect(() => {
        // Останавливаем запись, если она идет
        if (isRecording && mediaRecorder) {
            try {
                mediaRecorder.stop();
            } catch (e) {
                console.warn('Error stopping recorder on text change:', e);
            }
        }
        
        // Останавливаем воспроизведение
        if (audioRef.current) {
            try {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            } catch (e) {
                console.warn('Error stopping audio on text change:', e);
            }
        }
        
        // Очищаем состояние записи (но НЕ recordingBlob - он может быть использован для нового текста)
        setIsRecording(false);
        setRecordingTime(0);
        setHasRecording(false);
        // НЕ очищаем setRecordingBlob(null) - позволяем использовать существующую запись для нового текста
        setIsPlaying(false);
        chunksRef.current = [];
        
        // Останавливаем медиа-стрим
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
    }, [sectionId, textIndex]); // Очищаем при смене sectionId или textIndex

    const section = sections && Array.isArray(sections) ? sections.find(s => s.id === sectionId) : null;
    const textItem = section && section.texts && Array.isArray(section.texts) ? section.texts[parseInt(textIndex, 10)] : null;

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
        height: 'auto',
        minHeight: isCompact ? 'auto' : '400px',
        background: '#FDFDFE',
        borderRadius: '18px',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.08)',
        border: '2px solid #E19EFB',
        padding: isCompact ? '24px 20px' : '32px 36px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        justifyContent: 'space-between'
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
        fontSize: isCompact ? '18px' : '20px',
        lineHeight: 1.7,
        color: '#222222',
        flex: 1,
        overflowY: 'visible'
    };

    const controlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '8px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        width: '100%',
        flexShrink: 0
    };

    const recordingControlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: isCompact ? '8px' : '12px',
        marginTop: '8px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        width: '100%',
        flexWrap: isCompact ? 'wrap' : 'nowrap',
        flexShrink: 0
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

    const normalizeErrors = (payload) => {
        if (!payload) return {};

        // вариант: { errors: { word: type } }
        if (payload.errors && typeof payload.errors === 'object' && !Array.isArray(payload.errors)) {
            return payload.errors;
        }

        // вариант: { errors: [{ word, type }, ...] } или { mistakes: [...] }
        const list =
            (Array.isArray(payload.errors) && payload.errors) ||
            (Array.isArray(payload.mistakes) && payload.mistakes) ||
            (Array.isArray(payload.items) && payload.items) ||
            (Array.isArray(payload.data) && payload.data) ||
            (Array.isArray(payload) && payload) ||
            [];

        if (Array.isArray(list)) {
            const map = {};
            for (const item of list) {
                if (!item || typeof item !== 'object') continue;
                const word = item.word ?? item.token ?? item.text ?? item.value;
                const type = item.type ?? item.kind ?? item.category ?? item.error_type;
                if (typeof word === 'string' && word.length) {
                    map[word] = type || 'pronunciation';
                }
            }
            return map;
        }

        return {};
    };

    const encodeWav16BitPCM = (samples, sampleRate) => {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        const writeString = (offset, str) => {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };

        // RIFF header
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(8, 'WAVE');

        // fmt chunk
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true); // PCM
        view.setUint16(20, 1, true); // AudioFormat=PCM
        view.setUint16(22, 1, true); // NumChannels=1
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); // ByteRate=SampleRate*NumChannels*BitsPerSample/8
        view.setUint16(32, 2, true); // BlockAlign=NumChannels*BitsPerSample/8
        view.setUint16(34, 16, true); // BitsPerSample

        // data chunk
        writeString(36, 'data');
        view.setUint32(40, samples.length * 2, true);

        let offset = 44;
        for (let i = 0; i < samples.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }

        return buffer;
    };

    const blobToWav16kMono = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer.slice(0));

        // downmix to mono (Float32Array)
        const toMono = () => {
            const ch0 = decoded.getChannelData(0);
            if (decoded.numberOfChannels === 1) return ch0;
            const ch1 = decoded.getChannelData(1);
            const out = new Float32Array(decoded.length);
            for (let i = 0; i < decoded.length; i++) out[i] = (ch0[i] + ch1[i]) / 2;
            return out;
        };

        const mono = toMono();

        // resample to 16000 Hz using OfflineAudioContext
        const targetRate = 16000;
        const duration = decoded.duration;
        const frameCount = Math.ceil(duration * targetRate);
        const offline = new OfflineAudioContext(1, frameCount, targetRate);
        const buffer = offline.createBuffer(1, mono.length, decoded.sampleRate);
        buffer.copyToChannel(mono, 0, 0);
        const source = offline.createBufferSource();
        source.buffer = buffer;
        source.connect(offline.destination);
        source.start(0);
        const rendered = await offline.startRendering();
        const renderedMono = rendered.getChannelData(0);

        const wavBuffer = encodeWav16BitPCM(renderedMono, targetRate);
        return new Blob([wavBuffer], { type: 'audio/wav' });
    };

    const analyzeRecording = async ({ blob, text }) => {
        console.log('analyzeRecording: Starting analysis', { 
            endpoint: AUDIO_PROCESS_ENDPOINT,
            textLength: text?.length || 0,
            blobSize: blob?.size || 0,
            blobType: blob?.type || 'unknown'
        });

        // Бэк ожидает WAV mono 16000Hz. Конвертируем из webm/opus в wav.
        let wavBlob;
        try {
            wavBlob = await blobToWav16kMono(blob);
            console.log('analyzeRecording: Audio converted to WAV', { 
                wavSize: wavBlob?.size || 0 
            });
        } catch (conversionError) {
            console.error('analyzeRecording: Audio conversion failed', conversionError);
            throw new Error(`Ошибка конвертации аудио: ${conversionError?.message || 'Неизвестная ошибка'}`);
        }

        const form = new FormData();
        form.append('text', text || '');
        form.append('audio', new File([wavBlob], 'recording.wav', { type: 'audio/wav' }));
        form.append('enable_tts', 'true'); // Включаем генерацию аудио для правильного произношения

        console.log('analyzeRecording: Sending request to', AUDIO_PROCESS_ENDPOINT, {
            textLength: text?.length || 0,
            audioFileSize: wavBlob?.size || 0,
            hasText: !!text,
            hasAudio: !!wavBlob
        });

        let res;
        try {
            res = await fetch(AUDIO_PROCESS_ENDPOINT, { 
                method: 'POST', 
                body: form 
            });
            console.log('analyzeRecording: Response received', { 
                status: res.status, 
                statusText: res.statusText,
                ok: res.ok 
            });
        } catch (networkError) {
            console.error('analyzeRecording: Network error', networkError);
            // Обработка сетевых ошибок (бэкенд не запущен, CORS, и т.д.)
            throw new Error(`Failed to fetch: ${networkError?.message || 'Не удалось подключиться к серверу'}`);
        }
        
        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            throw new Error(`Audio process failed: ${res.status} ${res.statusText} ${errorText}`.trim());
        }
        const payload = await res.json().catch(() => ({}));
        
        // Отладочные логи для проверки данных от бэкенда
        console.log('TextReading: Raw payload from backend:', payload);
        if (payload.mispronouncedWords && payload.mispronouncedWords.length > 0) {
            console.log('TextReading: First mispronouncedWord:', payload.mispronouncedWords[0]);
            console.log('TextReading: First mispronouncedWord keys:', Object.keys(payload.mispronouncedWords[0] || {}));
            console.log('TextReading: First mispronouncedWord.audioUrl:', payload.mispronouncedWords[0]?.audioUrl);
        }
        if (payload.correctionClips) {
            console.log('TextReading: correctionClips:', payload.correctionClips);
        }
        
        const errors = normalizeErrors(payload);
        return { endpoint: AUDIO_PROCESS_ENDPOINT, payload, errors };
    };

    const handleSendForReview = async () => {
        if (!recordingBlob) {
            console.warn('No recording blob available');
            return;
        }

        // Проверяем, что textItem существует и актуален
        if (!textItem || !textItem.body) {
            console.error('Text item is missing or has no body');
            alert('Ошибка: текст не найден. Пожалуйста, вернитесь и выберите текст заново.');
            return;
        }

        const idx = parseInt(textIndex, 10);
        const currentSectionId = sectionId;
        
        // Проверяем, что индексы актуальны
        if (!currentSectionId || !Number.isFinite(idx)) {
            console.error('Invalid sectionId or textIndex:', { currentSectionId, idx });
            alert('Ошибка: некорректные параметры текста. Пожалуйста, вернитесь и выберите текст заново.');
            return;
        }

        // Получаем актуальный текст из текущего состояния
        const currentSection = sections && Array.isArray(sections) ? sections.find(s => s.id === currentSectionId) : null;
        const currentTextItem = currentSection && currentSection.texts && Array.isArray(currentSection.texts) 
            ? currentSection.texts[idx] 
            : null;

        if (!currentTextItem || !currentTextItem.body) {
            console.error('Current text item not found:', { currentSectionId, idx, sections });
            alert('Ошибка: текст не найден. Пожалуйста, вернитесь и выберите текст заново.');
            return;
        }

        const textToAnalyze = currentTextItem.body;
        console.log('handleSendForReview: Preparing to send', { 
            sectionId: currentSectionId, 
            textIndex: idx, 
            textLength: textToAnalyze.length,
            textPreview: textToAnalyze.substring(0, 50) + '...',
            recordingBlobSize: recordingBlob?.size || 0,
            recordingBlobType: recordingBlob?.type || 'unknown',
            hasRecordingBlob: !!recordingBlob,
            endpoint: AUDIO_PROCESS_ENDPOINT
        });

        // Проверяем, что recordingBlob валиден
        if (!recordingBlob || recordingBlob.size === 0) {
            console.error('handleSendForReview: Invalid recording blob', { 
                blob: recordingBlob,
                size: recordingBlob?.size 
            });
            alert('Ошибка: запись не найдена. Пожалуйста, сделайте запись заново.');
            return;
        }

        // Сохраняем информацию о выбранном тексте для страницы результатов
        sessionStorage.setItem(
            'lingai_current_text',
            JSON.stringify({
                sectionId: currentSectionId,
                textIndex: idx
            })
        );

        // очищаем старые результаты
        sessionStorage.removeItem('lingai_analysis_errors');
        sessionStorage.removeItem('lingai_analysis_result');
        sessionStorage.setItem('lingai_analysis_status', 'pending');

        // UX: сразу показываем экран "обработка"
            navigate('/processing');

        try {
            const result = await analyzeRecording({
                blob: recordingBlob,
                text: textToAnalyze // Используем актуальный текст
            });

            // сохраняем полный ответ анализа (нужен для подсветки по позициям)
            sessionStorage.setItem('lingai_analysis_result', JSON.stringify(result.payload || {}));
            sessionStorage.setItem('lingai_analysis_errors', JSON.stringify(result.errors || {}));
            sessionStorage.setItem('lingai_analysis_status', 'success');
            sessionStorage.setItem('lingai_analysis_meta', JSON.stringify({ endpoint: result.endpoint }));
        } catch (e) {
            console.error('Analyze error:', e);
            sessionStorage.setItem('lingai_analysis_status', 'error');
            
            // Формируем понятное сообщение об ошибке
            let errorMessage = 'Ошибка при анализе записи';
            const errorStr = String(e?.message || e || '');
            
            if (errorStr.includes('Failed to fetch') || errorStr.includes('NetworkError') || errorStr.includes('Network request failed')) {
                errorMessage = 'Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на http://localhost:8000';
            } else if (errorStr.includes('400')) {
                errorMessage = 'Ошибка запроса. Проверьте настройки бэкенда.';
            } else if (errorStr.includes('500')) {
                errorMessage = 'Ошибка сервера. Попробуйте позже.';
            } else if (errorStr.includes('YANDEX') || errorStr.includes('TTS')) {
                errorMessage = 'Ошибка синтеза речи. Проверьте настройки Yandex API на бэкенде.';
            } else if (errorStr) {
                errorMessage = errorStr;
            }
            
            sessionStorage.setItem('lingai_analysis_error_message', errorMessage);
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

