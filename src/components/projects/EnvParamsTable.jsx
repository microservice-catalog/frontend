// src/components/EnvParamsTable.jsx
import React, {useMemo, useState} from 'react';
import {
    Button,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    useTheme
} from '@mui/material';
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Save as SaveIcon
} from '@mui/icons-material';

const NAME_REGEX = /^[a-zA-Z0-9._-]+$/;

export default function EnvParamsTable({params, onAdd, onUpdate, onDelete}) {
    const theme = useTheme();
    const [editingKey, setEditingKey] = useState(null);
    const [draft, setDraft] = useState({name: '', defaultValue: '', required: false});
    const [adding, setAdding] = useState(false);

    const handleChange = (field) => (e) => {
        const value = field === 'required' ? e.target.checked : e.target.value;
        setDraft(prev => ({...prev, [field]: value}));
    };

    const startEdit = (param) => {
        setDraft(param);
        setEditingKey(param.name);
        setAdding(false);
    };
    const cancelEdit = () => {
        setEditingKey(null);
        setDraft({name: '', defaultValue: '', required: false});
    };
    const saveEdit = () => {
        onUpdate(editingKey, {defaultValue: draft.defaultValue, required: draft.required});
        cancelEdit();
    };

    const startAdd = () => {
        setDraft({name: '', defaultValue: '', required: false});
        setAdding(true);
        setEditingKey(null);
    };
    const cancelAdd = () => {
        setDraft({name: '', defaultValue: '', required: false});
        setAdding(false);
    };

    // Validate name only when adding
    const nameError = useMemo(() => {
        if (!adding) return '';
        if (!draft.name.trim()) return 'Название параметра не может быть пустым';
        if (!NAME_REGEX.test(draft.name)) return 'Название параметра может содержать латинские буквы, цифры, дефис, нижнее подчёркивание и точку.';
        return '';
    }, [draft.name, adding]);

    const saveAdd = () => {
        if (nameError) return;
        onAdd(draft);
        cancelAdd();
    };

    return (
        <TableContainer
            component={Paper}
            sx={{
                display: 'inline-block',
                maxWidth: '100%',
                tableLayout: 'fixed',
                overflowX: 'auto'
            }}
        >
            <Table size="small" sx={{tableLayout: 'fixed', width: 'auto'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Название</TableCell>
                        <TableCell>Значение по умолчанию</TableCell>
                        <TableCell>Обязательно</TableCell>
                        {(onUpdate || onDelete) && <TableCell align="right">Действия</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {params.map(param => (
                        <TableRow key={param.name} hover>
                            <TableCell sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                {editingKey === param.name
                                    ? <TextField
                                        size="small"
                                        value={draft.name}
                                        disabled
                                        fullWidth
                                    />
                                    : param.name}
                            </TableCell>
                            <TableCell sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                {editingKey === param.name
                                    ? <TextField
                                        size="small"
                                        value={draft.defaultValue}
                                        onChange={handleChange('defaultValue')}
                                        fullWidth
                                    />
                                    : (param.defaultValue || '-')}
                            </TableCell>
                            <TableCell>
                                {editingKey === param.name
                                    ? <Checkbox
                                        checked={draft.required}
                                        onChange={handleChange('required')}
                                    />
                                    : (param.required ? 'Да' : 'Нет')}
                            </TableCell>
                            {(onUpdate || onDelete) && (
                                <TableCell align="right">
                                    {editingKey === param.name ? (
                                        <>
                                            <IconButton size="small" onClick={saveEdit}
                                                        sx={{color: theme.palette.primary.main}}>
                                                <SaveIcon fontSize="small"/>
                                            </IconButton>
                                            <IconButton size="small" onClick={cancelEdit}
                                                        sx={{color: theme.palette.error.main}}>
                                                <CancelIcon fontSize="small"/>
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            {onUpdate && (
                                                <IconButton size="small" onClick={() => startEdit(param)}
                                                            sx={{color: theme.palette.primary.main}}>
                                                    <EditIcon fontSize="small"/>
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton size="small" onClick={() => onDelete(param.name)}
                                                            sx={{color: theme.palette.error.main}}>
                                                    <DeleteIcon fontSize="small"/>
                                                </IconButton>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}

                    {onAdd && (
                        adding ? (
                            <TableRow>
                                <TableCell sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                    <TextField
                                        size="small"
                                        placeholder="Название"
                                        value={draft.name}
                                        onChange={handleChange('name')}
                                        fullWidth
                                        error={!!nameError}
                                        helperText={nameError}
                                    />
                                </TableCell>
                                <TableCell sx={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                                    <TextField
                                        size="small"
                                        placeholder="Значение"
                                        value={draft.defaultValue}
                                        onChange={handleChange('defaultValue')}
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={draft.required}
                                        onChange={handleChange('required')}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={saveAdd} disabled={!!nameError}
                                                sx={{color: theme.palette.primary.main}}>
                                        <SaveIcon fontSize="small"/>
                                    </IconButton>
                                    <IconButton size="small" onClick={cancelAdd} sx={{color: theme.palette.error.main}}>
                                        <CancelIcon fontSize="small"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Button
                                        size="small"
                                        startIcon={<AddIcon/>}
                                        onClick={startAdd}
                                        sx={{color: theme.palette.primary.main}}
                                    >
                                        Добавить параметр
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
