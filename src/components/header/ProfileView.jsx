// src/components/Header/ProfileView.jsx
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, IconButton, Menu, MenuItem, Stack, Typography, useTheme} from '@mui/material';
import {useThemeContext} from '../../context/ThemeContext.jsx';
import ThemeSwitch from '../common/ThemeSwitch.jsx';
import AvatarWithFallback from '../common/AvatarWithFallback.jsx';
import {API_URLS} from "../../api/urls.jsx";
import {useImageLoader} from "../../hooks/useImageLoader.jsx";

const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

function ProfileGuest() {
    return (
        <Stack color="inherit" direction="row" spacing={1}>
            <Button variant="outlined" component={Link} to="/login">
                Войти
            </Button>
            <Button variant="contained" component={Link} to="/register">
                Регистрация
            </Button>
        </Stack>
    );
}

function ProfileAuth({avatarUrl, onLogout, username, onCreateProject}) {
    const {mode, toggleMode} = useThemeContext();
    const [anchorEl, setAnchorEl] = useState(null);

    const fullUrl = avatarUrl ? (
            avatarUrl.startsWith('http')
                ? avatarUrl
                : (`${API_URLS.PHOTOS}/${avatarUrl.split('/').pop()}`)
        )
        : null;

    const {src: imgSrc, loading: avatarLoading} = useImageLoader(
        fullUrl,
        DEFAULT_AVATAR_URL
    );

    const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    return (
        <Box display="flex">
            <Button variant="contained" onClick={onCreateProject} sx={{mr: 1, my: 1, px: 1, py: '1px'}}>
                Создать сервис
            </Button>
            <IconButton onClick={handleAvatarClick} size="large">
                <AvatarWithFallback src={imgSrc} size={40} extraLoading={avatarLoading}
                                    alt="User Avatar2"/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem component={Link} to={`/${username}`} onClick={handleMenuClose}>
                    Профиль
                </MenuItem>
                <MenuItem>
                    <Stack direction="row" alignItems="center" spacing={1} width="100%">
                        <Typography variant="body2">
                            {mode === 'light' ? 'Светлая тема' : 'Тёмная тема'}
                        </Typography>
                        <Box sx={{flexGrow: 1}}/>
                        <ThemeSwitch checked={mode === 'dark'} onChange={toggleMode}/>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleLogout} component={Link} to="/login">
                    Выйти
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default function ProfileView({isAuthenticated, avatarUrl, onLogout, username, onCreateProject}) {
    const theme = useTheme();
    return isAuthenticated ? (
        <ProfileAuth
            sx={{color: theme.palette.text.primary}}
            avatarUrl={avatarUrl}
            onLogout={onLogout}
            username={username}
            onCreateProject={onCreateProject}
        />
    ) : (
        <ProfileGuest sx={{color: theme.palette.text.primary}}/>
    );
}
