// src/pages/Register/ConfirmEmailPage.jsx
import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Box, Button, Container, Link, Paper, Stack, TextField, Typography} from '@mui/material';
import {authApi} from '../../context/api/api.jsx';

function ConfirmEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // ожидание: email передаван в state при регистрации или запросе подтверждения
    const email = location.state?.email || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);
    const [isResending, setResending] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault();
        setError('');

        if (!code.trim() || code.trim().length !== 6) {
            setError('Введите корректный 6-значный код');
            return;
        }

        setSubmitting(true);
        try {
            await authApi.confirmEmail({email, code: code.trim()});
            navigate('/login', {state: {confirmed: true}});
        } catch (err) {
            setError(err.customMessage || 'Неверный код, попробуйте ещё раз');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await authApi.resendConfirmation({email});
        } catch (err) {
            console.error('Ошибка при повторной отправке кода', err);
        } finally {
            setResending(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{mt: 8, p: 4}}>
                <Typography variant="h5" align="center" gutterBottom>
                    Подтверждение почты
                </Typography>

                <Typography variant="body2" align="center" sx={{mb: 2}}>
                    Введите 6-значный код, отправленный на {email}.
                </Typography>

                <Box component="form" onSubmit={handleConfirm}>
                    <Stack spacing={2}>
                        <TextField
                            label="Код подтверждения"
                            value={code}
                            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                            inputProps={{maxLength: 6, inputMode: 'numeric'}}
                            error={!!error}
                            helperText={error}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Проверка...' : 'Подтвердить'}
                        </Button>

                        <Box textAlign="center">
                            <Typography variant="body2">
                                Не получили код?{' '}
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleResend}
                                    disabled={isResending}
                                >
                                    {isResending ? 'Отправляем...' : 'Отправить заново'}
                                </Link>
                            </Typography>
                        </Box>

                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}

export default ConfirmEmailPage;
