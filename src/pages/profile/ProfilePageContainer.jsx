// src/pages/profile/ProfilePageContainer.jsx
import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Container, Divider, Grid, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useUserProfile} from '../../hooks/useUserProfile.jsx';
import {useUserProjects} from '../../hooks/useUserProjects.jsx';
import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import PublicProjectCard from '../../components/profile/PublicProjectCard.jsx';
import PrivateProjectCard from '../../components/profile/PrivateProjectCard.jsx';
import EditProfileDialog from '../../components/profile/EditProfileDialog.jsx';
import {useAuth} from "../../context/AuthContext.jsx";

export default function ProfilePageContainer() {
    const navigate = useNavigate();
    const [editOpen, setEditOpen] = useState(false);
    const [page, setPage] = useState(0);
    const size = 10;
    const {user, logout, isAuthenticated, loading} = useAuth();
    // Загрузка профиля

    const {profile, loading: profileLoading, error: profileError} = useUserProfile(user?.username);
    const username = profile?.username;

    // Загрузка проектов
    const {
        publicProjects,
        privateProjects,
        totalPages,
        loading: projectsLoading,
        error: projectsError
    } = useUserProjects(username, page, size);

    // Редирект на логин при ошибке профиля
    useEffect(() => {
        if (profileError) {
            navigate('/login');
        }
    }, [profileError, navigate]);

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const handleSaveProfile = (updated) => {
        // здесь можно обновить локальный state, если нужно
    };

    const handleToggleLike = (projectName) => {
        // обновление лайков можно реализовать через рефетч или локальное обновление
    };

    if (profileLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Container sx={{py: 4}}>
            {/* Заголовок профиля */}
            <ProfileHeader profile={profile} onEdit={handleEditOpen}/>
            <EditProfileDialog
                open={editOpen}
                onClose={handleEditClose}
                onSave={handleSaveProfile}
                initialProfile={profile}
            />

            {/* Публичные проекты */}
            <Typography variant="h5" gutterBottom>
                Public Projects
            </Typography>
            {projectsLoading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress/>
                </Box>
            ) : publicProjects?.length === 0 ? (
                <Typography color="text.secondary">No public projects</Typography>
            ) : (
                <Grid container spacing={3}>
                    {publicProjects.map((proj) => (
                        <Grid item xs={12} sm={6} md={4} key={proj.projectName}>
                            <PublicProjectCard project={proj} onToggleLike={handleToggleLike}/>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Divider sx={{my: 4}}/>

            {/* Приватные проекты */}
            <Typography variant="h5" gutterBottom>
                Private Projects
            </Typography>
            {projectsLoading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress/>
                </Box>
            ) : privateProjects?.length === 0 ? (
                <Typography color="text.secondary">No private projects</Typography>
            ) : (
                <Grid container spacing={3}>
                    {privateProjects.map((proj) => (
                        <Grid item xs={12} sm={6} md={4} key={proj.projectName}>
                            <PrivateProjectCard project={proj}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}
