// src/hooks/useUserProjects.jsx
import {useEffect, useState} from 'react';
import {projectApi} from '../api/api.jsx';

/**
 * Хук для загрузки публичных проектов пользователя с пагинацией
 * @param {string} username
 * @param {number} page
 * @param {number} size
 */
export function useUserProjects(username, page, size) {
    const [publicProjects, setPublicProjects] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username) {
            setPublicProjects([]);
            setTotalPages(0);
            setLoading(false);
            return;
        }
        setLoading(true);
        projectApi.getUserProjects(username, page, size)
            .then(res => {
                const data = res.data;
                // content должен быть массивом проектов
                setPublicProjects(Array.isArray(data.content) ? data.content : []);
                setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : 0);
            })
            .catch(err => {
                console.error(err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [username, page, size]);

    return {publicProjects, totalPages, loading, error};
}
