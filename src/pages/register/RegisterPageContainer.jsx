// src/pages/Register/RegisterPageContainer.jsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Divider, Paper, Stack, TextField, Typography} from '@mui/material';
// импорт API регистрации и подтверждения
import {authApi} from '../../api/api.jsx';

// CSS-реализация анимации "shake" для sx
const shakeAnimation = {
    '@keyframes shake': {
        '0%': {transform: 'translateX(0)'},
        '25%': {transform: 'translateX(-5px)'},
        '75%': {transform: 'translateX(5px)'},
        '100%': {transform: 'translateX(0)'},
    },
    animation: 'shake 0.3s',
};

// Компонент подтверждения email
function ConfirmEmail({email, confirmCode, setConfirmCode, onConfirm, onResend, isConfirming, error}) {
    return (
        <Box>
            <Typography variant="h6" align="center" gutterBottom>
                Подтверждение почты
            </Typography>
            <Typography variant="body2" align="center" gutterBottom>
                Код отправлен на {email}
            </Typography>
            <Stack spacing={2}>
                <TextField
                    label="Код подтверждения"
                    value={confirmCode}
                    onChange={e => setConfirmCode(e.target.value)}
                    fullWidth
                />
                {error && (
                    <Typography variant="body2" color="error" align="center">
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={isConfirming || !confirmCode.trim()}
                    fullWidth
                >
                    {isConfirming ? 'Подтверждение...' : 'Подтвердить'}
                </Button>
                <Button
                    variant="text"
                    onClick={onResend}
                    disabled={isConfirming}
                >
                    Отправить код повторно
                </Button>
            </Stack>
        </Box>
    );
}

function RegisterPageContainer() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [shakeUsername, setShakeUsername] = useState(false);
    const [shakePassword, setShakePassword] = useState(false);

    // для подтверждения почты
    const [showConfirm, setShowConfirm] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [confirmCode, setConfirmCode] = useState('');
    const [isConfirming, setConfirming] = useState(false);
    const navigate = useNavigate();

    // Обработчик регистрации
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        // валидация
        if (username.trim().length < 5) {
            setError('Имя пользователя должно содержать не менее 5 символов');
            return;
        }
        if (!email.trim()) {
            setError('Введите email');
            return;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            setError('Неверный формат email');
            return;
        }
        if (password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            return;
        }
        if (password !== passwordConfirm) {
            setError('Пароли не совпадают');
            return;
        }

        setSubmitting(true);
        try {
            // отправляем запрос регистрации, backend шлёт код на почту
            await authApi.register({username: username.trim(), email: email.trim(), password});
            setRegisteredEmail(email.trim());
            setShowConfirm(true);
        } catch (err) {
            setError(err.customMessage || 'Ошибка при регистрации, попробуйте ещё раз');
        } finally {
            setSubmitting(false);
        }
    };

    // Обработчик подтверждения кода
    const handleConfirm = async () => {
        setError('');
        setConfirming(true);
        try {
            await authApi.confirmEmail({email: registeredEmail, code: confirmCode.trim()});
            navigate('/login', {state: {justRegistered: true}});
        } catch (err) {
            setError(err.customMessage || 'Ошибка подтверждения, проверьте код');
        } finally {
            setConfirming(false);
        }
    };

    // Обработчик повторной отправки кода
    const handleResend = async () => {
        setError('');
        setSubmitting(true);
        try {
            await authApi.register({username: username.trim(), email: registeredEmail, password});
        } catch (err) {
            setError('Не удалось отправить код повторно');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{mt: 8, p: 4}}>
                {!showConfirm ? (
                    <>
                        <Typography variant="h5" align="center" gutterBottom>
                            Создать аккаунт
                        </Typography>
                        <Box component="form" onSubmit={handleRegister}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Имя пользователя"
                                    value={username}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val.length <= 30) setUsername(val);
                                        else setShakeUsername(true);
                                    }}
                                    error={!!error && username.trim().length < 5}
                                    helperText={username && username.trim().length < 5 ? 'Не менее 5 символов' : ''}
                                    inputProps={{maxLength: 30}}
                                    sx={shakeUsername ? shakeAnimation : {}}
                                    onAnimationEnd={() => setShakeUsername(false)}
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
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val.length <= 255) setPassword(val);
                                        else setShakePassword(true);
                                    }}
                                    error={!!error && password.length > 0 && password.length < 8}
                                    helperText={password && password.length < 8 ? 'Не менее 8 символов' : ''}
                                    inputProps={{maxLength: 255}}
                                    sx={shakePassword ? shakeAnimation : {}}
                                    onAnimationEnd={() => setShakePassword(false)}
                                    fullWidth
                                />
                                <TextField
                                    label="Подтвердите пароль"
                                    type="password"
                                    value={passwordConfirm}
                                    onChange={e => setPasswordConfirm(e.target.value)}
                                    inputProps={{maxLength: 255}}
                                    fullWidth
                                />
                                {error && (
                                    <Box sx={theme => ({
                                        border: `1px solid ${theme.palette.error.main}`,
                                        borderRadius: 1,
                                        p: 1,
                                        backgroundColor: theme.palette.error.light,
                                    })}>
                                        <Typography variant="body2"
                                                    sx={theme => ({color: `${theme.palette.error.contrastText}`})}
                                                    align="center">
                                            {error}
                                        </Typography>
                                    </Box>
                                )}
                                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                                </Button>
                            </Stack>
                        </Box>
                    </>
                ) : (
                    <ConfirmEmail
                        email={registeredEmail}
                        confirmCode={confirmCode}
                        setConfirmCode={setConfirmCode}
                        onConfirm={handleConfirm}
                        onResend={handleResend}
                        isConfirming={isConfirming}
                        error={error}
                    />
                )}
                {!showConfirm && (
                    <>
                        <Divider sx={{my: 3}}/>
                        <Box textAlign="center">
                            <Typography variant="body2">
                                Уже есть аккаунт?{' '}
                                <Button size="small" onClick={() => navigate('/login')}>
                                    Войти
                                </Button>
                            </Typography>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}

export default RegisterPageContainer;
