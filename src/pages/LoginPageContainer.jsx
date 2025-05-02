// src/pages/Login/LoginPageContainer.jsx
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {TextField, Button, Box, Typography, Stack, Container, Paper, Divider} from '@mui/material';
import {useAuth} from "../context/AuthContext.jsx";
import {authApi} from "../api/api.jsx";

function LoginPageContainer() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { user, login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(username, password);
        navigate('/')
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
                {/* Заголовок */}
                <Typography variant="h4" align="center" gutterBottom>
                    Войти в аккаунт
                </Typography>

                {/* Форма */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,      // равномерные отступы между полями
                    }}
                >
                    <TextField
                        label="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button type="submit" variant="contained" size="large">
                        Войти
                    </Button>
                </Box>

                {/* Разделитель */}
                <Divider sx={{ my: 3 }} />

                {/* Альтернативный вход */}
                <Stack spacing={2}>
                    <Typography variant="body2" align="center">
                        Быстрый вход для тестирования:
                    </Typography>
                    <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => login("user2", "password")}
                    >
                        Войти как <strong>user2</strong>
                    </Button>
                </Stack>

                {/* Статус пользователя */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                        Текущий пользователь:
                    </Typography>
                    <Typography variant="body2">
                        {user
                            ? <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(user, null, 2)}</pre>
                            : 'пользователь не залогинен'}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default LoginPageContainer;