import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useTheme} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import {projectTagApi} from '../../api/api.jsx';
import TagList from '../../components/common/TagList.jsx';

// Dialog to edit tags with autocomplete and caching
export function TagEditDialog({open, initialTags, onClose, onSave, username, projectName}) {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const cache = useRef({});
    const [error, setError] = useState('')
    const theme = useTheme();

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
        // ничего не делаем, если пусто или уже есть
        if (!tag || tags.includes(tag)) return;

        // проверяем максимум в 30 элементов
        if (tags.length >= 30) {
            setError('Нельзя добавить более 30 тегов');
            return;
        }

        // добавляем и сбрасываем ошибку
        setTags([...tags, tag]);
        setError('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue;
            setInputValue('');
            setOptions([]);
            handleAddTag(newTag);
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
                    onInputChange={(e, newInputValue, reason) => {
                        if (reason === 'input') {
                            setInputValue(newInputValue);
                            if (error) setError('');
                            fetchOptions(newInputValue);
                        }
                    }}
                    onChange={(e, newValue, reason) => {
                        // Enter -> reason==="createOption"
                        if (reason === 'createOption') {
                            handleAddTag(newValue);
                            setInputValue('');
                            setOptions([]);
                        }
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
                {error && (
                    <Alert severity="error" sx={{mt: 1, mb: 2, color: theme.palette.text.error}}>
                        {error}
                    </Alert>
                )}
                <TagList tags={tags} onTagClick={t => setTags(tags.filter(x => x !== t))}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    );
}
