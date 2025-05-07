// src/hooks/useImageLoader.jsx
import {useEffect, useState} from 'react';

export function useImageLoader(rawUrl, defaultUrl) {
    const [src, setSrc] = useState(defaultUrl);
    const [loading, setLoading] = useState(!!rawUrl);

    useEffect(() => {
        // если нет URL — сразу возвращаем дефолт
        if (!rawUrl) {
            setSrc(defaultUrl);
            setLoading(false);
            return;
        }

        setLoading(true);
        const img = new Image();
        img.src = rawUrl;

        img.onload = () => {
            setSrc(rawUrl);
            setLoading(false);
        };
        img.onerror = () => {
            setSrc(defaultUrl);
            setLoading(false);
        };

        // на unmount отписываться не надо, браузер просто забудет старый Image
    }, [rawUrl, defaultUrl]);

    return {src, loading};
}
