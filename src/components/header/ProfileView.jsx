// ProfileView.jsx
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Avatar, Box, Button, IconButton, Menu, MenuItem, Skeleton, Stack,} from '@mui/material';

const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

function ProfileGuest() {
    return (
        <Stack direction="row" spacing={1}>
            <Button
                color="inherit"
                component={Link}
                to="/login"
            >
                Войти
            </Button>
            <Button
                color="inherit"
                component={Link}
                to="/register"
            >
                Регистрация
            </Button>
        </Stack>
    );
}

function ProfileAuth({avatarUrl, onLogout}) {
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

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        onLogout();
    };

    return (
        <Box>
            {avatarLoading ? (
                <Skeleton variant="circular" width={40} height={40}/>
            ) : (
                <IconButton onClick={handleAvatarClick} size="large">
                    <Avatar src={imgSrc} alt="User Avatar"/>
                </IconButton>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Профиль
                </MenuItem>
                <MenuItem component={Link} to="/login" onClick={handleLogout}>
                    Выйти
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default function ProfileView({isAuthenticated, avatarUrl, onLogout}) {
    return isAuthenticated ? (
        <ProfileAuth avatarUrl={avatarUrl} onLogout={onLogout}/>
    ) : (
        <ProfileGuest/>
    );
}
