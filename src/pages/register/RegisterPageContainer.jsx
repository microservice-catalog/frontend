// src/pages/Register/RegisterPageContainer.jsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Divider, Paper, Stack, TextField, Typography} from '@mui/material';
// импорт API регистрации
import {authApi} from '../../context/api/api.jsx'; // путь может отличаться в вашем проекте :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

function RegisterPageContainer() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 1) Простая валидация до отправки
        if (!username.trim()) {
            setError('Введите имя пользователя');
            return;
        }
        if (!email.trim()) {
            setError('Введите email');
            return;
        }
        // базовая проверка формата email
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            setError('Неверный формат email');
            return;
        }
        if (!password) {
            setError('Введите пароль');
            return;
        }
        if (password !== passwordConfirm) {
            setError('Пароли не совпадают');
            return;
        }

        // 2) Отправка на бэкенд
        setSubmitting(true);
        try {
            await authApi.register({username, email, password});
            // по успешной регистрации — на логин
            navigate('/login', {state: {justRegistered: true}});
        } catch (err) {
            // ловим customMessage из Axios-интерсептора
            setError(err.customMessage || 'Ошибка при регистрации, попробуйте ещё раз');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{mt: 8, p: 4}}>
                <Typography variant="h5" align="center" gutterBottom>
                    Создать аккаунт
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя пользователя"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Подтвердите пароль"
                            type="password"
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            fullWidth
                        />

                        {/* рамочка для ошибок */}
                        {error && (
                            <Box
                                sx={{
                                    border: '1px solid #d32f2f',
                                    borderRadius: 1,
                                    p: 1,
                                    backgroundColor: '#ffebee'
                                }}
                            >
                                <Typography variant="body2" color="error" align="center">
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={{my: 3}}/>

                <Box textAlign="center">
                    <Typography variant="body2">
                        Уже есть аккаунт?{' '}
                        <Button size="small" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPageContainer;
