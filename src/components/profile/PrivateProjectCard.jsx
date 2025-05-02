import React from 'react';
import {Button, Card, CardActions, CardContent, Chip, Stack, Typography} from '@mui/material';
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
                    sx={{textDecoration: 'none'}}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {projectName}
                </Typography>
                {tags?.length > 0 && (
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {tags.map(tag => <Chip key={tag} label={tag} size="small"/>)}
                    </Stack>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/projects/${username}/${projectName}`}>
                    Open
                </Button>
            </CardActions>
        </Card>
    );
}
