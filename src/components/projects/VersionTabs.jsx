// src/components/VersionTabs.jsx
import React, {useState} from 'react';
import {Box, Button, Menu, MenuItem, Tab, Tabs, TextField} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function VersionTabs({
                                        versions,
                                        current,
                                        onSelect,
                                        onAdd,
                                        onRename,
                                        onDelete
                                    }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuVer, setMenuVer] = useState(null);
    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');

    const openMenu = (e, ver) => {
        setAnchorEl(e.currentTarget);
        setMenuVer(ver);
    };
    const closeMenu = () => {
        setAnchorEl(null);
        setMenuVer(null);
    };

    const handleRename = () => {
        closeMenu();
        const name = window.prompt('Новое имя версии', menuVer);
        if (name) onRename(menuVer, name);
    };

    const handleDelete = () => {
        closeMenu();
        if (window.confirm(`Удалить версию "${menuVer}"?`)) onDelete(menuVer);
    };

    // Handle add mode
    const startAdd = () => setAdding(true);
    const cancelAdd = () => {
        setAdding(false);
        setNewName('');
    };
    const confirmAdd = () => {
        if (newName.trim()) {
            onAdd(newName.trim());
            setNewName('');
            setAdding(false);
        }
    };

    return (
        <Box mb={3} display="flex" alignItems="center">
            <Tabs
                value={adding ? false : current}
                onChange={(_, v) => onSelect(v)}
                sx={{flex: 1}}
            >
                {versions.map(v => (
                    <Tab
                        key={v.versionName}
                        value={v.versionName}
                        label={
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                {v.versionName}
                                {onRename && onDelete && (
                                    <Box
                                        component="span"
                                        sx={{display: 'flex', alignItems: 'center', ml: 1, cursor: 'pointer'}}
                                        onClick={e => {
                                            e.stopPropagation();
                                            openMenu(e, v.versionName);
                                        }}
                                    >
                                        <MoreVertIcon fontSize="small"/>
                                    </Box>
                                )}
                            </Box>
                        }
                    />
                ))}
            </Tabs>

            {/* Add button or input */}
            {onAdd && (
                <Box sx={{ml: 2, display: 'flex', alignItems: 'center'}}>
                    {adding ? (
                        <>
                            <TextField
                                size="small"
                                placeholder="Название версии"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                            <Button size="small" variant="contained" sx={{ml: 1}} onClick={confirmAdd}>
                                Добавить
                            </Button>
                            <Button size="small" sx={{ml: 1}} onClick={cancelAdd}>
                                Отмена
                            </Button>
                        </>
                    ) : (
                        <Button size="small" variant="text" onClick={startAdd} sx={{opacity: 0.7}}>
                            + Добавить
                        </Button>
                    )}
                </Box>
            )}

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                {onRename && <MenuItem onClick={handleRename}>Rename</MenuItem>}
                {onDelete && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
            </Menu>
        </Box>
    );
}