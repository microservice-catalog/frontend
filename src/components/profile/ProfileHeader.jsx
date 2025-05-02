import React from 'react';
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';

export default function ProfileHeader({profile, onEdit}) {
    const {username, fullName, description, avatarUrl, favouritesCount, viewsCount, likesCount} = profile;
    console.log(username);
    console.log(fullName);
    return (
        <Box display="flex" alignItems="center" mb={4}>
            <Avatar src={avatarUrl} alt={"User Avatar"} sx={{width: 80, height: 80, mr: 3}}/>
            <Box flexGrow={1}>
                <Typography variant="h4">{fullName}</Typography>
                <Typography variant="subtitle1" color="text.secondary">@{username}</Typography>
                {description && (
                    <Typography variant="body1" mt={1}>{description}</Typography>
                )}
                <Stack direction="row" spacing={3} mt={2}>
                    <Typography variant="body2">Favourites: {favouritesCount}</Typography>
                    <Typography variant="body2">Views: {viewsCount}</Typography>
                    <Typography variant="body2">Likes: {likesCount}</Typography>
                </Stack>
            </Box>
            <Button variant="outlined" onClick={onEdit}>Edit Profile</Button>
        </Box>
    );
}
