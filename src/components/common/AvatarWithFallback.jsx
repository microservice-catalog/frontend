// src/components/common/AvatarWithFallback.jsx
import React, {useState} from 'react';
import {Avatar} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

/**
 * Avatar с проверкой загрузки изображения.
 * Если src не передан или загрузка не удалась, отображается заглушка.
 * Props:
 * - src: string | undefined
 * - alt: string
 * - size: number (диаметр аватара в пикселях)
 * - ...rest: любые остальные пропсы Avatar
 */
export default function AvatarWithFallback({src, alt, size = 40, ...rest}) {
    const [imgError, setImgError] = useState(false);

    const handleError = () => {
        setImgError(true);
    };

    // Если источник отсутствует или произошла ошибка загрузки, показываем иконку-заглушку
    const showFallback = imgError || !src;

    return (
        <Avatar
            src={showFallback ? undefined : src}
            alt={alt}
            onError={handleError}
            sx={{width: size, height: size}}
            {...rest}
        >
            {showFallback && <PersonIcon/>}
        </Avatar>
    );
}
