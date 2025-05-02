import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Avatar, Box, Button, IconButton, Menu, MenuItem, Skeleton, Stack} from "@mui/material";

const DEFAULT_AVATAR_URL = '/vite.svg';

function ProfileView({isAuthenticated, avatarUrl, onLogout}) {
    // После загрузки — если не авторизован, показываем две кнопки
    if (!isAuthenticated) {
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

    // Авторизован — подгружаем и показываем аватар + меню
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

    const avatarSx = {ml: 1, mr: 1, p: 1};

    return (
        <Box>
            {avatarLoading ? (
                <Skeleton variant="circular" sx={avatarSx} width={40} height={40} />
            ) : (
                <IconButton onClick={handleAvatarClick} sx={avatarSx}>
                    <Avatar src={imgSrc} alt={"userAvatar"}/>
                </IconButton>
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Личный кабинет
                </MenuItem>
                <MenuItem component={Link} to="/catalog" onClick={handleMenuClose}>
                    Каталог
                </MenuItem>
                <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>
                    Создать сервис
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onLogout();
                        handleMenuClose();
                    }}
                >
                    Выйти
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default ProfileView;
