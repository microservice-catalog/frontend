// src/pages/Login/LoginPageContainer.jsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Paper, Stack, TextField, Typography} from '@mui/material';
import {useAuth} from '../../context/AuthContext.jsx';

function LoginPageContainer() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {user, login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Валидация до отправки
        if (!username.trim()) {
            setError('Пожалуйста, введите имя пользователя');
            return;
        }
        if (!password.trim()) {
            setError('Пожалуйста, введите пароль');
            return;
        }

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.log(err)
            setError(err.customMessage || 'Не удалось войти, попробуйте ещё раз');
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{mt: 8, p: 4}}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя пользователя"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                        />

                        {/* Ошибка в отдельной рамочке */}
                        {error && (
                            <Box
                                sx={theme => ({
                                    border: `1px solid ${theme.palette.error.main}`,
                                    borderRadius: 1,
                                    p: 1,
                                    backgroundColor: theme.palette.error.light,
                                    mt: 1,
                                })}
                            >
                                <Typography
                                    variant="body2"
                                    sx={theme => ({color: theme.palette.error.contrastText})}
                                    align="center"
                                >
                                    {error}
                                </Typography>
                            </Box>
                        )}


                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                        >
                            Войти
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPageContainer;
