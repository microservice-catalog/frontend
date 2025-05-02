// src/components/HeaderView.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import {Box, Stack} from '@mui/material';
import ProfileView from "./ProfileView.jsx";

function HeaderView({username, avatarUrl, isAuthenticated, onLogout, loading}) {
    // Пока идёт проверка авторизации — показываем только скелетоны
    if (loading) {
        return (
            <AppBar position="static" className="header-appbar">
                <Toolbar className="header-toolbar">
                    {/* Скелетон для логотипа */}
                    <Skeleton variant="button" width={100} height={32} sx={{mr: 1}}/>

                    {/* Скелетоны для кнопок навигации */}
                    <Stack direction="row" spacing={1}>
                        {[...Array(4)].map((_, idx) => (
                            <Skeleton key={idx} variant="rectangular" width={80} height={32}/>
                        ))}
                    </Stack>

                    <Box sx={{flexGrow: 1}}/>

                    {/* Скелетон для аватарки */}
                    <Skeleton variant="circular" width={40} height={40}/>
                </Toolbar>
            </AppBar>
        );
    }

    // После загрузки — нормальный рендер
    return (
        <AppBar position="static" className="header-appbar">
            <Toolbar className="header-toolbar">
                <Typography variant="h6" className="header-title">
                    Dockins
                </Typography>

                {!loading && isAuthenticated && (
                    <>
                        <Button color="inherit" component={Link} to="/profile">
                            Профиль
                        </Button>
                        <Button color="inherit" component={Link} to="/catalog">
                            Каталог
                        </Button>
                        <Button color="inherit" component={Link} to="/projects">
                            Создать сервис
                        </Button>
                        <Button color="inherit" component={Link} to={`/${username}`}>
                            Мои проекты
                        </Button>
                    </>
                )}

                <Box sx={{flexGrow: 1}}/>

                <ProfileView
                    isAuthenticated={isAuthenticated}
                    avatarUrl={avatarUrl}
                    onLogout={onLogout}
                />
            </Toolbar>
        </AppBar>
    );
}

export default HeaderView;
