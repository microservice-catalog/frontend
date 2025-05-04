// src/components/TagList.jsx
import React from 'react';
import {Chip, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';

// Список фиксированных цветов для популярных тегов
const FIXED_TAG_COLORS = {
    java: '#f89820',
    javascript: '#f0db4f',
    python: '#306998',
    ruby: '#cc342d',
    go: '#00add8',
    'c#': '#178600',
    'c++': '#00599c',
    php: '#777bb4',
    typescript: '#3178c6',
    kotlin: '#0095d5',
    swift: '#fa7343',
    rust: '#dea584',
    scala: '#db3226',
    sql: '#3f5dab',
    html: '#e34f26',
    css: '#264de4',
    react: '#61dafb',
    vue: '#41b883',
    angular: '#dd1b16',
    'node.js': '#339933',
    docker: '#2496ed',
    mysql: '#4479a1',
    mongodb: '#47a248',
    graphql: '#e10098',
    aws: '#ff9900',
    azure: '#0089d6',
};

/**
 * Генерация цвета на основе названия тега.
 * Хэшим строку, получаем hue, фиксируем saturation и lightness.
 */
function generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 70; // % насыщенности
    const lightness = 50;  // % яркости
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Компонент списка тегов с цветными Chip.
 * Фиксированные теги получают предопределённый цвет,
 * остальные — генерируются на основе их названия.
 */
export default function TagList({tags, onTagClick}) {
    const theme = useTheme();

    return (
        <Stack direction="row" spacing={1} flexWrap="wrap">
            {tags.map(tag => {
                const lower = tag.toLowerCase();
                const bg = FIXED_TAG_COLORS[lower] || generateColorFromString(tag);
                const color = theme.palette.getContrastText(bg);

                return (
                    <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={() => onTagClick?.(tag)}
                        sx={{
                            backgroundColor: bg,
                            color,
                            cursor: onTagClick ? 'pointer' : 'default',
                        }}
                    />
                );
            })}
        </Stack>
    );
}