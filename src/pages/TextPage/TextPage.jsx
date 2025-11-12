import React from 'react';
import Header from '../../widgets/Header/Header.jsx';

const sections = [
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
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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

    return (
        <div style={pageStyle}>
            <Header background="#FFFFFF" animated={false} />
            <div style={contentStyle}>
                <h1 style={titleStyle}>Выберите текст</h1>
                <p style={subtitleStyle}>Подберите подходящий по сложности и теме текст для тренировки произношения.</p>
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

                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="tp-section"
                        style={{ background: section.bannerColor }}
                    >
                        <div className="tp-section__header">
                            <span style={badgeStyle(section.labelColor)}>{section.title}</span>
                        </div>
                        <div className="tp-section__grid">
                            {section.texts.map((textItem, index) => (
                                <div key={`${section.id}-${index}`} className="tp-card" style={cardStyle}>
                                    <p style={cardTitleStyle}>{textItem.title}</p>
                                    <p style={cardBodyStyle}>{textItem.body}</p>
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

