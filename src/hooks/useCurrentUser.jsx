import {useQuery} from 'react-query'
import {userApi} from '../api/api.jsx'
import {useEffect, useState} from "react";

export function useCurrentUser() {
    const [username, setUsername] = useState(null);

    const fetchUsername = async () => {
        const me = await userApi.getMe();
        return me.data.username;
    }

    useEffect(() => {
        setUsername(fetchUsername());
        alert(username);
    }, []);

    return useQuery(
        'currentUser',
        () => userApi.getProfileShortData(username).then(r => r.data)
    )
}
