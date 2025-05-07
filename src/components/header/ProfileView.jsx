// src/components/Header/ProfileView.jsx
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, IconButton, Menu, MenuItem, Skeleton, Stack, Typography} from '@mui/material';
import {useThemeContext} from '../../context/ThemeContext.jsx';
import ThemeSwitch from '../common/ThemeSwitch.jsx';
import AvatarWithFallback from '../common/AvatarWithFallback.jsx';

const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

function ProfileGuest() {
    return (
        <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/login">
                Войти
            </Button>
            <Button color="inherit" component={Link} to="/register">
                Регистрация
            </Button>
        </Stack>
    );
}

function ProfileAuth({avatarUrl, onLogout, username}) {
    const {mode, toggleMode} = useThemeContext();
    const [anchorEl, setAnchorEl] = useState(null);
    const [imgSrc, setImgSrc] = useState(avatarUrl || DEFAULT_AVATAR_URL);
    const [avatarLoading, setAvatarLoading] = useState(!!avatarUrl);

    useEffect(() => {
        if (!avatarUrl) {
            setImgSrc(DEFAULT_AVATAR_URL);
            setAvatarLoading(false);
            return;
        }
        setAvatarLoading(true);
        const img = new Image();
        img.src = avatarUrl;
        img.onload = () => {
            setImgSrc(avatarUrl);
            setAvatarLoading(false);
        };
        img.onerror = () => {
            setImgSrc(DEFAULT_AVATAR_URL);
            setAvatarLoading(false);
        };
    }, [avatarUrl]);

    const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    return (
        <Box>
            {avatarLoading ? (
                <Skeleton variant="circular" width={40} height={40} onClick={handleAvatarClick}/>
            ) : (
                <IconButton onClick={handleAvatarClick} size="large">
                    <AvatarWithFallback src={imgSrc} alt="User Avatar"/>
                </IconButton>
            )}

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

export default function ProfileView({isAuthenticated, avatarUrl, onLogout, username}) {
    return isAuthenticated ? (
        <ProfileAuth avatarUrl={avatarUrl} onLogout={onLogout} username={username}/>
    ) : (
        <ProfileGuest/>
    );
}
