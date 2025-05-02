// src/components/Header/HeaderContainer.jsx
import React from 'react';
import HeaderView from './HeaderView';
import {useAuth} from "../context/AuthContext.jsx";

function HeaderContainer() {
    const { user, logout } = useAuth();

    return (
        <HeaderView
            avatarUrl={user == null ? undefined : user.avatarUrl}
            username={user == null ? null : user.username}
            isAuthenticated={!(user == null)}
            onLogout={() => logout()}
        />
    );
}

export default HeaderContainer;