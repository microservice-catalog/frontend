import React, {useEffect, useRef, useState} from 'react'
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {photoApi, userApi} from '../../api/api.jsx'
import {useUserProfile} from '../../hooks/useUserProfile.jsx'
import {CORE_BASE_URL} from '../../api/urls.jsx'
import AvatarWithFallback from "../../components/common/AvatarWithFallback.jsx";

export default function UserEditPage() {
    const {username} = useParams()
    const navigate = useNavigate()

    // 1) Получаем профиль
    const {
        profile,
        loading: loadingProfile,
        error: profileError,
        refetch: refetchProfile
    } = useUserProfile(username)

    // 2) Локальные стейты
    const [fullName, setFullName] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState('')
    const [currentPhotoId, setCurrentPhotoId] = useState(null)

    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [initialized, setInitialized] = useState(false)
    const [saving, setSaving] = useState(false)

    // Для отзыва objectURL
    const prevObjectUrl = useRef('')

    // 3) Пришёл профиль — инициализируем всё сразу
    useEffect(() => {
        if (!profile) return

        setFullName(profile.fullName || '')
        setDescription(profile.description || '')

        if (profile.avatarUrl) {
            const fullUrl = CORE_BASE_URL + profile.avatarUrl
            setPreview(fullUrl)
            setCurrentPhotoId(profile.avatarUrl.split('/').pop())
        }

        setInitialized(true)
    }, [profile])

    // 4) Если preview был objectURL — отзываем его при смене/анмаунте
    useEffect(() => {
        return () => {
            if (prevObjectUrl.current) {
                URL.revokeObjectURL(prevObjectUrl.current)
            }
        }
    }, [])

    // 5) Валидация
    const validate = () => {
        const errs = {}
        if (fullName.length > 255) errs.fullName = 'Максимум 255 символов'
        if (description.length > 255)
            errs.description = 'Максимум 255 символов'
        if (file) {
            if (!file?.type?.startsWith('image/'))
                errs.file = 'Нужно загрузить изображение'
            if (file.size > 5 * 1024 * 1024)
                errs.file = 'Максимальный размер 5 МБ'
        }
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    // 6) Новый файл выбран
    const handleFileChange = e => {
        const f = e.target.files[0]
        // отменяем предыдущую preview-ссылку
        if (prevObjectUrl.current) {
            URL.revokeObjectURL(prevObjectUrl.current)
        }
        if (f) {
            const url = URL.createObjectURL(f)
            prevObjectUrl.current = url

            setFile(f)
            setPreview(url)
            // отменяем «удалить на сервере»
            setCurrentPhotoId(null)
            // сбрасываем ошибки
            setErrors(err => ({...err, file: null}))
        }
    }

    // 7) Удаление фото (локально или на сервере)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const handleDeleteClick = () => {
        // если есть локальный файл — просто отменяем выбор
        if (file) {
            setFile(null)
            setPreview(profile.avatarUrl ? CORE_BASE_URL + profile.avatarUrl : '')
            return
        }
        // иначе спрашиваем подтверждение удаления на сервере
        setConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        setConfirmOpen(false)
        setSaving(true)
        setServerError('')
        try {
            await photoApi.deletePhoto(username, currentPhotoId)
            setPreview('')
            setCurrentPhotoId(null)
        } catch (e) {
            setServerError(e.response?.data?.message || e.message)
        } finally {
            setSaving(false)
        }
    }

    // 8) Сохранение
    const handleSubmit = async e => {
        e.preventDefault()
        setServerError('')
        if (!validate()) return

        setSaving(true)
        try {
            // 8.1 текст
            await userApi.updateUserProfile(username, {
                fullName,
                description
            })
            // 8.2 фото
            if (file) {
                const {data} = await photoApi.uploadPhoto(username, file)
                const url = data.url.startsWith('http')
                    ? data.url
                    : CORE_BASE_URL + data.url
                setCurrentPhotoId(data.id)
                setPreview(url)
                setFile(null)
            }
            navigate(`/${username}`)
        } catch (e) {
            // разбираем field-ошибки из бэка
            if (e.response?.data?.fieldErrors) {
                const fe = {}
                e.response.data.fieldErrors.forEach(({field, message}) => {
                    fe[field] = message
                })
                setErrors(fe)
            } else {
                setServerError(e.response?.data?.message || e.message)
            }
        } finally {
            setSaving(false)
        }
    }

    // 9) Рендер
    if (profileError) {
        return (
            <Container sx={{mt: 4, textAlign: 'center'}}>
                <Alert severity="error">
                    Ошибка загрузки профиля.{' '}
                    <Button onClick={refetchProfile}>Повторить</Button>
                </Alert>
            </Container>
        );
    }
    if (loadingProfile || !initialized) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{mt: 4}}>
            <Typography variant="h5" gutterBottom>
                Редактировать профиль
            </Typography>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                <Box sx={{textAlign: 'center', mb: 2}}>
                    <AvatarWithFallback
                        src={preview}
                        sx={{width: 100, height: 100, mx: 'auto'}}
                    />
                    <Box>
                        <Button
                            component="button"
                            variant="outlined"
                            sx={{mt: 1, mr: 1}}
                            disabled={saving}
                        >
                            Загрузить аватар
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={saving}
                            />
                        </Button>

                        <Button
                            sx={{mt: 1}}
                            color="error"
                            variant="outlined"
                            disabled={saving || (!file && !currentPhotoId)}
                            onClick={handleDeleteClick}
                        >
                            Удалить
                        </Button>
                    </Box>
                    {errors.file && (
                        <Typography color="error" variant="body2">
                            {errors.file}
                        </Typography>
                    )}
                </Box>

                <TextField
                    fullWidth
                    label="Полное имя"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    inputProps={{maxLength: 255}}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    disabled={saving}
                    sx={{mb: 2}}
                />

                <TextField
                    fullWidth
                    label="Описание"
                    multiline
                    rows={4}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    inputProps={{maxLength: 255}}
                    error={!!errors.description}
                    helperText={errors.description}
                    disabled={saving}
                    sx={{mb: 2}}
                />

                <Box sx={{textAlign: 'right'}}>
                    <Button
                        component={Link}
                        to={`/${username}`}
                        variant="outlined"
                        disabled={saving}
                        sx={{mr: 1}}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? 'Сохранение…' : 'Сохранить'}
                    </Button>
                </Box>
            </Box>

            {/* Диалог подтверждения удаления на сервере */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
            >
                <DialogTitle>
                    Вы уверены, что хотите удалить текущее фото?
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        disabled={saving}
                        variant="outlined"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={saving}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}
