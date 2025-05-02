// src/pages/home/HomePageContainer.jsx
import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Container, Typography} from '@mui/material';
import {projectApi} from '../../api/api.jsx';
import ProjectList from '../../components/projects/ProjectList.jsx';

export default function HomePageContainer() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchProjects() {
            try {
                setLoading(true);
                const response = await projectApi.getHomeProjects();
                setProjects(response.data.content);
            } catch (err) {
                setError(err.customMessage || 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []);

    const handleToggleLike = (projectName) => {
        setProjects((prev) =>
            prev.map((proj) =>
                proj.projectName === projectName
                    ? {
                        ...proj,
                        likedByMe: !proj.likedByMe,
                        likesCount: proj.likedByMe ? proj.likesCount - 1 : proj.likesCount + 1
                    }
                    : proj
            )
        );
    };

    return (
        <Container sx={{py: 4}}>
            <Typography variant="h4" gutterBottom>
                Popular Microservices
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <Typography color="error" align="center" mt={4}>
                    {error}
                </Typography>
            ) : (
                <ProjectList projects={projects} onToggleLike={handleToggleLike}/>
            )}
        </Container>
    );
}
