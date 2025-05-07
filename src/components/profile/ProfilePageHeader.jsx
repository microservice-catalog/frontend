import React from 'react';
import {Box, Button, Stack, Typography, useTheme} from '@mui/material';
import AvatarWithFallback from "../common/AvatarWithFallback.jsx";
import {API_URLS} from "../../api/urls.jsx";
import {useImageLoader} from "../../hooks/useImageLoader.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

export default function ProfilePageHeader({profile, onEdit, avatarSize = 25}) {
    const {username, fullName, description, avatarUrl, favouritesCount, viewsCount, likesCount} = profile;
    const {user: currentUser} = useAuth();
    const theme = useTheme();
    const currentUserUsername = currentUser?.username;

    const fullUrl = avatarUrl ? (
            avatarUrl.startsWith('http')
                ? avatarUrl
                : (`${API_URLS.PHOTOS}/${avatarUrl.split('/').pop()}`)
        )
        : null;

    const {src: imgSrc, loading: avatarLoading} = useImageLoader(
        fullUrl,
        DEFAULT_AVATAR_URL
    );

    return (
        <Box display="flex" alignItems="center" mb={4}>
            <AvatarWithFallback src={imgSrc} alt={"User Avatar1"} size={avatarSize} extraLoading={avatarLoading}
                                sx={{mr: 3}}/>
            <Box flexGrow={1}>
                <Stack direction="row" sx={{my: 2}}>
                    <Box flexGrow={1}>
                        {fullName && <Typography variant="h4" color="textPrimary">{fullName}</Typography>}
                        <Typography variant={!!fullName ? "subtitle1" : "h4"}
                                    color="text.secondary">@{username}</Typography>
                    </Box>
                    {/*<Box flexGrow={1}></Box>*/}

                    {currentUserUsername === username && (
                        <Button variant="outlined" onClick={onEdit}>Редактировать</Button>)}
                </Stack>


                {description && <Typography sx={{mt: 1}}> {description} </Typography>}
                <Stack direction="row" spacing={3} sx={{mt: 2, mr: 2, color: theme.palette.text.secondary}}>
                    <Typography variant="body2">Избранное: {favouritesCount}</Typography>
                    <Typography variant="body2">Просмотров: {viewsCount}</Typography>
                    <Typography variant="body2">Лайков: {likesCount}</Typography>
                </Stack>
            </Box>
            {/*{currentUserUsername === username && (<Button variant="outlined" onClick={onEdit}>Редактировать</Button>)}*/}
        </Box>

    );
}
