// src/components/projects/EnvParamsTable.jsx
import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EnvParamsTable({
                                           params,
                                           onAdd,
                                           onUpdate,
                                           onDelete
                                       }) {
    const [editingKey, setEditingKey] = useState(null);
    const [draft, setDraft] = useState({name: '', defaultValue: '', required: false});
    const [adding, setAdding] = useState(false);

    const startEdit = (p) => {
        setDraft(p);
        setEditingKey(p.name);
    };
    const cancelEdit = () => {
        setEditingKey(null);
        setDraft({name: '', defaultValue: '', required: false});
    };
    const saveEdit = async () => {
        await onUpdate(editingKey, {defaultValue: draft.defaultValue, required: draft.required});
        cancelEdit();
    };

    const saveAdd = async () => {
        await onAdd({name: draft.name, defaultValue: draft.defaultValue, required: draft.required});
        setDraft({name: '', defaultValue: '', required: false});
        setAdding(false);
    };

    return (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Default</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {params.map(p => (
                        <TableRow key={p.name}>
                            <TableCell>
                                {editingKey === p.name
                                    ? p.name
                                    : p.name
                                }
                            </TableCell>
                            <TableCell>
                                {editingKey === p.name ? (
                                    <TextField
                                        size="small"
                                        value={draft.defaultValue || ''}
                                        onChange={e => setDraft(d => ({...d, defaultValue: e.target.value}))}
                                    />
                                ) : (
                                    p.defaultValue || '-'
                                )}
                            </TableCell>
                            <TableCell>
                                {editingKey === p.name ? (
                                    <Checkbox
                                        checked={draft.required}
                                        onChange={e => setDraft(d => ({...d, required: e.target.checked}))}
                                    />
                                ) : p.required ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell align="right">
                                {editingKey === p.name ? (
                                    <>
                                        <Button size="small" onClick={saveEdit}>Save</Button>
                                        <Button size="small" onClick={cancelEdit}>Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <IconButton size="small" onClick={() => startEdit(p)}><EditIcon/></IconButton>
                                        <IconButton size="small"
                                                    onClick={() => onDelete(p.name)}><DeleteIcon/></IconButton>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}

                    {adding && (
                        <TableRow>
                            <TableCell>
                                <TextField
                                    size="small"
                                    placeholder="Name"
                                    value={draft.name}
                                    onChange={e => setDraft(d => ({...d, name: e.target.value}))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    size="small"
                                    placeholder="Default"
                                    value={draft.defaultValue}
                                    onChange={e => setDraft(d => ({...d, defaultValue: e.target.value}))}
                                />
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    checked={draft.required}
                                    onChange={e => setDraft(d => ({...d, required: e.target.checked}))}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Button size="small" onClick={saveAdd}>Add</Button>
                                <Button size="small" onClick={() => setAdding(false)}>Cancel</Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {!adding && (
                <Box mt={1}>
                    <Button size="small" variant="outlined" onClick={() => setAdding(true)}>+ Add Param</Button>
                </Box>
            )}
        </Box>
    );
}
