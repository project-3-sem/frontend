import React from 'react';
import { Link } from 'react-router-dom';

function Header({ background = '#e9b6f2', animated = true }) {
    const animationStyles = `
        @keyframes headerFadeIn {
            0% {
                opacity: 0;
                transform: translateY(-12px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    const baseStyle = {
        background,
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        opacity: animated ? 0 : 1,
        animation: animated ? 'headerFadeIn 0.8s ease-out forwards' : 'none'
    };

    const textBase = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 800,
        fontSize: '32px',
        lineHeight: '100%',
        letterSpacing: '0.06em'
    };

    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        textDecoration: 'none',
        color: 'inherit',
        width: '100%',
        height: '100%',
        cursor: 'pointer'
    };

    const logoStyle = {
        width: '42.999996185302734px',
        height: '45.38893127441406px',
        position: 'absolute',
        top: '19px',
        left: '23px'
    };

    return (
        <>
            {animated && <style>{animationStyles}</style>}
            <div style={baseStyle}>
                <Link to="/" style={linkStyle} aria-label="Вернуться на главную">
                    <img src="/logo.png" alt="logo" style={logoStyle} />
                    <span style={{ ...textBase, color: '#000000' }}>LING </span>
                    <span style={{ ...textBase, color: '#DB80FF' }}>AI</span>
                </Link>
            </div>
        </>
    );
}

export default Header;
