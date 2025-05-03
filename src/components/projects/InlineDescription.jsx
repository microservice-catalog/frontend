// src/components/projects/InlineDescription.jsx
import React, {useState} from 'react';
import {Box, Button, TextField} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function InlineDescription({value, onSave}) {
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState(value);

    const handleSave = () => {
        onSave(draft);
        setEditMode(false);
    };

    return (
        <Box mb={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box component="h6" sx={{m: 0, fontSize: '1.25rem'}}>Description</Box>
                <Button size="small" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Preview' : 'Edit'}
                </Button>
            </Box>

            {editMode ? (
                <>
                    <TextField
                        multiline
                        minRows={6}
                        fullWidth
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                    />
                    <Box mt={1}>
                        <Button variant="contained" size="small" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                    <Box mt={2}
                         sx={{border: '1px solid #ddd', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto'}}>
                        <ReactMarkdown>{draft || '_No description_'}</ReactMarkdown>
                    </Box>
                </>
            ) : (
                <Box sx={{border: '1px solid #ddd', p: 2, borderRadius: 1}}>
                    <ReactMarkdown>{value || '_No description_'}</ReactMarkdown>
                </Box>
            )}
        </Box>
    );
}
