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
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {projectApi, projectVersionApi} from '../../api/api.jsx';
import {useAuth} from '../../context/AuthContext.jsx';
import InlineDescription from '../../components/projects/InlineDescription.jsx';
import VersionTabs from '../../components/projects/VersionTabs.jsx';
import EnvParamsTable from '../../components/projects/EnvParamsTable.jsx';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CopyableCommand from "../../components/CopyableCommand.jsx";

export default function ProjectPageContainer() {
    const theme = useTheme();
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
                //
                const projRes = await projectApi.getProject(username, projectName);
                setProject(projRes.data);

                // Load versions list
                const versRes = await projectVersionApi.getAllVersions(username, projectName);
                const {versions: versList, defaultVersionName} = versRes.data;
                setVersions(versList);
                setSelectedVer(defaultVersionName);

                // Load selected version details
                const verRes = await projectVersionApi.getProjectVersion(username, projectName, defaultVersionName);
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
            const res = await projectVersionApi.getProjectVersion(username, projectName, ver);
            setVersion(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVersion = async (name) => {
        const res = await projectVersionApi.createVersion(username, projectName, {versionName: name});
        setVersions(vs => [...vs, res.data]);
        setSelectedVer(name);
        setVersion(res.data);
    };

    const handleRenameVersion = async (versionName, newName) => {
        await projectVersionApi.updateVersion(username, projectName, versionName, {name: newName});
        setVersions(vs => vs.map(v => v.versionName === versionName ? {...v, versionName: newName} : v));
        if (selectedVer === versionName) setSelectedVer(newName);
    };

    const handleDeleteVersion = async (versionName) => {
        await projectVersionApi.deleteVersion(username, projectName, versionName);
        setVersions(vs => vs.filter(v => v.versionName !== versionName));
        if (selectedVer === versionName && versions.length > 1) {
            const next = versions.find(v => v.versionName !== versionName).versionName;
            handleVersionSelect(next);
        }
    };

    const handleAddEnv = async (dto) => {
        const res = await projectVersionApi.addEnvParam(username, projectName, selectedVer, dto);
        setVersion(v => ({...v, envParameters: [...v.envParameters, res.data]}));
    };
    const handleUpdateEnv = async (name, dto) => {
        await projectVersionApi.updateEnvParam(username, projectName, selectedVer, name, dto);
        setVersion(v => ({
            ...v,
            envParameters: v.envParameters.map(p => p.name === name ? {...p, ...dto} : p)
        }));
    };
    const handleDeleteEnv = async (name) => {
        await projectVersionApi.deleteEnvParam(username, projectName, selectedVer, name);
        setVersion(v => ({
            ...v,
            envParameters: v.envParameters.filter(p => p.name !== name)
        }));
    };

    const handleCopyCommand = (username, projectName) => {
        try {
            projectApi.incrementPulls(username, projectName);
        } catch (ignored) {
        }
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
                            / {project.projectName}
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
                        Удалить проект
                    </Button>
                )}
            </Box>

            {/* Stats */}
            <Stack
                direction="row"
                spacing={4}
                alignItems="center"
                mb={2}
                sx={{color: theme.palette.text.secondary}}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <ThumbUpIcon fontSize="small" color="inherit"/>
                    <Typography variant="body2">{project.likesCount}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <DownloadIcon fontSize="small" color="inherit"/>
                    <Typography variant="body2">{project.downloadsCount}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon fontSize="small" color="inherit"/>
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
            {version.dockerCommand?.trim() && (
                <CopyableCommand onClick={() => handleCopyCommand(username, projectName)}
                                 command={version.dockerCommand}/>
            )}
            {/* Env Params */}
            <Box sx={{mb: 3}}>
                <Typography variant="subtitle1" gutterBottom>Переменные окружения</Typography>
                <Box sx={{
                    display: "inline-block",
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                }}>
                    <EnvParamsTable
                        params={version.envParameters}
                        onAdd={isOwner ? handleAddEnv : undefined}
                        onUpdate={isOwner ? handleUpdateEnv : undefined}
                        onDelete={isOwner ? handleDeleteEnv : undefined}
                    />
                </Box>
            </Box>
        </Container>
    );
}
