// src/pages/projects/ProjectPageContainer.jsx
import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import {ContentCopy} from '@mui/icons-material';
import {useNavigate, useParams} from 'react-router-dom';
import {projectApi} from '../../api/api.jsx';
import {useAuth} from '../../context/AuthContext.jsx';
import InlineDescription from '../../components/projects/InlineDescription.jsx';
import VersionTabs from '../../components/projects/VersionTabs.jsx';
import EnvParamsTable from '../../components/projects/EnvParamsTable.jsx';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ProjectPageContainer() {
    const {username, projectName} = useParams();
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();

    const [project, setProject] = useState(null);
    const [version, setVersion] = useState(null);
    const [versions, setVersions] = useState([]);
    const [selectedVer, setSelectedVer] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Determine ownership
    const isOwner = isAuthenticated && (user.username === project?.authorUsername);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Load project metadata
                const projRes = await projectApi.getProject(username, projectName);
                setProject(projRes.data);

                // Load versions list
                const versRes = await projectApi.getAllVersions(username, projectName);
                const {versions: versList, defaultVersionName} = versRes.data;
                setVersions(versList);
                setSelectedVer(defaultVersionName);

                // Load selected version details
                const verRes = await projectApi.getProjectVersion(username, projectName, defaultVersionName);
                setVersion(verRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username, projectName]);

    // Handlers
    const updateDescription = async (newDesc) => {
        await projectApi.updateProject(username, projectName, {description: newDesc});
        setProject(p => ({...p, description: newDesc}));
    };

    const handleVersionSelect = async (ver) => {
        setSelectedVer(ver);
        setLoading(true);
        try {
            const res = await projectApi.getProjectVersion(username, projectName, ver);
            setVersion(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVersion = async (name) => {
        const res = await projectApi.createVersion(username, projectName, {versionName: name});
        setVersions(vs => [...vs, res.data]);
        setSelectedVer(name);
        setVersion(res.data);
    };

    const handleRenameVersion = async (oldName, newName) => {
        await projectApi.updateVersion(username, projectName, oldName, {name: newName});
        setVersions(vs => vs.map(v => v.versionName === oldName ? {...v, versionName: newName} : v));
        if (selectedVer === oldName) setSelectedVer(newName);
    };

    const handleDeleteVersion = async (ver) => {
        await projectApi.deleteVersion(username, projectName, ver);
        setVersions(vs => vs.filter(v => v.versionName !== ver));
        if (selectedVer === ver && versions.length > 1) {
            const next = versions.find(v => v.versionName !== ver).versionName;
            handleVersionSelect(next);
        }
    };

    const handleAddEnv = async (dto) => {
        const res = await projectApi.addEnvParam(username, projectName, selectedVer, dto);
        setVersion(v => ({...v, envParameters: [...v.envParameters, res.data]}));
    };
    const handleUpdateEnv = async (name, dto) => {
        await projectApi.updateEnvParam(username, projectName, selectedVer, name, dto);
        setVersion(v => ({
            ...v,
            envParameters: v.envParameters.map(p => p.name === name ? {...p, ...dto} : p)
        }));
    };
    const handleDeleteEnv = async (name) => {
        await projectApi.deleteEnvParam(username, projectName, selectedVer, name);
        setVersion(v => ({
            ...v,
            envParameters: v.envParameters.filter(p => p.name !== name)
        }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(version.dockerCommand);
    };

    const handleDeleteProject = async () => {
        setConfirmOpen(false);
        await projectApi.deleteProject(username, projectName);
        navigate('/');
    };

    if (loading || !project || !version) {
        return (
            <Box textAlign="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    const formattedDate = new Date(project.createdOn)
        .toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', year: 'numeric'});

    return (
        <Container sx={{py: 4}}>
            {/* Delete Confirmation */}
            {isOwner && (
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Подтвердите удаление</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Удалить проект «{project.projectName}»? Это действие необратимо.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Отмена</Button>
                        <Button color="error" onClick={handleDeleteProject}>Удалить</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h4">
                        {project.authorUsername}
                        <Box component="span" fontWeight="bold" sx={{ml: 1}}>
                            {project.projectName}
                        </Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                        {formattedDate}
                    </Typography>
                    <Typography variant="h5" mt={1}>{project.title}</Typography>
                </Box>
                <Box sx={{flexGrow: 1}}/>
                {isOwner && (
                    <Button variant="contained" color="error" onClick={() => setConfirmOpen(true)}>
                        Delete Project
                    </Button>
                )}
            </Box>

            {/* Stats */}
            <Stack direction="row" spacing={4} alignItems="center" mb={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <ThumbUpIcon fontSize="small" color="action"/>
                    <Typography variant="body2">{project.likesCount}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <CloudDownloadIcon fontSize="small" color="action"/>
                    <Typography variant="body2">{project.downloadsCount}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon fontSize="small" color="action"/>
                    <Typography variant="body2">{project.viewsCount}</Typography>
                </Stack>
            </Stack>
            <Divider sx={{my: 3}}/>

            {/* Tags */}
            <Box mb={3}>
                {project.tags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)}
                        sx={{mr: 1, mb: 1, cursor: 'pointer'}}
                    />
                ))}
            </Box>

            {/* Description */}
            <InlineDescription
                value={project.description}
                onSave={isOwner ? updateDescription : undefined}
            />

            {/* Versions */}
            <VersionTabs
                versions={versions}
                current={selectedVer}
                onSelect={handleVersionSelect}
                onAdd={isOwner ? handleAddVersion : undefined}
                onRename={isOwner ? handleRenameVersion : undefined}
                onDelete={isOwner ? handleDeleteVersion : undefined}
            />

            <Divider sx={{my: 3}}/>

            {/* Version Details */}
            <Stack direction="row" spacing={2} mb={3}>
                <Button href={version.githubLink} target="_blank">GitHub</Button>
                <Button href={version.dockerHubLink} target="_blank">Docker Hub</Button>
            </Stack>
            {
                (!!(version.dockerCommand) && !!(version.dockerCommand.trim())) ?
                    <Box mb={3} position="relative">
                        <Typography variant="subtitle1" gutterBottom>Run Command</Typography>
                        <Box component="pre" sx={{background: '#f5f5f5', p: 2, borderRadius: 1}}>
                            {version.dockerCommand}
                            <IconButton
                                onClick={handleCopy}
                                size="small"
                                sx={{position: 'absolute', top: 8, right: 8}}
                            >
                                <ContentCopy fontSize="small"/>
                            </IconButton>
                        </Box>
                    </Box>
                    : <> </>
            }

            {/* Env Params */}
            <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>Environment Parameters</Typography>
                <EnvParamsTable
                    params={version.envParameters}
                    onAdd={isOwner ? handleAddEnv : undefined}
                    onUpdate={isOwner ? handleUpdateEnv : undefined}
                    onDelete={isOwner ? handleDeleteEnv : undefined}
                />
            </Box>
        </Container>
    );
}
