import React, {useState} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function EditDescriptionDialog({open, initialValue, onClose, onSave}) {
    const [value, setValue] = useState(initialValue || '');

    const handleSave = () => onSave(value);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Description</DialogTitle>
            <DialogContent dividers>
                <TextField
                    label="Markdown"
                    multiline
                    minRows={8}
                    fullWidth
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <Box mt={3}>
                    <Typography variant="subtitle1">Preview</Typography>
                    <Box sx={theme => ({
                        border: `1px solid ${theme.palette.divider}`,
                        p: 2,
                        borderRadius: 1,
                        maxHeight: 300,
                        overflow: 'auto'
                    })}>
                        <ReactMarkdown>{value}</ReactMarkdown>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
