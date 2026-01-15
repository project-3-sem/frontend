import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function RecordingResults() {
    const navigate = useNavigate();

    const [clickedWord, setClickedWord] = React.useState(null); // Изменено с hoveredWord на clickedWord
    const [clickedWordData, setClickedWordData] = React.useState(null); // Данные о слове (word, type, position)
    const [isCompact, setIsCompact] = React.useState(window.innerWidth <= 900);
    const [currentText, setCurrentText] = React.useState(null);
    const [textWithErrors, setTextWithErrors] = React.useState({
        text: '',
        errors: {}
    });
    const [analysisResult, setAnalysisResult] = React.useState(null);
    const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = React.useState(false);
    const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });
    const audioRef = React.useRef(null);
    const popupRef = React.useRef(null);

    // Загружаем выбранный текст
    React.useEffect(() => {
        // Получаем информацию о выбранном тексте
        const currentTextInfo = sessionStorage.getItem('lingai_current_text');
        if (currentTextInfo) {
            try {
                const { sectionId, textIndex } = JSON.parse(currentTextInfo);
                
                // Загружаем секции из кэша
                const cachedSections = sessionStorage.getItem('lingai_sections');
                if (cachedSections) {
                    try {
                        const sections = JSON.parse(cachedSections);
                        const section = sections.find(s => s.id === sectionId);
                        if (section && section.texts && section.texts[textIndex]) {
                            const textItem = section.texts[textIndex];
                            const textBody = textItem.body || '';
                            setCurrentText(textItem);
                            
                            // Пробуем загрузить полный результат анализа и ошибки
                            const savedResult = sessionStorage.getItem('lingai_analysis_result');
                            const savedErrors = sessionStorage.getItem('lingai_analysis_errors');
                            let result = null;
                            let errors = {};

                            if (savedResult) {
                                try {
                                    result = JSON.parse(savedResult);
                                    console.log('Loaded analysis result:', result);
                                } catch (e) {
                                    console.error('Failed to parse saved analysis result', e);
                                }
                            }

                            if (savedErrors) {
                                try {
                                    errors = JSON.parse(savedErrors);
                                    console.log('Loaded errors:', errors);
                                } catch (e) {
                                    console.error('Failed to parse saved errors', e);
                                }
                            }

                            setAnalysisResult(result);
                            
                            // Отладочные логи
                            console.log('RecordingResults: Full analysis result:', result);
                            console.log('RecordingResults: mispronouncedWords:', result?.mispronouncedWords);
                            if (result?.mispronouncedWords && result.mispronouncedWords.length > 0) {
                                console.log('RecordingResults: Total mispronouncedWords:', result.mispronouncedWords.length);
                                console.log('RecordingResults: First mispronouncedWord:', result.mispronouncedWords[0]);
                                console.log('RecordingResults: First mispronouncedWord keys:', Object.keys(result.mispronouncedWords[0] || {}));
                                
                                // Проверяем, сколько слов имеют audioUrl
                                const withAudio = result.mispronouncedWords.filter(mw => mw && mw.audioUrl && typeof mw.audioUrl === 'string' && mw.audioUrl.trim().length > 0);
                                const withoutAudio = result.mispronouncedWords.filter(mw => !mw || !mw.audioUrl || typeof mw.audioUrl !== 'string' || mw.audioUrl.trim().length === 0);
                                console.log('RecordingResults: Words with audioUrl:', withAudio.length, withAudio.map(mw => ({ word: mw.word, audioUrl: mw.audioUrl })));
                                console.log('RecordingResults: Words without audioUrl:', withoutAudio.length, withoutAudio.map(mw => ({ word: mw?.word, audioUrl: mw?.audioUrl })));
                            }
                            console.log('RecordingResults: correctionClips:', result?.correctionClips);
                            if (result?.correctionClips && Array.isArray(result.correctionClips)) {
                                console.log('RecordingResults: correctionClips count:', result.correctionClips.length);
                                console.log('RecordingResults: correctionClips sample (first 5):', result.correctionClips.slice(0, 5));
                                console.log('RecordingResults: correctionClips full structure:', result.correctionClips.map((c, idx) => ({
                                    index: idx,
                                    word: c?.word,
                                    file: c?.file,
                                    url: c?.url,
                                    audioUrl: c?.audioUrl,
                                    fullObject: c
                                })));
                            }
                            
                            // Показываем referenceText (исходный текст), если он есть, иначе оригинал из кэша
                            const displayText =
                                (typeof result?.referenceText === 'string' && result.referenceText) ||
                                textBody;

                            // Если есть mispronouncedWords, но нет errors словаря — создаём словарь из слов для fallback
                            if (Array.isArray(result?.mispronouncedWords) && result.mispronouncedWords.length > 0 && Object.keys(errors).length === 0) {
                                result.mispronouncedWords.forEach((item) => {
                                    if (item && typeof item === 'object' && item.word) {
                                        // Формат бэкенда: { word: "слово", position: 15, recognized: "что_распознано" }
                                        const cleanWord = item.word.replace(/[.,!?;:'"]/g, '');
                                        if (cleanWord) {
                                            errors[cleanWord] = 'pronunciation';
                                        }
                                    }
                                });
                            }
                            
                            setTextWithErrors({
                                text: displayText,
                                errors: errors
                            });
                        }
                    } catch (e) {
                        console.error('Failed to parse cached sections', e);
                    }
                }
            } catch (e) {
                console.error('Failed to parse current text info', e);
            }
        }
    }, []);

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
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
    };

    const contentStyle = {
        position: 'relative',
        zIndex: 1,
        maxWidth: '1320px',
        margin: '0 auto',
        padding: isCompact ? '32px 16px 72px' : '40px 24px 96px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        width: '100%',
        boxSizing: 'border-box'
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
        } else if (errorType === 'missing') {
            textDecoration = 'underline wavy #FFD700'; // Желтый цвет для пропущенных слов
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

    const popupStyle = (errorType) => {
        let backgroundColor = '#E74C3C';

        if (errorType === 'pronunciation') {
            backgroundColor = '#E74C3C';
        } else if (errorType === 'grammar') {
            backgroundColor = '#3498DB';
        } else if (errorType === 'accent') {
            backgroundColor = '#F39C12';
        } else if (errorType === 'missing') {
            backgroundColor = '#FFD700'; // Желтый цвет для пропущенных слов
        }

        return {
            position: 'fixed', // fixed для отображения поверх всего контента
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            transform: 'translate(-50%, -100%)', // Центрируем по горизонтали и выравниваем снизу
            backgroundColor,
            borderRadius: '12px',
            padding: '12px 16px',
            minWidth: '180px',
            zIndex: 10000, // Высокий z-index для отображения поверх всего
            marginBottom: '10px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto'
        };
    };

    const popupHeaderStyle = {
        color: '#FFFFFF',
        fontSize: '14px',
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: '4px'
    };

    const pronunciationButtonStyle = (errorType) => {
        let buttonColor = '#E74C3C';
        
        if (errorType === 'missing') {
            buttonColor = '#FFD700'; // Желтый цвет для пропущенных слов
        }
        
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            color: buttonColor,
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: isLoadingAudio ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontFamily: 'inherit',
            width: '100%'
        };
    };

    const popupArrowStyle = (errorType) => {
        let backgroundColor = '#E74C3C';

        if (errorType === 'pronunciation') {
            backgroundColor = '#E74C3C';
        } else if (errorType === 'grammar') {
            backgroundColor = '#3498DB';
        } else if (errorType === 'accent') {
            backgroundColor = '#F39C12';
        } else if (errorType === 'missing') {
            backgroundColor = '#FFD700'; // Желтый цвет для пропущенных слов
        }

        return {
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${backgroundColor}`,
            zIndex: 1001
        };
    };

    const getErrorDescription = (errorType) => {
        const descriptions = {
            'pronunciation': 'Ошибка в произношении. Слово произнесено неправильно.',
            'grammar': 'Грамматическая ошибка. Проверьте форму слова или структуру предложения.',
            'accent': 'Акцент. Слово произнесено с неправильным ударением.',
            'missing': 'Пропущенное слово. Это слово отсутствует в вашей речи.'
        };
        return descriptions[errorType] || 'Ошибка в речи';
    };

    const getErrorLabel = (errorType) => {
        if (errorType === 'pronunciation') return '🔊 Произношение';
        if (errorType === 'grammar') return '📝 Грамматика';
        if (errorType === 'accent') return '🎯 Ударение';
        if (errorType === 'missing') return '⚠️ Пропущенное слово';
        return 'Ошибка';
    };

    // Обработка клика на слово с ошибкой
    const handleWordClick = (e, wordData) => {
        e.stopPropagation(); // Предотвращаем всплытие события
        
        // Вычисляем позицию слова для popup
        const wordElement = e.currentTarget;
        const rect = wordElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Позиционируем popup над словом
        setPopupPosition({
            top: rect.top + scrollTop - 10, // 10px отступ сверху
            left: rect.left + scrollLeft + (rect.width / 2) // Центр слова
        });
        
        setClickedWord(wordData.key);
        setClickedWordData(wordData);
    };

    // Закрытие popup при клике вне его
    React.useEffect(() => {
        if (!clickedWord) return;

        const handleClickOutside = (event) => {
            const target = event.target;
            
            // Не закрываем popup, если клик был внутри popup
            if (target.closest('[data-popup-container]')) {
                return;
            }
            
            // Проверяем, что клик не был на слове с ошибкой
            if (target.closest('[data-error-word]')) {
                // Если клик на слове, но не на popup внутри него - не закрываем через этот обработчик
                // (так как handleWordClick сам управляет состоянием)
                return;
            }
            
            // Клик вне popup и вне слова - закрываем popup
            setClickedWord(null);
            setClickedWordData(null);
        };

        // Используем небольшой таймаут, чтобы клик на слово сначала обработался
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside, true);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [clickedWord]);

    // Получение URL аудио из данных слова
    const getPronunciationAudioUrl = (wordData) => {
        if (!wordData) {
            console.log('getPronunciationAudioUrl: wordData is null/undefined');
            return null;
        }

        console.log('getPronunciationAudioUrl: wordData', wordData);
        console.log('getPronunciationAudioUrl: analysisResult', analysisResult);
        console.log('getPronunciationAudioUrl: mispronouncedWords', analysisResult?.mispronouncedWords);
        console.log('getPronunciationAudioUrl: correctionClips', analysisResult?.correctionClips);

        // audioUrl может быть напрямую в wordData (из mispronouncedWords)
        let audioUrl = wordData.audioUrl;
        console.log('getPronunciationAudioUrl: audioUrl from wordData', audioUrl, 'type:', typeof audioUrl);

        // Проверяем на пустую строку, null, undefined
        const isValidUrl = audioUrl && typeof audioUrl === 'string' && audioUrl.trim().length > 0;

        // Если audioUrl не найден в wordData, попробуем найти в mispronouncedWords
        if (!isValidUrl && analysisResult?.mispronouncedWords) {
            console.log('getPronunciationAudioUrl: searching in mispronouncedWords', analysisResult.mispronouncedWords);
            console.log('getPronunciationAudioUrl: looking for word:', wordData.word);
            
            // Нормализуем слово для поиска (убираем пунктуацию, приводим к нижнему регистру)
            const normalizeWord = (w) => {
                if (!w || typeof w !== 'string') return '';
                return w.toLowerCase().replace(/[.,!?;:'"]/g, '').trim();
            };
            
            const searchWord = normalizeWord(wordData.word);
            console.log('getPronunciationAudioUrl: normalized search word:', searchWord);
            
            const mispronouncedWord = analysisResult.mispronouncedWords.find(
                (mw) => {
                    if (!mw || !mw.word) return false;
                    const mwWord = normalizeWord(mw.word);
                    const match = mwWord === searchWord;
                    if (match) {
                        console.log('getPronunciationAudioUrl: found match!', { 
                            mwWord, 
                            searchWord, 
                            originalMW: mw.word, 
                            originalSearch: wordData.word,
                            audioUrl: mw.audioUrl 
                        });
                    }
                    return match;
                }
            );
            console.log('getPronunciationAudioUrl: found mispronouncedWord', mispronouncedWord);
            if (mispronouncedWord) {
                audioUrl = mispronouncedWord.audioUrl;
                console.log('getPronunciationAudioUrl: audioUrl from mispronouncedWord', audioUrl, 'type:', typeof audioUrl);
            } else {
                console.warn('getPronunciationAudioUrl: mispronouncedWord not found for word:', wordData.word);
                console.log('getPronunciationAudioUrl: available words in mispronouncedWords:', 
                    analysisResult.mispronouncedWords.map(mw => ({ word: mw?.word, normalized: normalizeWord(mw?.word) }))
                );
            }
        }

        // Проверяем снова после поиска в mispronouncedWords
        const isValidUrlAfterMW = audioUrl && typeof audioUrl === 'string' && audioUrl.trim().length > 0;

        // Если URL все еще не найден, попробуем correctionClips как fallback
        if (!isValidUrlAfterMW && analysisResult?.correctionClips) {
            console.log('getPronunciationAudioUrl: searching in correctionClips', analysisResult.correctionClips);
            
            // Нормализуем слово для поиска (убираем пунктуацию, приводим к нижнему регистру)
            const normalizeWord = (w) => {
                if (!w || typeof w !== 'string') return '';
                return w.toLowerCase().replace(/[.,!?;:'"]/g, '').trim();
            };
            
            // Пробуем найти по word (правильному слову)
            const searchWord = normalizeWord(wordData.word);
            console.log('getPronunciationAudioUrl: searching for normalized word in correctionClips:', searchWord);
            
            let clip = analysisResult.correctionClips.find(
                (c) => {
                    if (!c || !c.word) return false;
                    const clipWord = normalizeWord(c.word);
                    const match = clipWord === searchWord;
                    if (match) {
                        console.log('getPronunciationAudioUrl: found clip match by word!', { 
                            clipWord, 
                            searchWord, 
                            originalClip: c.word, 
                            originalSearch: wordData.word,
                            url: c.url,
                            audioUrl: c.audioUrl
                        });
                    }
                    return match;
                }
            );
            
            // Если не нашли по word, пробуем найти по recognized (распознанному слову)
            if (!clip && wordData.recognized) {
                const searchRecognized = normalizeWord(wordData.recognized);
                console.log('getPronunciationAudioUrl: searching by recognized word in correctionClips:', searchRecognized);
                clip = analysisResult.correctionClips.find(
                    (c) => {
                        if (!c || !c.word) return false;
                        const clipWord = normalizeWord(c.word);
                        const match = clipWord === searchRecognized;
                        if (match) {
                            console.log('getPronunciationAudioUrl: found clip match by recognized!', { 
                                clipWord, 
                                searchRecognized, 
                                originalClip: c.word, 
                                originalRecognized: wordData.recognized,
                                url: c.url,
                                audioUrl: c.audioUrl
                            });
                        }
                        return match;
                    }
                );
            }
            
            console.log('getPronunciationAudioUrl: found clip', clip);
            if (clip) {
                audioUrl = clip.url || clip.audioUrl;
                console.log('getPronunciationAudioUrl: audioUrl from clip', audioUrl, 'type:', typeof audioUrl);
            } else {
                console.warn('getPronunciationAudioUrl: clip not found for word:', wordData.word, 'recognized:', wordData.recognized);
                console.log('getPronunciationAudioUrl: available words in correctionClips:', 
                    analysisResult.correctionClips.map(c => ({ word: c?.word, normalized: normalizeWord(c?.word), url: c?.url, audioUrl: c?.audioUrl }))
                );
            }
        }

        // Финальная проверка
        const isValidFinalUrl = audioUrl && typeof audioUrl === 'string' && audioUrl.trim().length > 0;
        if (!isValidFinalUrl) {
            console.log('getPronunciationAudioUrl: audioUrl not found or invalid, returning null. audioUrl:', audioUrl);
            return null;
        }

        // Если URL относительный, добавляем базовый URL API
        let finalUrl;
        if (audioUrl.startsWith('/')) {
            finalUrl = `${API_BASE_URL}${audioUrl}`;
        } else if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
            // Если URL уже полный, возвращаем как есть
            finalUrl = audioUrl;
        } else {
            // Если URL относительный без слеша в начале
            finalUrl = `${API_BASE_URL}/${audioUrl}`;
        }
        
        console.log('getPronunciationAudioUrl: final URL', finalUrl);
        return finalUrl;
    };

    // Воспроизведение правильного произношения
    const handlePlayPronunciation = async (e) => {
        if (e) {
            e.stopPropagation(); // Предотвращаем закрытие popup при клике на кнопку
        }
        
        if (!clickedWordData || !clickedWordData.word) return;

        try {
            // Получаем URL аудио из данных слова (audioUrl из mispronouncedWords)
            const audioUrl = getPronunciationAudioUrl(clickedWordData);
            
            if (!audioUrl) {
                alert('Аудио для этого слова не найдено');
                return;
            }

            // Если аудио уже загружено для этого слова, просто воспроизводим/ставим на паузу
            if (audioRef.current && audioRef.current.src === audioUrl) {
                if (audioRef.current.paused) {
                    audioRef.current.play();
                    setIsPlayingAudio(true);
                } else {
                    audioRef.current.pause();
                    setIsPlayingAudio(false);
                }
                return;
            }

            // Загружаем новое аудио
            setIsLoadingAudio(true);
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.onloadeddata = () => {
                    setIsLoadingAudio(false);
                    audioRef.current.play();
                    setIsPlayingAudio(true);
                };
                audioRef.current.onerror = () => {
                    setIsLoadingAudio(false);
                    alert('Ошибка загрузки аудио произношения');
                };
            }
        } catch (error) {
            console.error('Error playing pronunciation:', error);
            setIsLoadingAudio(false);
            alert('Ошибка воспроизведения аудио');
        }
    };

    // Обработка окончания воспроизведения аудио
    const handleAudioEnd = () => {
        setIsPlayingAudio(false);
    };

    const renderTextWithErrors = () => {
        if (!textWithErrors.text) {
            return <p>Загрузка текста...</p>;
        }

        // 1) Если бэк прислал mispronouncedWords с позициями — подсвечиваем по позициям
        const mpw = analysisResult?.mispronouncedWords;
        
        if (Array.isArray(mpw) && mpw.length > 0 && typeof textWithErrors.text === 'string') {
            // Формат бэкенда: { word: "слово", position: 15, recognized: "что_распознано" }
            // position - это позиция в referenceText (исходном тексте)
            const ranges = mpw
                .map((x) => {
                    if (!x || typeof x !== 'object') {
                        return null;
                    }
                    
                    const position = x.position;
                    const word = x.word || '';
                    
                    if (!Number.isFinite(position) || position < 0 || !word) {
                        return null;
                    }
                    
                    // Находим слово в тексте начиная с позиции
                    const text = textWithErrors.text;
                    const pos = Number(position);
                    
                    // Ищем начало слова (может быть пробел перед ним)
                    let start = pos;
                    // Если позиция указывает на середину слова, ищем начало слова
                    while (start > 0 && /\w/.test(text[start - 1])) {
                        start--;
                    }
                    
                    // Ищем конец слова
                    let end = start;
                    while (end < text.length && /\w/.test(text[end])) {
                        end++;
                    }
                    
                    // Если позиция валидна и мы нашли слово
                    if (start >= 0 && end > start && end <= text.length) {
                        let audioUrl = x.audioUrl || null;
                        
                        // Если audioUrl нет в mispronouncedWords, пробуем найти в correctionClips
                        if (!audioUrl && analysisResult?.correctionClips) {
                            const normalizeWord = (w) => {
                                if (!w || typeof w !== 'string') return '';
                                return w.toLowerCase().replace(/[.,!?;:'"]/g, '').trim();
                            };
                            
                            const searchWord = normalizeWord(word);
                            console.log('renderTextWithErrors: Searching in correctionClips for word:', word, 'normalized:', searchWord);
                            console.log('renderTextWithErrors: correctionClips available:', analysisResult.correctionClips.length);
                            
                            const clip = analysisResult.correctionClips.find(
                                (c) => {
                                    if (!c || !c.word) return false;
                                    const clipWord = normalizeWord(c.word);
                                    const match = clipWord === searchWord;
                                    if (match) {
                                        console.log('renderTextWithErrors: Found clip match by word!', { 
                                            clipWord, 
                                            searchWord, 
                                            originalClip: c.word, 
                                            originalSearch: word,
                                            url: c.url,
                                            audioUrl: c.audioUrl
                                        });
                                    }
                                    return match;
                                }
                            );
                            
                            if (clip) {
                                audioUrl = clip.url || clip.audioUrl || null;
                                if (audioUrl) {
                                    console.log('renderTextWithErrors: Found audioUrl in correctionClips for word', word, 'audioUrl:', audioUrl);
                                } else {
                                    console.warn('renderTextWithErrors: Clip found but no audioUrl in clip:', clip);
                                }
                            } else {
                                console.log('renderTextWithErrors: No clip found by word, trying recognized...');
                            }
                            
                            // Если не нашли по word, пробуем по recognized
                            if (!audioUrl && x.recognized) {
                                const searchRecognized = normalizeWord(x.recognized);
                                console.log('renderTextWithErrors: Searching in correctionClips for recognized:', x.recognized, 'normalized:', searchRecognized);
                                const clipByRecognized = analysisResult.correctionClips.find(
                                    (c) => {
                                        if (!c || !c.word) return false;
                                        const clipWord = normalizeWord(c.word);
                                        const match = clipWord === searchRecognized;
                                        if (match) {
                                            console.log('renderTextWithErrors: Found clip match by recognized!', { 
                                                clipWord, 
                                                searchRecognized, 
                                                originalClip: c.word, 
                                                originalRecognized: x.recognized,
                                                url: c.url,
                                                audioUrl: c.audioUrl
                                            });
                                        }
                                        return match;
                                    }
                                );
                                if (clipByRecognized) {
                                    audioUrl = clipByRecognized.url || clipByRecognized.audioUrl || null;
                                    if (audioUrl) {
                                        console.log('renderTextWithErrors: Found audioUrl in correctionClips for recognized', x.recognized, 'audioUrl:', audioUrl);
                                    } else {
                                        console.warn('renderTextWithErrors: Clip found by recognized but no audioUrl:', clipByRecognized);
                                    }
                                } else {
                                    console.warn('renderTextWithErrors: No clip found for word:', word, 'or recognized:', x.recognized);
                                    // Выводим полный список correctionClips для отладки
                                    console.log('renderTextWithErrors: Full correctionClips array:', analysisResult.correctionClips);
                                    console.log('renderTextWithErrors: Available words in correctionClips:', 
                                        analysisResult.correctionClips.map((c, idx) => ({ 
                                            index: idx,
                                            word: c?.word, 
                                            normalized: normalizeWord(c?.word), 
                                            url: c?.url, 
                                            audioUrl: c?.audioUrl,
                                            file: c?.file,
                                            fullObject: c
                                        }))
                                    );
                                }
                            }
                        }
                        
                        // Логируем для отладки
                        if (!audioUrl) {
                            console.warn('renderTextWithErrors: No audioUrl for word', word, 'at position', position, 'mispronouncedWord:', x);
                        }
                        
                        return { 
                            start: start, 
                            end: end, 
                            type: 'pronunciation', // Все ошибки произношения
                            word: word,
                            recognized: x.recognized || null,
                            audioUrl: audioUrl // URL аудио из mispronouncedWords или correctionClips
                        };
                    }
                    
                    return null;
                })
                .filter(Boolean)
                .sort((a, b) => a.start - b.start);

            if (ranges.length) {
                const out = [];
                let cursor = 0;
                ranges.forEach((r, i) => {
                    if (r.start > cursor) {
                        out.push(<span key={`t-${i}-p`}>{textWithErrors.text.slice(cursor, r.start)}</span>);
                    }
                    const slice = textWithErrors.text.slice(r.start, r.end);
                    const key = `err-${i}-${r.start}-${r.end}`;
                    const isClicked = clickedWord === key;
                    out.push(
                        <span
                            key={key}
                            data-error-word={true}
                            style={errorWordStyle(r.type)}
                            onClick={(e) => {
                                console.log('Word clicked, r:', r);
                                console.log('Word clicked, audioUrl from r:', r.audioUrl, 'type:', typeof r.audioUrl);
                                console.log('Word clicked, word:', r.word);
                                // Убеждаемся, что audioUrl передается
                                const wordData = { 
                                    key, 
                                    word: r.word, 
                                    type: r.type, 
                                    recognized: r.recognized, 
                                    audioUrl: r.audioUrl 
                                };
                                console.log('Word clicked, wordData:', wordData);
                                handleWordClick(e, wordData);
                            }}
                        >
                            {slice}
                            {isClicked && (
                                <span ref={popupRef} data-popup-container style={popupStyle(r.type)}>
                                    <div style={popupHeaderStyle}>
                                        <span>{getErrorLabel(r.type)}</span>
                                    </div>
                                    <button
                                        style={pronunciationButtonStyle(r.type)}
                                        onClick={handlePlayPronunciation}
                                        disabled={isLoadingAudio}
                                    >
                                        {isLoadingAudio ? '⏳' : isPlayingAudio ? '⏸' : '▶'}
                                        <span style={{ marginLeft: '6px' }}>
                                            {isLoadingAudio ? 'Загрузка...' : 'Послушать'}
                                        </span>
                                    </button>
                                    <span style={popupArrowStyle(r.type)}></span>
                                </span>
                            )}
                        </span>
                    );
                    cursor = r.end;
                });
                if (cursor < textWithErrors.text.length) {
                    out.push(<span key="t-tail">{textWithErrors.text.slice(cursor)}</span>);
                }
                return out;
            }
        }

        // 2) fallback: подсветка по словам (если бэк вернул map ошибок)
        const words = textWithErrors.text.split(' ');
        return words.map((word, index) => {
            const cleanWord = word.replace(/[.,!?;:'"]/g, '');
            const isError = textWithErrors.errors?.[cleanWord] || textWithErrors.errors?.[word];

            if (isError) {
                const key = `${cleanWord}-${index}`;
                const isClicked = clickedWord === key;
                return (
                    <span
                        key={index}
                        data-error-word={true}
                        style={errorWordStyle(isError)}
                        onClick={(e) => handleWordClick(e, { key, word: cleanWord, type: isError })}
                    >
                        {word}{' '}
                        {isClicked && (
                            <span ref={popupRef} data-popup-container style={popupStyle(isError)}>
                                <div style={popupHeaderStyle}>
                                    <span>{getErrorLabel(isError)}</span>
                                </div>
                                <button
                                    style={pronunciationButtonStyle(isError)}
                                    onClick={handlePlayPronunciation}
                                    disabled={isLoadingAudio}
                                >
                                    {isLoadingAudio ? '⏳' : isPlayingAudio ? '⏸' : '▶'}
                                    <span style={{ marginLeft: '6px' }}>
                                        {isLoadingAudio ? 'Загрузка...' : 'Послушать'}
                                    </span>
                                </button>
                                <span style={popupArrowStyle(isError)}></span>
                            </span>
                        )}
                    </span>
                );
            }
            return <span key={index}>{word} </span>;
        });
    };

    const controlsStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: isCompact ? '10px' : '16px',
        marginTop: '24px',
        flexWrap: 'wrap'
    };

    const pillButtonBase = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: isCompact ? '9px 16px' : '10px 22px',
        borderRadius: 18,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        fontSize: isCompact ? '13px' : '14px',
        fontWeight: 600,
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.7) inset',
        transition: 'background-color 0.15s ease, opacity 0.15s ease'
    };

    const primaryButtonStyle = {
        ...pillButtonBase,
        background: '#E19EFB',
        color: '#FFFFFF',
        minWidth: isCompact ? '190px' : '210px'
    };

    const secondaryButtonStyle = {
        ...pillButtonBase,
        background: '#F4F4F4',
        color: '#555555',
        minWidth: isCompact ? '130px' : '150px'
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
            <audio 
                ref={audioRef} 
                onEnded={handleAudioEnd}
                onPlay={() => setIsPlayingAudio(true)}
                onPause={() => setIsPlayingAudio(false)}
                style={{ display: 'none' }}
            />
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
                            <span style={{ fontSize: 14 }}>▶</span>
                            <span>Перечитать ошибки</span>
                        </button>
                        <button
                            style={secondaryButtonStyle}
                            onClick={() => navigate('/texts')}
                        >
                            <span style={{ fontSize: 16 }}>✕</span>
                            <span>Выход</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecordingResults;

