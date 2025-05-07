import React, {useEffect, useState} from 'react';
import {Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {projectTagApi} from '../../api/api.jsx';
import TagList from '../../components/common/TagList.jsx';

// Dialog to edit tags
export function TagEditDialog({open, initialTags, onClose, onSave, username, projectName}) {
    const [tags, setTags] = useState(initialTags);
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setTags(initialTags);
    }, [initialTags]);

    const fetchOptions = async (q) => {
        if (!q) return setOptions([]);
        try {
            const {data} = await projectTagApi.searchTags(q);
            setOptions(data.tags);
        } catch (err) {
            console.error(err);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            const tag = search.trim();
            if (!tags.includes(tag)) {
                setTags([...tags, tag]);
            }
            setSearch('');
            setOptions([]);
            e.preventDefault();
        }
    };

    const handleSave = async () => {
        try {
            await projectTagApi.setTags(username, projectName, {tags});
            onSave(tags);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Редактировать теги</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    placeholder="Поиск тегов"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        fetchOptions(e.target.value);
                    }}
                    onKeyDown={handleKey}
                    helperText="Enter для добавления"
                    sx={{mb: 2}}
                />
                <Box sx={{mb: 2}}>
                    {options.map(opt => (
                        <Chip
                            key={opt}
                            label={opt}
                            size="small"
                            onClick={() => {
                                if (!tags.includes(opt)) setTags([...tags, opt]);
                                setSearch('');
                                setOptions([]);
                            }}
                            sx={{mr: 1, mb: 1}}
                        />
                    ))}
                </Box>
                <TagList tags={tags} onTagClick={t => setTags(tags.filter(x => x !== t))}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}

