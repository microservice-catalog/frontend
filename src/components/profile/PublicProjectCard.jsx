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
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/projects/${authorUsername}/${projectName}`}
                    sx={{textDecoration: 'none'}}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {projectName}
                </Typography>
                {tags?.length > 0 && (
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small"/>
                        ))}
                    </Stack>
                )}
                <Stack direction="row" spacing={2} mt={2} alignItems="center">
                    <IconButton onClick={handleLike}>
                        {likedByMe ? <Favorite color="error"/> : <FavoriteBorder/>}
                    </IconButton>
                    <Typography variant="caption">👍 {likesCount}</Typography>
                    <Typography variant="caption">⬇️ {downloadsCount}</Typography>
                    <Typography variant="caption">👁️ {viewsCount}</Typography>
                </Stack>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/projects/${authorUsername}/${projectName}`}>
                    Open
                </Button>
            </CardActions>
        </Card>
    );
}