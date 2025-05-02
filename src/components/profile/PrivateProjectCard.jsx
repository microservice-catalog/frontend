// src/components/profile/PrivateProjectCard.jsx
import React from 'react';
import {Button, Card, CardActions, CardContent, Chip, Stack, Typography,} from '@mui/material';
import {Link} from 'react-router-dom';

export default function PrivateProjectCard({project, username}) {
    const {projectName, title, tags} = project;

    return (
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    component={Link}
                    to={`/projects/${username}/${projectName}`}
                    color="primary"
                    sx={{textDecoration: 'none'}}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="secondary">
                    {projectName}
                </Typography>
                {tags?.length > 0 && (
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" color="secondary"/>
                        ))}
                    </Stack>
                )}
            </CardContent>
            <CardActions sx={{justifyContent: 'flex-end', px: 2, pb: 2}}>
                <Button
                    component={Link}
                    to={`/projects/${username}/${projectName}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                >
                    Open
                </Button>
            </CardActions>
        </Card>
    );
}
