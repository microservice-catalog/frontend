import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';

// Dialog to edit links
export function LinkEditDialog({open, onClose, onSave, initial}) {
    const [draft, setDraft] = useState({github: initial.github, docker: initial.docker});
    const [error, setError] = useState(null);

    const handleSave = async () => {
        try {
            await onSave(draft);
            onClose();
        } catch (e) {
            setError(e.response?.data?.message || e.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Редактировать ссылки</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    fullWidth margin="dense"
                    label="GitHub URL"
                    value={draft.github}
                    onChange={e => setDraft(d => ({...d, github: e.target.value}))}
                />
                <TextField
                    fullWidth margin="dense"
                    label="Docker Hub URL"
                    value={draft.docker}
                    onChange={e => setDraft(d => ({...d, docker: e.target.value}))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}
