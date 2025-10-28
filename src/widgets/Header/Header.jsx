import React from 'react';

function Header() {
    const baseStyle = {
        background: '#e9b6f2',
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    };

    const textBase = {
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 800,
        fontSize: '32px',
        lineHeight: '100%',
        letterSpacing: '0.06em'
    };

    return (
        <div style={baseStyle}>
            <span style={{ ...textBase, color: '#000000' }}>LING </span>
            <span style={{ ...textBase, color: '#DB80FF' }}>AI</span>
        </div>
    );
}

export default Header;
