import React, {useEffect, useRef, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {projectTagApi} from '../../api/api.jsx';
import TagList from '../../components/common/TagList.jsx';

// Dialog to edit tags with autocomplete and caching
export function TagEditDialog({open, initialTags, onClose, onSave, username, projectName}) {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const cache = useRef({});

    useEffect(() => {
        setTags(initialTags);
    }, [initialTags]);

    const fetchOptions = async (q) => {
        if (!q) {
            setOptions([]);
            return;
        }
        if (cache.current[q]) {
            setOptions(cache.current[q]);
            return;
        }
        try {
            const {data} = await projectTagApi.searchTags(q);
            cache.current[q] = data.tags;
            setOptions(data.tags);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddTag = (value) => {
        const tag = value.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            handleAddTag(inputValue);
            setInputValue('');
            setOptions([]);
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
                <Autocomplete
                    freeSolo
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(e, v, reason) => {
                        setInputValue(v);
                        if (reason === 'input') fetchOptions(v);
                    }}
                    onChange={(e, v) => {
                        if (typeof v === 'string') {
                            handleAddTag(v);
                        }
                        setInputValue('');
                        setOptions([]);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            placeholder="Поиск тегов"
                            helperText="Enter для добавления"
                            onKeyDown={handleKeyDown}
                            sx={{mb: 2}}
                        />
                    )}
                />
                <TagList tags={tags} onTagClick={t => setTags(tags.filter(x => x !== t))}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}
