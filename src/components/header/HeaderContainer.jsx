// src/components/Header/HeaderContainer.jsx
import React from 'react';
import HeaderView from './HeaderView.jsx';
import {useAuth} from "../../context/AuthContext.jsx";

function HeaderContainer() {
    const {user, logout, isAuthenticated, loading} = useAuth();

    return (
        <HeaderView
            avatarUrl={undefined}
            username={undefined}
            isAuthenticated={isAuthenticated}
            onLogout={() => logout()}
            loading={loading}
        />
    );
}

export default HeaderContainer;