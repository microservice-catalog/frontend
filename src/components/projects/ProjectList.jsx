// src/components/projects/ProjectList.jsx
import React from 'react';
import {Grid, Typography} from '@mui/material';
import PublicProjectCard from '../profile/PublicProjectCard.jsx';

export default function ProjectList({projects, onToggleLike}) {
    if (!projects || projects.length === 0) {
        return <Typography color="text.secondary">No projects found</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {projects.map((proj) => (
                <Grid item xs={12} sm={6} md={4} key={proj.projectName}>
                    <PublicProjectCard project={proj} onToggleLike={onToggleLike}/>
                </Grid>
            ))}
        </Grid>
    );
}