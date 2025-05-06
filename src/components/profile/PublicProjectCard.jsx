// src/components/profile/PublicProjectCard.jsx
import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, Card, CardContent, IconButton, Stack, Typography} from '@mui/material';
import {Favorite, FavoriteBorder} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TagList from '../common/TagList.jsx';
import AvatarWithFallback from '../common/AvatarWithFallback.jsx';

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

    const handleLike = () => onToggleLike?.(projectName, likedByMe);

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
            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2}}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                        <AvatarWithFallback src={authorAvatarUrl} alt={authorUsername} size={24} sx={{mr: 1}}/>
                        <Typography variant="body2" color="text.secondary">
                            {authorUsername}/<Box component="span" fontWeight="bold">{projectName}</Box>
                        </Typography>
                    </Box>
                    <IconButton onClick={handleLike} color={likedByMe ? 'error' : 'default'}>
                        {likedByMe ? <Favorite fontSize="small"/> : <FavoriteBorder fontSize="small"/>}
                    </IconButton>
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/${authorUsername}/${projectName}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        '&:hover': {color: 'primary.main'},
                        mb: 1
                    }}
                >
                    {title}
                </Typography>

                {/* Bottom group: tags, stats, open button */}
                <Box sx={{mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1}}>
                    {tags.length > 0 && (
                        <TagList
                            tags={tags}
                            onTagClick={tag => window.location.assign(`/?tag=${encodeURIComponent(tag)}`)}
                        />
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center">
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
                </Box>
            </CardContent>
        </Card>
    );
}
