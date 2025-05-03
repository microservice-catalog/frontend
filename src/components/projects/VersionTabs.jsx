// src/components/projects/VersionTabs.jsx
import React, {useState} from 'react';
import {Box, Button, IconButton, Menu, MenuItem, Tab, Tabs, TextField} from '@mui/material';
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

    const openMenu = (event, ver) => {
        setAnchorEl(event.currentTarget);
        setMenuVer(ver);
    };
    const closeMenu = () => {
        setAnchorEl(null);
        setMenuVer(null);
    };

    const handleRename = async () => {
        closeMenu();
        const name = window.prompt('Новое имя версии', menuVer);
        if (name) await onRename(menuVer, name);
    };
    const handleDelete = () => {
        closeMenu();
        if (window.confirm(`Удалить версию "${menuVer}"?`)) onDelete(menuVer);
    };

    return (
        <Box mb={3}>
            <Tabs value={current} onChange={(_, v) => onSelect(v)}>
                {versions.map(v => (
                    <Tab
                        key={v.versionName}
                        label={
                            <Box display="flex" alignItems="center">
                                {v.versionName}
                                <IconButton
                                    size="small"
                                    onClick={e => {
                                        e.stopPropagation();
                                        openMenu(e, v.versionName);
                                    }}
                                >
                                    <MoreVertIcon fontSize="small"/>
                                </IconButton>
                            </Box>
                        }
                        value={v.versionName}
                    />
                ))}

                {adding ? (
                    <Box display="flex" alignItems="center" sx={{ml: 2}}>
                        <TextField
                            size="small"
                            placeholder="Version name"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <Button
                            size="small"
                            variant="contained"
                            onClick={async () => {
                                await onAdd(newName);
                                setNewName('');
                                setAdding(false);
                            }}
                        >
                            Add
                        </Button>
                        <Button size="small" onClick={() => setAdding(false)}>×</Button>
                    </Box>
                ) : (
                    <Tab
                        label="+ Add"
                        onClick={() => setAdding(true)}
                        value="__add__"
                        sx={{opacity: 0.7}}
                    />
                )}
            </Tabs>

            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={closeMenu}>
                <MenuItem onClick={handleRename}>Rename</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Box>
    );
}
