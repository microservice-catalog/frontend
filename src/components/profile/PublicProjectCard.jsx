// src/components/profile/PublicProjectCard.jsx
import React from 'react';
import {Box, Button, Card, CardActions, CardContent, Chip, IconButton, Stack, Typography} from '@mui/material';
import {Favorite, FavoriteBorder} from '@mui/icons-material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Link} from 'react-router-dom';

export default function PublicProjectCard({project, onToggleLike}) {
    const {
        projectName,
        title,
        tags = [],
        likesCount,
        downloadsCount,
        viewsCount,
        likedByMe,
        authorUsername
    } = project;

    const handleLike = () => {
        onToggleLike(projectName, likedByMe);
    };

    // Показываем не более 3 тегов, остальные считаем скрытыми
    const MAX_VISIBLE_TAGS = 3;
    const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
    const hiddenCount = tags.length - visibleTags.length;

    return (
        <Card
            elevation={1}
            sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <CardContent sx={{flexGrow: 1, p: 2}}>
                {/* Заголовок и кнопка лайка */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{p: 1}}>
                    <Box>
                        <Typography
                            variant="h6"
                            component={Link}
                            to={`/projects/${authorUsername}/${projectName}`}
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                '&:hover': {color: 'primary.main'}
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{p: 1}}>
                            {projectName}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleLike} color={likedByMe ? 'error' : 'default'}>
                        {likedByMe ? <Favorite/> : <FavoriteBorder/>}
                    </IconButton>
                </Box>

                {/* Теги */}
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
                                <Chip
                                    label={`и ещё ${hiddenCount}...`}
                                    size="small"
                                    sx={{opacity: 0.6}}
                                />
                            )}
                        </Stack>
                    </Box>
                )}

                {/* Статистика */}
                <Stack direction="row" spacing={2} mt={2} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Favorite fontSize="small" color="action"/>
                        <Typography variant="caption" color="text.secondary">
                            {likesCount}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CloudDownloadIcon fontSize="small" color="action"/>
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
            </CardContent>

            {/* Кнопка открытия */}
            <CardActions sx={{p: 2}}>
                <Button
                    size="small"
                    variant="contained"
                    component={Link}
                    to={`/projects/${authorUsername}/${projectName}`}
                >
                    Open
                </Button>
            </CardActions>
        </Card>
    );
}
