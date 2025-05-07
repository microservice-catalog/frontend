import React, {useContext, useEffect, useRef, useState} from 'react';
import {Box, CircularProgress, Container, Grid, Pagination, Typography} from '@mui/material';
import ProjectCard from '../../components/profile/PublicProjectCard.jsx';
import {favouriteApi, projectApi} from '../../api/api.jsx';
import {FilterContext} from '../../components/Header/HeaderContainer.jsx';

export default function HomePageContainer() {
    const {search, filterTags} = useContext(FilterContext);
    const [projects, setProjects] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;
    const [loading, setLoading] = useState(true);
    // In-memory cache for search results
    const searchCache = useRef({});

    const load = async () => {
        setLoading(true);
        // build cache key based on current params
        const key = JSON.stringify({page, search, filterTags});
        // check cache
        if (searchCache.current[key]) {
            const {content, totalPages} = searchCache.current[key];
            setProjects(content);
            setTotal(totalPages);
            setLoading(false);
            return;
        }

        try {
            const res = await projectApi.getProjects({
                page: page - 1,
                limit,
                query: search || undefined,
                tags: filterTags.length ? filterTags : undefined
            });
            const {content, totalPages} = res.data;
            setProjects(content);
            setTotal(totalPages);
            // store in cache
            searchCache.current[key] = {content, totalPages};
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [search, filterTags, page]);

    // Toggle like handler
    const handleToggleLike = async (projectName, currentlyLiked) => {
        try {
            await favouriteApi.toggleFavourite(
                projects.find(p => p.projectName === projectName).authorUsername,
                projectName,
                currentlyLiked
            );
            setProjects(prev =>
                prev.map(p =>
                    p.projectName === projectName
                        ? {
                            ...p,
                            likedByMe: !currentlyLiked,
                            likesCount: currentlyLiked ? p.likesCount - 1 : p.likesCount + 1
                        }
                        : p
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

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
                        <ProjectCard
                            project={p}
                            username={p.authorUsername}
                            onToggleLike={handleToggleLike}
                        />
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
