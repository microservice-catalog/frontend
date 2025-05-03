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
    const saveEdit = () => {
        onUpdate(editingKey, {defaultValue: draft.defaultValue, required: draft.required});
        cancelEdit();
    };

    const saveAdd = () => {
        onAdd({name: draft.name, defaultValue: draft.defaultValue, required: draft.required});
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
                        {(onUpdate || onDelete) && <TableCell align="right">Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {params.map(p => (
                        <TableRow key={p.name}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>
                                {editingKey === p.name && onUpdate ? (
                                    <TextField
                                        size="small"
                                        value={draft.defaultValue || ''}
                                        onChange={e => setDraft(d => ({...d, defaultValue: e.target.value}))}
                                    />
                                ) : p.defaultValue || '-'}
                            </TableCell>
                            <TableCell>
                                {editingKey === p.name && onUpdate ? (
                                    <Checkbox
                                        checked={draft.required}
                                        onChange={e => setDraft(d => ({...d, required: e.target.checked}))}
                                    />
                                ) : (p.required ? 'Yes' : 'No')}
                            </TableCell>
                            {(onUpdate || onDelete) && (
                                <TableCell align="right">
                                    {editingKey === p.name ? (
                                        <>
                                            <Button size="small" onClick={saveEdit}>Save</Button>
                                            <Button size="small" onClick={cancelEdit}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            {onUpdate && <IconButton size="small"
                                                                     onClick={() => startEdit(p)}><EditIcon/></IconButton>}
                                            {onDelete &&
                                                <IconButton size="small" onClick={() => onDelete(p.name)}><DeleteIcon/></IconButton>}
                                        </>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}

                    {/* Add new param row */}
                    {onAdd && (
                        adding ? (
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
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Button size="small" variant="outlined" onClick={() => setAdding(true)}>+ Add
                                        Param</Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
