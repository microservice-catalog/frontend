// src/components/common/ThemeSwitch.jsx
import React from 'react';
import {styled} from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const AnimatedSwitch = styled(Switch)(({theme}) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        padding: 1,
        transform: 'translateX(6px)',
        transition: theme.transitions.create('transform', {duration: 300}),
        '&.Mui-checked': {
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                content: '"🌙"',
            },
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: '"☀️"',
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        backgroundColor: theme.palette.mode === 'dark' ? '#aab4be' : '#8796A5',
        opacity: 1,
    },
}));

export default function ThemeSwitch({checked, onChange}) {
    return <AnimatedSwitch checked={checked} onChange={onChange}/>;
}
