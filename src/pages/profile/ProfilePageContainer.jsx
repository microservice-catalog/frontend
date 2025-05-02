// src/pages/profile/ProfilePageContainer.jsx
import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Container, Divider, Grid, Typography,} from '@mui/material';
import {userApi} from '../../api/api.jsx';
import ProfileHeader from '../../components/profile/ProfileHeader.jsx';
import PublicProjectCard from '../../components/profile/PublicProjectCard.jsx';
import PrivateProjectCard from '../../components/profile/PrivateProjectCard.jsx';
import EditProfileDialog from '../../components/profile/EditProfileDialog.jsx';
import {useNavigate} from "react-router-dom";

export default function ProfilePageContainer() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await userApi.getProfile();
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();

    }, []);

    const handleEditOpen = () => setEditOpen(true);
    const handleEditClose = () => setEditOpen(false);
    const handleSaveProfile = (updated) => setProfile(updated);

    const handleToggleLike = (projectName) => {
        setProfile((prev) => {
            const updatedProjects = prev.publicProjects.map((proj) =>
                proj.projectName === projectName
                    ? {
                        ...proj,
                        likedByMe: !proj.likedByMe,
                        likesCount: proj.likedByMe ? proj.likesCount - 1 : proj.likesCount + 1
                    }
                    : proj
            );
            return {...prev, publicProjects: updatedProjects};
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center" mt={4}>
                    {error}
                </Typography>
            </Container>
        );
    }
    const {username, publicProjects = [], privateProjects = []} = profile;

    return (
        <Container sx={{py: 4}}>
            <ProfileHeader profile={profile} onEdit={handleEditOpen}/>
            <EditProfileDialog
                open={editOpen}
                onClose={handleEditClose}
                onSave={handleSaveProfile}
                initialProfile={profile}
            />

            <Typography variant="h5" gutterBottom>
                Public Projects
            </Typography>
            {publicProjects.length === 0 ? (
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

            <Typography variant="h5" gutterBottom>
                Private Projects
            </Typography>
            {privateProjects.length === 0 ? (
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