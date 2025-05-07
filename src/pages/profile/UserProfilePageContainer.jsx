import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Pagination,
    Stack,
    Typography,
    useTheme
} from '@mui/material';

import {useUserProfile} from '../../hooks/useUserProfile.jsx';
import {useUserProjects} from '../../hooks/useUserProjects.jsx';
import PublicProjectCard from '../../components/profile/PublicProjectCard.jsx';
import {useAuth} from "../../context/AuthContext.jsx";
import ProfileHeader from "../../components/profile/ProfileHeader.jsx";

export default function UserProfilePageContainer() {
    const {username} = useParams();
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const {user} = useAuth();
    const navigate = useNavigate();

    const {profile, loading: loadingProfile} = useUserProfile(username);
    const {
        publicProjects: projects, totalPages,
        loading: loadingProjects
    } = useUserProjects(username, page, 10);

    if (loadingProfile) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (!profile) {
        return (
            <Typography color="error" align="center" sx={{mt: 4}}>
                Пользователь “{username}” не найден
            </Typography>
        );
    }

    return (
        <Container maxWidth="md" sx={{mt: 4}}>
            {/*asad*/}
            <ProfileHeader avatarSize={80} profile={profile}
                           onEdit={() => navigate(`/${username}/edit`)}></ProfileHeader>

            {/* Профиль */}
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={profile.avatarUrl} sx={{width: 80, height: 100}}/>
                <Box>
                    {!!profile.fullName ?
                        <Box>
                            <Typography variant="h4" color="textPrimary">
                                {profile.fullName}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                @{profile.username}
                            </Typography>
                        </Box>
                        :
                        <Box>
                            <Typography variant="h4" color="textPrimary">
                                @{profile.username}
                            </Typography>
                        </Box>
                    }
                    {profile.description && (
                        <Typography sx={{mt: 1}}>
                            {profile.description}
                        </Typography>
                    )}

                </Box>
            </Stack>

            {user?.username === profile.username && (
                <Box sx={{mt: 2, textAlign: 'right'}}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(`/${username}/edit`)}
                    >
                        Edit
                    </Button>
                </Box>
            )}

            {/* Статистика */}
            <Stack direction="row" spacing={4} sx={{mt: 3, color: theme.palette.text.secondary}}>
                <Typography>Лайков: {profile.likesCount}</Typography>
                <Typography>Просмотров: {profile.viewsCount}</Typography>
                <Typography>Избранное: {profile.favouritesCount}</Typography>
            </Stack>

            {/* Проекты */}
            <Box sx={{my: 4}}>
                <Typography variant="h5" gutterBottom>
                    Проекты пользователя
                </Typography>

                {loadingProjects ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {projects.length > 0 ? (
                            projects.map(p => (
                                <Grid item xs={12} sm={6} key={p.projectName}>
                                    <PublicProjectCard project={p}/>
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
            {!loadingProjects && totalPages > 1 && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={(_, v) => setPage(v - 1)}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
}
