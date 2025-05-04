// src/hooks/useUserProjects.jsx
import {useEffect, useState} from 'react';
import {projectApi} from '../api/api.jsx';

/**
 * Хук для загрузки публичных и приватных проектов пользователя с пагинацией
 * @param {string} username
 * @param {number} page
 * @param {number} size
 */
export function useUserProjects(username, page, size) {
    const [publicProjects, setPublicProjects] = useState([]);
    const [privateProjects, setPrivateProjects] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            projectApi.getUserProjects(username, page, size),
        ])
            .then(([response]) => {
                const pub = response.data.publicProjects;
                const priv = response.data.privateProjects;
                setPublicProjects(pub.content);
                setPrivateProjects(priv.content);
                // Предполагаем, что общее число страниц задаётся по публичным проектам
                setTotalPages(pub.totalPages);
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [username, page, size]);

    return {publicProjects, privateProjects, totalPages, loading, error};
}