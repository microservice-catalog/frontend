// src/components/profile/PublicProjectCard.jsx
import React from 'react';
import {Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography,} from '@mui/material';
import {Favorite, FavoriteBorder} from '@mui/icons-material';
import {Link} from 'react-router-dom';
import {projectApi} from '../../api/api.jsx';

export default function PublicProjectCard({project, onToggleLike}) {
    const {
        projectName,
        title,
        tags,
        likesCount,
        downloadsCount,
        viewsCount,
        likedByMe,
        authorUsername,
    } = project;

    const handleLike = async () => {
        await projectApi.toggleFavourite(authorUsername, projectName, likedByMe);
        onToggleLike(projectName);
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
                        {tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" color="secondary"/>
                        ))}
                    </Stack>
                )}
                <Stack direction="row" spacing={1} mt={2} alignItems="center">
                    <IconButton onClick={handleLike} color={likedByMe ? 'error' : 'default'}>
                        {likedByMe ? <Favorite/> : <FavoriteBorder/>}
                    </IconButton>
                    <Typography variant="caption" color="text.primary">
                        {likesCount}
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                        ⬇️ {downloadsCount}
                    </Typography>
                    <Typography variant="caption" color="text.primary">
                        👁️ {viewsCount}
                    </Typography>
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