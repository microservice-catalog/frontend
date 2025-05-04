// src/components/profile/PublicProjectCard.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import {Avatar, Box, Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography} from '@mui/material';
import {Favorite, FavoriteBorder} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function PublicProjectCard({project, onToggleLike}) {
    const {
        projectName,
        title,
        tags = [],
        likesCount,
        downloadsCount,
        viewsCount,
        likedByMe,
        authorUsername,
        authorAvatarUrl
    } = project;

    const handleLike = () => {
        onToggleLike?.(projectName, likedByMe);
    };

    const MAX_VISIBLE_TAGS = 3;
    const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
    const hiddenCount = tags.length - visibleTags.length;

    return (
        <Card elevation={1} sx={{borderRadius: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
            <CardContent sx={{flexGrow: 1, p: 2}}>
                {/* Header: author/projectName and like button */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={authorAvatarUrl} sx={{width: 24, height: 24}}/>
                        <Typography variant="subtitle1" color="text.primary">
                            <Box component="span" sx={{fontWeight: 'regular'}}>{authorUsername}/</Box>
                            <Box component="span" sx={{fontWeight: 'bold'}}>{projectName}</Box>
                        </Typography>
                    </Stack>
                    <IconButton onClick={handleLike} color={likedByMe ? 'error' : 'default'}>
                        {likedByMe ? <Favorite fontSize="small"/> : <FavoriteBorder fontSize="small"/>}
                    </IconButton>
                </Box>

                {/* Project title */}
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/${authorUsername}/${projectName}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        mt: 1,
                        '&:hover': {color: 'primary.main'}
                    }}
                >
                    {title}
                </Typography>

                {/* Tags */}
                {tags.length > 0 && (
                    <Box mt={1}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {visibleTags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    onClick={() => window.location.assign(`/?tag=${encodeURIComponent(tag)}`)}
                                    sx={{cursor: 'pointer'}}
                                />
                            ))}
                            {hiddenCount > 0 && (
                                <Chip label={`и ещё ${hiddenCount}...`} size="small" sx={{opacity: 0.6}}/>
                            )}
                        </Stack>
                    </Box>
                )}

                {/* Stats and Open button */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Favorite fontSize="small" color="action"/>
                            <Typography variant="caption" color="text.secondary">
                                {likesCount}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <DownloadIcon fontSize="small" color="action"/>
                            <Typography variant="caption" color="text.secondary">
                                {downloadsCount}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <VisibilityIcon fontSize="small" color="action"/>
                            <Typography variant="caption" color="text.secondary">
                                {viewsCount}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Button
                        size="small"
                        variant="contained"
                        component={Link}
                        to={`/${authorUsername}/${projectName}`}
                    >
                        Открыть
                    </Button>
                </Box>
            </CardContent>

            {/* Optional actions area (empty to maintain layout) */}
            <CardActions sx={{p: 0, m: 0}}/>
        </Card>
    );
}
