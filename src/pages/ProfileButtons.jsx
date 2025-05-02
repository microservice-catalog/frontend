import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

// Абстрактный URL для дефолтной аватарки
const DEFAULT_AVATAR_URL = '/vite.svg';

function ProfileButtons({username = "user", avatarUrl, onLogout}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [imgSrc, setImgSrc] = useState(avatarUrl || DEFAULT_AVATAR_URL);
    const [loading, setLoading] = useState(!!avatarUrl);

    useEffect(() => {
        if (!avatarUrl) {
            setImgSrc(DEFAULT_AVATAR_URL);
            setLoading(false);
            return;
        }
        setLoading(true);
        const img = new Image();
        img.src = avatarUrl;
        img.onload = () => {
            setImgSrc(avatarUrl);
            setLoading(false);
        };
        img.onerror = () => {
            setImgSrc(DEFAULT_AVATAR_URL);
            setLoading(false);
        };
    }, [avatarUrl]);

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const avatarSx = {ml: 1, mr: 1, p: 1};
    return (
        <div>
            {/* Аватарка с skeleton-плейсхолдером */}
            {loading ? (
                <Skeleton variant="circular" sx={avatarSx} width={40} height={40} />
            ) : (
                <IconButton onClick={handleAvatarClick} sx={avatarSx}>
                    <Avatar src={imgSrc} alt={username} />
                </IconButton>
            )}

            {/* Меню по клику на аватарку */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
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
        </div>
    );
}

export default ProfileButtons;