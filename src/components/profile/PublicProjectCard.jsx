// src/components/profile/PublicProjectCard.jsx
import React from 'react';
import {Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography} from '@mui/material';
import {Favorite, FavoriteBorder} from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Link} from 'react-router-dom';

export default function PublicProjectCard({project, onToggleLike}) {
    const {
        projectName,
        title,
        tags,
        likesCount,
        downloadsCount,
        viewsCount,
        likedByMe,
        authorUsername
    } = project;

    const handleLike = () => {
        onToggleLike(projectName, likedByMe);
    };

    return (
        <Card elevation={2}>
            <CardContent sx={{pb: 0}}>
                <Typography
                    variant="h6"
                    color="primary"
                    component={Link}
                    to={`/projects/${authorUsername}/${projectName}`}
                    sx={{textDecoration: 'none'}}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                    {projectName}
                </Typography>
                {tags?.length > 0 && (
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" color="secondary"/>
                        ))}
                    </Stack>
                )}

                {/* Новый Stack со статистикой и кликабельным сердечком */}
                <Stack direction="row" spacing={2} mt={2} alignItems="center">
                    {/* Like */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <IconButton onClick={handleLike} color={likedByMe ? 'error' : 'default'} size="small">
                            {likedByMe ? <Favorite/> : <FavoriteBorder/>}
                        </IconButton>
                        <Typography variant="caption">{likesCount}</Typography>
                    </Stack>
                    {/* Downloads */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CloudDownloadIcon fontSize="small" color="action"/>
                        <Typography variant="caption">{downloadsCount}</Typography>
                    </Stack>
                    {/* Views */}
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <VisibilityIcon fontSize="small" color="action"/>
                        <Typography variant="caption">{viewsCount}</Typography>
                    </Stack>
                </Stack>
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/projects/${authorUsername}/${projectName}`}
                >
                    Open
                </Button>
            </CardActions>
        </Card>
    );
}
