import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import {projectApi} from '../../api/api.jsx';
import EditDescriptionDialog from '../../components/projects/EditDescriptionDialog.jsx';
import {useParams} from "react-router-dom";

export default function ProjectPageContainer() {
    const {username, projectName} = useParams();
    const [projectVersion, setProjectVersion] = useState(null);
    const [project, setProject] = useState(null);
    const [versions, setVersions] = useState([]);
    const [selectedVer, setSelectedVer] = useState('');
    const [loading, setLoading] = useState(true);
    const [editDescOpen, setEditDescOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const projectResponse = await projectApi.getProject(username, projectName)
            setProject(projectResponse.data)

            const projectVerrsionResponse = await projectApi.getAllVersions(username, projectName);
            const list = projectVerrsionResponse.data;
            setVersions(list.versions);
            setSelectedVer(list.defaultVersionName);

            const detail = await projectApi.getProjectVersion(username, projectName, list.defaultVersionName);
            setProjectVersion(detail.data);

            setLoading(false);
        };
        load();
    }, [username, projectName]);

    const handleTabChange = async (_, newVer) => {
        setSelectedVer(newVer);
        setLoading(true);
        const detail = await projectApi.getProjectVersion(username, projectName, newVer);
        setProjectVersion(detail.data);
        setLoading(false);
    };

    if (loading || !projectVersion) {
        return <Box textAlign="center" mt={4}><CircularProgress/></Box>;
    }

    return (
        <Container sx={{py: 4}}>
            <Typography variant="h4">
                {project.authorUsername} / <Box component="span" fontWeight="bold">{project.projectName}</Box>
            </Typography>
            <Typography variant="h5" mt={1}>{project.title}</Typography>

            {/* Версии */}
            <Tabs
                value={selectedVer}
                onChange={handleTabChange}
                sx={{mt: 3}}
            >
                {versions.map(v => (
                    <Tab key={v.versionName} label={v.versionName} value={v.versionName}/>
                ))}
            </Tabs>

            <Stack direction="row" spacing={2} mt={2}>
                <Typography>👍 {project.likesCount}</Typography>
                <Typography>⬇️ {project.downloadsCount}</Typography>
                <Typography>👁️ {project.viewsCount}</Typography>
                <Typography>🕒 {new Date(project.createdOn).toLocaleDateString()}</Typography>
            </Stack>

            <Divider sx={{my: 3}}/>

            {/* Описание MD */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Description</Typography>
                <Button size="small" onClick={() => setEditDescOpen(true)}>Edit</Button>
            </Box>
            <Box sx={{border: '1px solid #ddd', p: 2, borderRadius: 1, mb: 3}}>
                <ReactMarkdown>{project.description || '_No description_'}</ReactMarkdown>
            </Box>

            {/* Теги */}
            {
                !!project.tags ?
                    <Box mb={3}>
                        {project.tags.map(tag => <Chip key={tag} label={tag} sx={{mr: 1}}/>)}
                    </Box>
                    : <Box mb={3}>asd</Box>
            }

            {/* Docker / GitHub */}
            <Stack direction="row" spacing={2} mb={3}>
                <Button href={projectVersion.githubLink} target="_blank">GitHub</Button>
                <Button href={projectVersion.dockerHubLink} target="_blank">Docker Hub</Button>
            </Stack>

            {/* Команда */}
            <Box mb={3}>
                <Typography variant="subtitle1">Run Command</Typography>
                <Box component="pre" sx={{background: '#f5f5f5', p: 2, borderRadius: 1}}>
                    {projectVersion.dockerCommand}
                </Box>
            </Box>

            {/* Env params */}
            <Box mb={3}>
                <Typography variant="subtitle1">Environment Parameters</Typography>
                <Grid container spacing={2} mt={1}>
                    {projectVersion.envParameters.map(p => (
                        <Grid key={p.name} item xs={12} sm={6} md={4}>
                            <Box sx={{p: 2, border: '1px solid #eee', borderRadius: 1}}>
                                <Typography><b>{p.name}</b> {p.required && '(required)'}</Typography>
                                <Typography variant="body2">Default: {p.defaultValue || '-'}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <EditDescriptionDialog
                open={editDescOpen}
                initialValue={project.description}
                onClose={() => setEditDescOpen(false)}
                onSave={async (newDesc) => {
                    await projectApi.updateProject(username, projectName, {description: newDesc});
                    setProjectVersion(p => ({...p, description: newDesc}));
                    setEditDescOpen(false);
                }}
            />
        </Container>
    );
}
