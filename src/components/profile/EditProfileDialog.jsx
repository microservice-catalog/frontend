// src/components/profile/EditProfileDialog.jsx
import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from '@mui/material';
import {userApi} from '../../api/api.jsx';

export default function EditProfileDialog({open, onClose, onSave, initialProfile}) {
    const [fullName, setFullName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialProfile) {
            setFullName(initialProfile.fullName);
            setDescription(initialProfile.description || '');
        }
    }, [initialProfile]);

    const handleSave = async () => {
        await userApi.updateProfile({fullName, description});
        const response = await userApi.getProfile();
        onSave(response.data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}