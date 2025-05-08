// src/components/CreateProjectDialog.jsx
import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputAdornment,
    TextField,
    useTheme
} from '@mui/material';
import {projectApi} from '../../api/api.jsx';

const DOCKER_PREFIX = 'https://hub.docker.com/r/';
const GITHUB_PREFIX = 'https://github.com/';

// Regex for projectName validation
const projectNameStartSymbolRegex = /^[a-zA-Z].*$/;
const projectNameEndSymbolRegex = /^.*[a-zA-Z0-9]$/;
const projectNameFullRegex = /^[a-zA-Z0-9_-]*$/;

export default function CreateProjectDialog({open, onClose, onCreated, username}) {
    const theme = useTheme();
    const [form, setForm] = useState({
        title: '',
        projectName: '',
        tags: '',
        dockerHubLink: '',
        githubLink: '',
        isPrivate: false
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState({title: false, projectName: false});

    const handleChange = field => e => {
        const value = field === 'isPrivate' ? e.target.checked : e.target.value;
        setForm(f => ({...f, [field]: value}));
        if (field === 'title' && !touched.title) setTouched(t => ({...t, title: true}));
        if (field === 'projectName' && !touched.projectName) setTouched(t => ({...t, projectName: true}));
    };

    const handleGithubChange = e => {
        let v = e.target.value;
        if (v.startsWith(GITHUB_PREFIX)) v = v.substring(GITHUB_PREFIX.length);
        setForm(f => ({...f, githubLink: v}));
    };
    const handleGithubPaste = e => {
        e.preventDefault();
        const paste = e.clipboardData.getData('Text');
        const match = paste.match(/https?:\/\/github\.com\/([^\/]+\/[^\/]+)/i);
        const v = match ? match[1] : paste;
        setForm(f => ({...f, githubLink: v}));
    };

    const handleDockerChange = e => {
        let v = e.target.value;
        if (v.startsWith(DOCKER_PREFIX)) v = v.substring(DOCKER_PREFIX.length);
        setForm(f => ({...f, dockerHubLink: v}));
    };
    const handleDockerPaste = e => {
        e.preventDefault();
        const paste = e.clipboardData.getData('Text');
        const match = paste.match(/https?:\/\/hub\.docker\.com\/r\/([^\/]+\/[^\/]+)/i);
        const v = match ? match[1] : paste;
        setForm(f => ({...f, dockerHubLink: v}));
    };

    // Validation checks
    const titleError = (submitted || touched.title) && (form.title.length < 3 || form.title.length > 100)
        ? 'Длина заголовка должна быть от 3 до 100 символов'
        : '';

    const projectNameError = (() => {
        if (!(submitted || touched.projectName)) return '';
        const v = form.projectName;
        if (!projectNameFullRegex.test(v)) {
            return 'Название проекта может содержать только латинские буквы, цифры, нижнее подчёркивание и знак дефис';
        }
        if (!projectNameStartSymbolRegex.test(v)) {
            return 'Название проекта должно начинаться с латинской буквы';
        }
        if (!projectNameEndSymbolRegex.test(v)) {
            return 'Название проекта должно заканчиваться на латинскую букву или цифру';
        }
        if (v.length < 5 || v.length > 50) return 'Длина названия должна быть от 5 до 50 символов';
        return '';
    })();

    const isCreateDisabled = loading || !form.title || !form.projectName || !!projectNameError;

    const handleSubmit = async () => {
        setSubmitted(true);
        if (titleError || projectNameError) return;
        setLoading(true);
        try {
            const dto = {
                title: form.title,
                projectName: form.projectName,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                dockerHubLink: form.dockerHubLink ? DOCKER_PREFIX + form.dockerHubLink : '',
                githubLink: form.githubLink ? GITHUB_PREFIX + form.githubLink : '',
                isPrivate: form.isPrivate
            };
            const response = await projectApi.createProject(dto);
            onCreated(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Создать карточку сервиса</DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Заголовок"
                    placeholder="Микросервис для управления пользователями"
                    fullWidth margin="dense"
                    value={form.title}
                    onChange={handleChange('title')}
                    error={!!titleError}
                    helperText={titleError}
                />
                <TextField
                    label="Название"
                    placeholder="my-microservice-10"
                    fullWidth margin="dense"
                    value={form.projectName}
                    onChange={handleChange('projectName')}
                    error={!!projectNameError}
                    helperText={projectNameError}
                />
                <TextField
                    label="Теги через запятую (не обязательно)"
                    placeholder="java17, postgresql"
                    fullWidth margin="dense"
                    value={form.tags}
                    onChange={handleChange('tags')}
                />
                <TextField
                    label="Ссылка на Docker Hub (не обязательно)"
                    fullWidth margin="dense"
                    value={form.dockerHubLink}
                    onChange={handleDockerChange}
                    onPaste={handleDockerPaste}
                    InputProps={{
                        startAdornment: <InputAdornment sx={{color: theme.palette.text.primary}}
                                                        position="start">{DOCKER_PREFIX}</InputAdornment>
                    }}
                />
                <TextField
                    label="Ссылка на GitHub (не обязательно)"
                    fullWidth margin="dense"
                    value={form.githubLink}
                    onChange={handleGithubChange}
                    onPaste={handleGithubPaste}
                    InputProps={{
                        startAdornment: <InputAdornment sx={{color: theme.palette.text.primary}}
                                                        position="start">{GITHUB_PREFIX}</InputAdornment>
                    }}
                />
                <FormControlLabel
                    sx={{mt: 1}}
                    control={
                        <Checkbox
                            checked={form.isPrivate}
                            onChange={handleChange('isPrivate')}
                            disabled={loading}
                        />
                    }
                    label="Сделать проект приватным"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Отмена</Button>
                <Button onClick={handleSubmit}
                        disabled={isCreateDisabled}
                        variant="contained"
                >Создать</Button>
            </DialogActions>
        </Dialog>
    );
}
