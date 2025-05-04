// src/components/PublicProjectCard.jsx
import React from 'react';
import {Card, CardContent, Chip, Stack, Typography, useTheme} from '@mui/material';

export default function PublicProjectCard({project}) {
    const theme = useTheme();

    return (
        <Card sx={{backgroundColor: theme.palette.background.paper}}>
            <CardContent>
                <Typography variant="h6" color="textPrimary">
                    {project.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    @{project.authorUsername}
                </Typography>
                <Stack direction="row" spacing={1} sx={{mt: 1, color: theme.palette.text.secondary}}>
                    <Typography variant="body2">❤ {project.likesCount}</Typography>
                    <Typography variant="body2">⬇ {project.downloadsCount}</Typography>
                    <Typography variant="body2">👁 {project.viewsCount}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{mt: 1}}>
                    {project.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small"/>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
