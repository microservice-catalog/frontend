import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ProfileButtons from "./ProfileButtons.jsx";
import {Box} from "@mui/material";


function HeaderView({username, avatarUrl, isAuthenticated, onLogout}) {

    return (
        <AppBar position="static" className="header-appbar">
            <Toolbar className="header-toolbar">
                <Typography variant="h6" className="header-title">
                    Dockins
                </Typography>

                {isAuthenticated ? (
                    <>
                        {/* Навигационные кнопки */}
                        <Button color="inherit" component={Link} to="/dashboard">
                            Личный кабинет
                        </Button>
                        <Button color="inherit" component={Link} to="/catalog">
                            Каталог
                        </Button>
                        <Button color="inherit" component={Link} to="/service/new">
                            Создать сервис
                        </Button>
                        <Button color="inherit" onClick={onLogout}>
                            Выйти
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <ProfileButtons avatarUrl={avatarUrl} username={username}
                                        onLogout={onLogout}></ProfileButtons>
                    </>
                ) : (
                    <>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button color="inherit" component={Link} to="/login">
                            Войти
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default HeaderView;
