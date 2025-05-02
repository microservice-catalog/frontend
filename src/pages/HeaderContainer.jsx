// src/components/Header/HeaderContainer.jsx
import React from 'react';
import HeaderView from './HeaderView';
import {useAuth} from "../context/AuthContext.jsx";

function HeaderContainer() {
    const {user, logout, isAuthenticated} = useAuth();

    return (
        <HeaderView
            avatarUrl={!isAuthenticated ? undefined : user.avatarUrl}
            username={!isAuthenticated ? undefined : user.username}
            isAuthenticated={isAuthenticated}
            onLogout={() => logout()}
        />
    );
}

export default HeaderContainer;