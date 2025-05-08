import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {useParams} from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactMarkdown from 'react-markdown';
import {projectApi, projectVersionApi} from '../../api/api.jsx';
import {useAuth} from '../../context/AuthContext.jsx';
import TagList from '../../components/common/TagList.jsx';
import CopyableCommand from '../../components/CopyableCommand.jsx';
import EnvParamsTable from '../../components/projects/EnvParamsTable.jsx';
import {LinkEditDialog} from '../../components/projects/LinkEditDialog.jsx';
import {TagEditDialog} from '../../components/projects/TagEditDialog.jsx';

export default function ProjectPageContainer() {
    const {username, projectName} = useParams();
    const {user, isAuthenticated} = useAuth();
    const isOwner = isAuthenticated && user?.username === username;

    const [project, setProject] = useState(null);
    const [versions, setVersions] = useState([]);
    const [selectedVer, setSelectedVer] = useState('');
    const [versionDetail, setVersionDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tagDialogOpen, setTagDialogOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [descEdit, setDescEdit] = useState(false);
    const [descDraft, setDescDraft] = useState('');
    const [preview, setPreview] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const projRes = await projectApi.getProject(username, projectName);
                setProject(projRes.data);
                setDescDraft(projRes.data.description || '');
                const versRes = await projectVersionApi.getAllVersions(username, projectName);
                setVersions(versRes.data.versions);
                const defaultVer = versRes.data.defaultVersionName;
                setSelectedVer(defaultVer);
                const verRes = await projectVersionApi.getProjectVersion(username, projectName, defaultVer);
                setVersionDetail(verRes.data);
                setDescDraft(verRes.data.description || '');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username, projectName]);

    const handleVersionChange = async (e) => {
        const ver = e.target.value;
        setSelectedVer(ver);
        setLoading(true);
        try {
            const res = await projectVersionApi.getProjectVersion(username, projectName, ver);
            setVersionDetail(res.data);
            setDescDraft(res.data.description || '');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);

    const handleRename = async () => {
        handleMenuClose();
        const name = window.prompt('Новое имя версии', selectedVer);
        if (!name) return;
        try {
            await projectVersionApi.updateVersion(username, projectName, selectedVer, {name});
            setVersions(vs => vs.map(v => v.versionName === selectedVer ? {...v, versionName: name} : v));
            setSelectedVer(name);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTogglePrivate = async () => {
        handleMenuClose();
        try {
            const verObj = versions.find(v => v.versionName === selectedVer);
            await projectVersionApi.updateVersion(username, projectName, selectedVer, {isPrivate: !verObj.isPrivate});
            setVersions(vs => vs.map(v => v.versionName === selectedVer ? {...v, isPrivate: !verObj.isPrivate} : v));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetDefault = async () => {
        handleMenuClose();
        try {
            await projectVersionApi.updateVersion(username, projectName, selectedVer, {default: true});
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        handleMenuClose();
        if (!window.confirm(`Удалить версию ${selectedVer}?`)) return;
        try {
            await projectVersionApi.deleteVersion(username, projectName, selectedVer);
            const rest = versions.filter(v => v.versionName !== selectedVer);
            setVersions(rest);
            if (rest.length) setSelectedVer(rest[0].versionName);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDescSave = async () => {
        try {
            await projectVersionApi.updateVersion(username, projectName, selectedVer, {description: descDraft});
            setVersionDetail(v => ({...v, description: descDraft}));
            setDescEdit(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddEnv = async (dto) => {
        try {
            const {data} = await projectVersionApi.addEnvParam(username, projectName, selectedVer, dto);
            setVersionDetail(v => ({...v, envParameters: [...v.envParameters, data]}));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateEnv = async (name, dto) => {
        try {
            await projectVersionApi.updateEnvParam(username, projectName, selectedVer, name, dto);
            setVersionDetail(v => ({
                ...v,
                envParameters: v.envParameters.map(p => p.name === name ? {...p, ...dto} : p)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteEnv = async (name) => {
        try {
            await projectVersionApi.deleteEnvParam(username, projectName, selectedVer, name);
            setVersionDetail(v => ({
                ...v,
                envParameters: v.envParameters.filter(p => p.name !== name)
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCopyCommand = () => {
        projectVersionApi.incrementPulls?.(username, projectName).catch(() => {
        });
    };

    const handleLinksSave = async ({github, docker}) => {
        try {
            await projectVersionApi.updateVersion(username, projectName, selectedVer, {
                githubLink: github,
                dockerHubLink: docker
            });
            setVersionDetail(v => ({...v, githubLink: github, dockerHubLink: docker}));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !versionDetail) {
        return <Box textAlign="center" mt={4}><CircularProgress/></Box>;
    }

    return (
        <Container sx={{py: 4}}>
            <TagEditDialog
                open={tagDialogOpen}
                initialTags={project.tags || []}
                onClose={() => setTagDialogOpen(false)}
                onSave={tags => setVersionDetail(v => ({...v, tags}))}
                username={username}
                projectName={projectName}
            />

            <LinkEditDialog
                open={linkDialogOpen}
                initial={{github: versionDetail.githubLink, docker: versionDetail.dockerHubLink}}
                onClose={() => setLinkDialogOpen(false)}
                onSave={handleLinksSave}
            />

            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Typography variant="h4">{projectName}</Typography>
                <Button variant="outlined" onClick={() => setTagDialogOpen(true)} disabled={!isOwner}>Редактировать
                    теги</Button>
            </Stack>

            {/* Tags */}
            <TagList tags={project.tags || []} onTagClick={() => {
            }}/>

            {/* Description */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
                <Typography variant="h6">Описание</Typography>
                {isOwner && (
                    descEdit
                        ? <>
                            <Button size="small" onClick={handleDescSave}>Сохранить</Button>
                            <Button size="small" onClick={() => {
                                setDescEdit(false);
                                setDescDraft(project.description || '');
                            }}>Отмена</Button>
                            <Button size="small"
                                    onClick={() => setPreview(p => !p)}>{preview ? 'Скрыть предпросмотр' : 'Показать предпросмотр'}</Button>
                        </>
                        : <Button size="small" onClick={() => setDescEdit(true)}>Редактировать</Button>
                )}
            </Stack>
            {(descEdit && !preview)
                ? <TextField multiline fullWidth minRows={6} value={descDraft}
                             onChange={e => setDescDraft(e.target.value)} sx={{mt: 1}}/>
                : null
            }
            {(preview || !descEdit) && (
                <Box sx={{border: '1px solid #ddd', p: 2, borderRadius: 1, mt: 1}}>
                    <ReactMarkdown>{descEdit ? descDraft : project.description || '_'}</ReactMarkdown>
                </Box>
            )}

            {/* Versions */}
            <Stack direction="row" alignItems="center" spacing={2} mt={3}>
                <FormControl variant="outlined" size="small">
                    <InputLabel>Версия</InputLabel>
                    <Select value={selectedVer} label="Версия" onChange={handleVersionChange} variant="outlined">
                        {versions.map(v => (
                            <MenuItem key={v.versionName} value={v.versionName}>
                                {v.versionName} {v.isPrivate && <LockIcon fontSize="small" color="error"/>}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {isOwner && (
                    <Button variant="outlined" size="small" startIcon={<MoreVertIcon/>}
                            onClick={handleMenuOpen}>Меню</Button>
                )}
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleRename}>Переименовать</MenuItem>
                    <MenuItem
                        onClick={handleTogglePrivate}>{versions.find(v => v.versionName === selectedVer)?.isPrivate ? 'Сделать публичной' : 'Сделать приватной'}</MenuItem>
                    <MenuItem onClick={handleSetDefault}>Сделать по умолчанию</MenuItem>
                    <MenuItem onClick={handleDelete}>Удалить</MenuItem>
                </Menu>
            </Stack>

            {/* Links Table */}
            <Table sx={{mt: 3}}>
                <TableBody>
                    <TableRow>
                        <TableCell>GitHub</TableCell>
                        <TableCell>{versionDetail.githubLink || '-'}</TableCell>
                        <TableCell>
                            <Button
                                variant="outlined"
                                size="small"
                                component="a"
                                href={versionDetail.githubLink}
                                target="_blank"
                                disabled={!versionDetail.githubLink}
                            >Открыть</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Docker Hub</TableCell>
                        <TableCell>{versionDetail.dockerHubLink || '-'}</TableCell>
                        <TableCell>
                            <Button
                                variant="outlined"
                                size="small"
                                component="a"
                                href={versionDetail.dockerHubLink}
                                target="_blank"
                                disabled={!versionDetail.dockerHubLink}
                            >Открыть</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {isOwner && <Button sx={{mt: 1}} onClick={() => setLinkDialogOpen(true)}>Редактировать ссылки</Button>}

            <Divider sx={{my: 3}}/>

            {versionDetail.dockerCommand && (
                <CopyableCommand command={versionDetail.dockerCommand} onCopy={handleCopyCommand} sx={{mb: 3}}/>
            )}

            {/* Environment Parameters */}
            <Box>
                <Typography variant="subtitle1" gutterBottom>Переменные окружения</Typography>
                <EnvParamsTable
                    params={versionDetail.envParameters}
                    onAdd={isOwner ? handleAddEnv : undefined}
                    onUpdate={isOwner ? handleUpdateEnv : undefined}
                    onDelete={isOwner ? handleDeleteEnv : undefined}
                />
            </Box>
        </Container>
    );
}
