import React from 'react';
import {Box, Button, Stack, Typography} from '@mui/material';
import AvatarWithFallback from "../common/AvatarWithFallback.jsx";

export default function ProfileHeader({profile, onEdit}) {
    const {username, fullName, description, avatarUrl, favouritesCount, viewsCount, likesCount} = profile;
    return (
        <Box display="flex" alignItems="center" mb={4}>
            <AvatarWithFallback src={avatarUrl} alt={"User Avatar"} size={80} sx={{mr: 3}}/>
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
