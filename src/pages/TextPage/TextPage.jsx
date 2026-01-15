import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/Header/Header.jsx';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
// Нормализуем base URL: убираем trailing slash и необязательный /api в конце
const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/$/, '').replace(/\/api$/, '');
const TEXTS_ENDPOINT = `${API_BASE_URL}/api/texts/`;

const FALLBACK_SECTIONS = [
    {
        id: 'easy',
        title: 'Лёгкий',
        bannerColor: '#DFF6E2',
        labelColor: '#7ACF84',
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
        bannerColor: '#FFF6CF',
        labelColor: '#E7C35A',
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
        bannerColor: '#FFD3D3',
        labelColor: '#F47B7B',
        texts: [
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' },
            { title: 'De Finibus', body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et ...' }
        ]
    }
];

function TextPage() {
    const navigate = useNavigate();
    const [sections, setSections] = React.useState(FALLBACK_SECTIONS);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        // Загружаем кэш для мгновенного отображения (опционально)
        const cached = sessionStorage.getItem('lingai_sections');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) {
                    setSections(parsed);
                }
            } catch (e) {
                console.error('Failed to parse cached sections', e);
            }
        }

        // Запрашиваем свежие данные с бэкенда
        const fetchSections = async () => {
            try {
                setIsLoading(true);
                setError(null);

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
                console.error('Error loading sections from backend', e);
                setError('Не удалось загрузить тексты. Показаны примеры.');
                if (!cached) {
                    setSections(FALLBACK_SECTIONS);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchSections();
    }, []);

    const pageStyle = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#FFFFFF',
        minHeight: '100vh'
    };

    const contentStyle = {
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '48px 24px 80px'
    };

    const titleStyle = {
        margin: 0,
        fontWeight: 800,
        fontSize: '40px',
        letterSpacing: '0.04em',
        color: '#1F1F1F'
    };

    const subtitleStyle = {
        marginTop: '12px',
        marginBottom: '12px',
        fontWeight: 500,
        fontSize: '18px',
        letterSpacing: '0.04em',
        color: 'rgba(31, 31, 31, 0.6)'
    };

    const dividerStyle = {
        width: '100%',
        height: '2px',
        background: '#000000',
        marginBottom: '36px'
    };

    const badgeStyle = (color) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '96px',
        height: '32px',
        padding: '0 16px',
        borderRadius: '999px',
        fontWeight: 600,
        fontSize: '14px',
        letterSpacing: '0.06em',
        background: color,
        color: '#1F1F1F'
    });

    const cardStyle = {
        background: '#F6E1FF',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 12px 24px rgba(58, 62, 74, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        maxHeight: '180px',
        overflow: 'hidden'
    };

    const handleCardClick = (sectionId, textIndex) => {
        navigate(`/text/${sectionId}/${textIndex}`);
    };

    const cardTitleStyle = {
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '0.04em',
        margin: 0,
        color: '#1F232B'
    };

    const cardBodyStyle = {
        fontWeight: 500,
        fontSize: '14px',
        letterSpacing: '0.02em',
        lineHeight: 1.55,
        margin: 0,
        color: '#2B303A'
    };

    // Функция для обрезки текста до превью для карточек
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        // Обрезаем до последнего пробела перед maxLength, чтобы не обрезать слово
        const truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
    };

    return (
        <div style={pageStyle}>
            <Header background="#FFFFFF" animated={false} />
            <div style={contentStyle}>
                <h1 style={titleStyle}>Выберите текст</h1>
                <p style={subtitleStyle}>Подберите подходящий по сложности и теме текст для тренировки произношения.</p>
                {isLoading && <p style={{ marginTop: '8px', fontSize: '14px', color: 'rgba(31, 31, 31, 0.6)' }}>Загружаем тексты...</p>}
                {error && !isLoading && <p style={{ marginTop: '8px', fontSize: '13px', color: '#D32F2F' }}>{error}</p>}
                <div style={dividerStyle}></div>

                <style>{`
                    .tp-section {
                        margin-bottom: 36px;
                        border-radius: 28px;
                        padding: 32px 36px 36px;
                    }
                    .tp-section__header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 16px;
                    }
                    .tp-section__grid {
                        margin-top: 28px;
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0, 1fr));
                        gap: 18px;
                    }
                    .tp-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 12px 26px rgba(111, 66, 193, 0.18);
                    }
                    @media (max-width: 1200px) {
                        .tp-section__grid {
                            grid-template-columns: repeat(3, minmax(0, 1fr));
                        }
                    }
                    @media (max-width: 920px) {
                        .tp-section__grid {
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                        }
                    }
                    @media (max-width: 600px) {
                        .tp-section {
                            padding: 24px;
                        }
                        .tp-section__grid {
                            grid-template-columns: minmax(0, 1fr);
                        }
                    }
                `}</style>

                {sections && Array.isArray(sections) && sections.map((section) => (
                    <div
                        key={section.id}
                        className="tp-section"
                        style={{ background: section.bannerColor }}
                    >
                        <div className="tp-section__header">
                            <span style={badgeStyle(section.labelColor)}>{section.title}</span>
                        </div>
                        <div className="tp-section__grid">
                            {section.texts && Array.isArray(section.texts) && section.texts.map((textItem, index) => (
                                <div 
                                    key={`${section.id}-${index}`} 
                                    className="tp-card" 
                                    style={cardStyle}
                                    onClick={() => handleCardClick(section.id, index)}
                                >
                                    <p style={cardTitleStyle}>{textItem.title}</p>
                                    <p style={cardBodyStyle}>{truncateText(textItem.body, 100)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TextPage;

