import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    Typography,
    useTheme
} from '@mui/material';

const GITHUB_PREFIX = 'https://github.com/';
const DOCKER_PREFIX = 'https://hub.docker.com/r/';

export function LinkEditDialog({open, onClose, onSave, initial}) {
    const theme = useTheme();
    const trim = (url = '', prefix) => url.startsWith(prefix) ? url.substring(prefix.length) : url;

    const [draft, setDraft] = useState({
        github: trim(initial.github, GITHUB_PREFIX),
        docker: trim(initial.docker, DOCKER_PREFIX)
    });
    const [error, setError] = useState(null);

    const handleGithubChange = e => {
        let v = e.target.value;
        if (v.startsWith(GITHUB_PREFIX)) v = v.substring(GITHUB_PREFIX.length);
        setDraft(d => ({...d, github: v}));
    };

    const handleGithubPaste = e => {
        e.preventDefault();
        const paste = e.clipboardData.getData('Text');
        const match = paste.match(/https?:\/\/github\.com\/([^\/]+\/[^\/]+)/i);
        const v = match ? match[1] : paste;
        setDraft(d => ({...d, github: v}));
    };

    const handleDockerChange = e => {
        let v = e.target.value;
        if (v.startsWith(DOCKER_PREFIX)) v = v.substring(DOCKER_PREFIX.length);
        setDraft(d => ({...d, docker: v}));
    };

    const handleDockerPaste = e => {
        e.preventDefault();
        const paste = e.clipboardData.getData('Text');
        const match = paste.match(/https?:\/\/hub\.docker\.com\/r\/([^\/]+\/[^\/]+)/i);
        const v = match ? match[1] : paste;
        setDraft(d => ({...d, docker: v}));
    };

    const handleSave = async () => {
        try {
            const payload = {
                github: draft.github ? GITHUB_PREFIX + draft.github : '',
                docker: draft.docker ? DOCKER_PREFIX + draft.docker : ''
            };
            await onSave(payload);
            onClose();
        } catch (e) {
            setError(e.response?.data?.message || e.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Редактировать ссылки</DialogTitle>
            <DialogContent dividers>
                {error && <Typography color="error" gutterBottom>{error}</Typography>}
                <TextField
                    fullWidth
                    margin="dense"
                    label="Ссылка на GitHub"
                    value={draft.github}
                    onChange={handleGithubChange}
                    onPaste={handleGithubPaste}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{color: theme.palette.text.primary}}>
                                {GITHUB_PREFIX}
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Ссылка на Docker Hub"
                    value={draft.docker}
                    onChange={handleDockerChange}
                    onPaste={handleDockerPaste}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{color: theme.palette.text.primary}}>
                                {DOCKER_PREFIX}
                            </InputAdornment>
                        )
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}
