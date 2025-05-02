import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {AppBar, Autocomplete, Box, Button, TextField, Toolbar, Typography} from '@mui/material';
import ProfileView from './ProfileView.jsx';

export default function HeaderView({
                                       username,
                                       avatarUrl,
                                       isAuthenticated,
                                       onLogout,
                                       loading,
                                       allTags,
                                       onSearchChange,
                                       onTagsChange,
                                       onCreateProject
                                   }) {
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearchChange?.(e.target.value);
    };

    const handleTags = (e, value) => {
        setTags(value);
        onTagsChange?.(value);
    };

    if (loading) {
        return null; // или skeleton, как было раньше
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{color: 'inherit', textDecoration: 'none'}}
                >
                    Dockins
                </Typography>

                <TextField
                    size="small"
                    placeholder="Search…"
                    value={search}
                    onChange={handleSearch}
                    sx={{ml: 2, width: 200}}
                />

                <Autocomplete
                    multiple
                    size="small"
                    options={allTags}
                    value={tags}
                    onChange={handleTags}
                    sx={{ml: 2, width: 200}}
                    renderInput={(params) => (
                        <TextField {...params} placeholder="Tags"/>
                    )}
                />

                <Box sx={{flexGrow: 1}}/>

                {isAuthenticated && (
                    <>
                        <Button color="inherit" onClick={onCreateProject}>
                            Создать сервис
                        </Button>
                    </>
                )}

                <Box sx={{ml: 2}}>
                    <ProfileView
                        isAuthenticated={isAuthenticated}
                        avatarUrl={avatarUrl}
                        onLogout={onLogout}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
