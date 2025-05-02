import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField
} from '@mui/material';
import {projectApi} from '../../api/api.jsx';

export default function CreateProjectDialog({open, onClose, onCreated}) {
    const [form, setForm] = useState({
        title: '', projectName: '', tags: '', dockerHubLink: '', githubLink: '', isPrivate: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        const value = field === 'isPrivate' ? e.target.checked : e.target.value;
        setForm(f => ({...f, [field]: value}));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const dto = {
                title: form.title,
                projectName: form.projectName,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                dockerHubLink: form.dockerHubLink,
                githubLink: form.githubLink,
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
            <DialogTitle>Create Project</DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Title" fullWidth margin="dense"
                    value={form.title} onChange={handleChange('title')}
                />
                <TextField
                    label="Project Name" fullWidth margin="dense"
                    value={form.projectName} onChange={handleChange('projectName')}
                />
                <TextField
                    label="Tags (comma separated)" fullWidth margin="dense"
                    value={form.tags} onChange={handleChange('tags')}
                />
                <TextField
                    label="Docker Hub Link" fullWidth margin="dense"
                    value={form.dockerHubLink} onChange={handleChange('dockerHubLink')}
                />
                <TextField
                    label="GitHub Link" fullWidth margin="dense"
                    value={form.githubLink} onChange={handleChange('githubLink')}
                />
                <FormControlLabel
                    sx={{mt: 1}}
                    control={
                        <Checkbox
                            checked={form.isPrivate}
                            onChange={handleChange('isPrivate')}
                        />
                    }
                    label="Private"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={loading} variant="contained">Create</Button>
            </DialogActions>
        </Dialog>
    );
}
