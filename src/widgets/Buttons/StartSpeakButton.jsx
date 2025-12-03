import React from 'react';
import { Button, Box } from '@mui/material';

function StartSpeakButton({ onClick }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '420px',
        height: '96px',
        opacity: 0,
        animation: 'startButtonFadeIn 1s ease-out 0.5s forwards',
        '@keyframes startButtonFadeIn': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        '@media (max-width: 1024px)': {
          height: '88px',
        },
        '@media (max-width: 640px)': {
          maxWidth: '360px',
          height: '72px',
        },
      }}
    >
      <Button
        type="button"
        onClick={onClick}
        sx={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '15px',
          background: '#E19EFB',
          color: '#FFFFFF',
          fontFamily:
            'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: '32px',
          lineHeight: '100%',
          letterSpacing: 0,
          textTransform: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            background: '#E19EFB',
            opacity: 0.9,
          },
          '@media (max-width: 1024px)': {
            fontSize: '28px',
          },
          '@media (max-width: 640px)': {
            fontSize: '24px',
          },
        }}
      >
        Начните говорить
      </Button>
    </Box>
  );
}

export default StartSpeakButton;


