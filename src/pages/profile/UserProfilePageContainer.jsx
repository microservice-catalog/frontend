// src/pages/UserProfilePageContainer.jsx
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Box, CircularProgress, Container, Grid, Pagination, Stack, Typography, useTheme} from '@mui/material';
import {projectApi, userApi} from "../../api/api.jsx";
import PublicProjectCard from "../../components/profile/PublicProjectCard.jsx";

export default function UserProfilePageContainer() {
    const {username} = useParams();
    const theme = useTheme();

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Загрузка профиля
    useEffect(() => {
        setProfileLoading(true);
        userApi.getUserProfile(username)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
            .finally(() => setProfileLoading(false));
    }, [username]);

    // Загрузка проектов с пагинацией
    useEffect(() => {
        setProjectsLoading(true);
        projectApi.getUserProjects(username, page, size)
            .then(res => {
                const pageResp = res.data;
                setProjects(pageResp.content);
                setTotalPages(pageResp.totalPages);
            })
            .catch(err => console.error(err))
            .finally(() => setProjectsLoading(false));
    }, [username, page]);

    const handlePageChange = (_, value) => {
        setPage(value - 1);
    };

    // Если профиль ещё грузится
    if (profileLoading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4, color: theme.palette.text.secondary}}>
                <CircularProgress/>
            </Box>
        );
    }

    // Если профиль не найден
    if (!profile) {
        return (
            <Typography variant="h6" color="error" align="center" sx={{mt: 4}}>
                Пользователь “{username}” не найден
            </Typography>
        );
    }

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            {/* Профиль пользователя */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={profile.avatarUrl} sx={{width: 80, height: 80}}/>
                <Box>
                    <Typography variant="h4" color="textPrimary">
                        {profile.fullName}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        @{profile.username}
                    </Typography>
                    {profile.description && (
                        <Typography variant="body1" sx={{mt: 1}}>
                            {profile.description}
                        </Typography>
                    )}
                </Box>
            </Stack>

            {/* Статистика */}
            <Stack direction="row" spacing={4} sx={{mt: 3, color: theme.palette.text.secondary}}>
                <Typography>Лайков: {profile.likesCount}</Typography>
                <Typography>Просмотров: {profile.viewsCount}</Typography>
                <Typography>Избранное: {profile.favouritesCount}</Typography>
            </Stack>

            {/* Список проектов */}
            <Box sx={{mt: 4}}>
                <Typography variant="h5" gutterBottom color="textPrimary">
                    Проекты пользователя
                </Typography>

                {projectsLoading ? (
                    // Показать spinner вместо списка карт
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {projects.length > 0 ? (
                            projects.map(proj => (
                                <Grid item xs={12} sm={6} key={proj.projectName}>
                                    <PublicProjectCard project={proj}/>
                                </Grid>
                            ))
                        ) : (
                            <Typography color="text.secondary">
                                У пользователя нет публичных проектов.
                            </Typography>
                        )}
                    </Grid>
                )}
            </Box>

            {/* Пагинация */}
            {!projectsLoading && totalPages > 1 && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
}
