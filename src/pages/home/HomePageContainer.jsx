// src/pages/home/HomePageContainer.jsx
import React, {useContext, useEffect, useState} from 'react';
import {Box, CircularProgress, Container, Grid, Pagination, Typography} from '@mui/material';
import ProjectCard from '../../components/profile/PublicProjectCard.jsx';
import {projectApi} from '../../api/api.jsx';
import {FilterContext} from '../../components/Header/HeaderContainer.jsx';

export default function HomePageContainer() {
    const {search, filterTags} = useContext(FilterContext);
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit] = useState(20);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await projectApi.getProjects({
                page: page - 1,
                limit,
                query: search || undefined,
                tags: filterTags.length ? filterTags : undefined
            });
            setProjects(res.data.content);
            setTotal(res.data.totalPages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [search, filterTags, page]);

    if (loading) {
        return <Box textAlign="center" mt={4}><CircularProgress/></Box>;
    }

    if (!projects.length) {
        return <Typography align="center" mt={4}>No services found</Typography>;
    }

    return (
        <Container sx={{py: 4}}>
            <Grid container spacing={3}>
                {projects.map(p => (
                    <Grid item xs={12} sm={6} md={4} key={p.projectName}>
                        <ProjectCard project={p} username={p.authorUsername}/>
                    </Grid>
                ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={total}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                />
            </Box>
        </Container>
    );
}
