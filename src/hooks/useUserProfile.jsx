// src/hooks/useUserProfile.jsx
import {useEffect, useState} from 'react';
import {userApi} from '../api/api.jsx';

export function useUserProfile(username) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        userApi.getUserProfile(username)
            .then(res => setProfile(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [username]);

    return {profile, loading, error};
}
