import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {AppBar, Autocomplete, Box, Button, Skeleton, TextField, Toolbar, Typography, useTheme} from '@mui/material';
import ProfileView from './ProfileView.jsx';

export default function HeaderView({
                                       username,
                                       avatarUrl,
                                       isAuthenticated,
                                       onLogout,
                                       loading,
                                       onSearchChange,
                                       tagOptions,
                                       onTagInputChange,
                                       onTagsChange,
                                       onCreateProject
                                   }) {
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const theme = useTheme();

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        onSearchChange?.(value);
    };

    const handleTags = (event, value) => {
        setTags(value);
        onTagsChange?.(value);
    };

    if (loading) {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Skeleton variant="text" width={100} height={40}/> {/* Logo */}
                    <Box sx={{ml: 2, width: 600}}>
                        <Skeleton variant="rectangular" width="100%" height={40}/> {/* Search */}
                    </Box>
                    <Box sx={{ml: 2, width: 200}}>
                        <Skeleton variant="rectangular" width="100%" height={40}/> {/* Tags */}
                    </Box>
                    <Box sx={{flexGrow: 1}}/>
                    {isAuthenticated && (
                        <Box sx={{ml: 2}}>
                            <Skeleton variant="rectangular" width={120} height={36}/> {/* Button */}
                        </Box>
                    )}
                    <Box sx={{ml: 2}}>
                        <Skeleton variant="circular" width={40} height={40}/> {/* Avatar */}
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        color: theme.palette.text.primary
                    }}
                >
                    Dockins
                </Typography>

                <TextField
                    size="small"
                    placeholder="Поиск…"
                    value={search}
                    onChange={handleSearch}
                    sx={{ml: 2, width: {xs: 200, md: 600}}}
                />

                <Autocomplete
                    multiple
                    freeSolo
                    size="small"
                    options={tagOptions}
                    value={tags}
                    onInputChange={(_, value) => {
                        onTagInputChange?.(value);
                    }}
                    onChange={handleTags}
                    sx={{ml: 2, width: {xs: 50, sm: 200}}}
                    renderInput={(params) => <TextField {...params} placeholder="Теги..."/>}
                />

                <Box sx={{flexGrow: 1, ml: 2}}/>

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
                        username={username}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
