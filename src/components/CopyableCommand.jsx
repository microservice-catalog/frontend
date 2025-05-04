// src/components/CopyableCommand.jsx
import React, {useRef, useState} from 'react';
import {Box, IconButton, Snackbar, Tooltip, Typography, useTheme} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function CopyableCommand({command}) {
    const theme = useTheme();
    const [openSnack, setOpenSnack] = useState(false);
    const preRef = useRef(null);

    const handleCopy = async () => {
        try {
            // Копируем текст команды
            await navigator.clipboard.writeText(command);
            setOpenSnack(true);
        } catch (err) {
            console.error('Copy failed', err);
        }
    };

    return (
        <Box mb={3} position="relative">
            <Typography variant="subtitle1" gutterBottom>
                Команда запуска
            </Typography>

            <Box
                component="pre"
                ref={preRef}
                sx={theme => ({
                    position: 'relative',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontFamily: 'Consolas, Menlo, monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    overflowX: 'auto',
                })}
            >
                {command}

                <Tooltip title="Скопировать" arrow placement="top">
                    <IconButton
                        onClick={handleCopy}
                        size="small"
                        sx={{
                            position: 'absolute',
                            p: 1,
                            top: 8,
                            right: 8,
                            backgroundColor: theme => theme.palette.background.default,
                            '&:hover': {backgroundColor: theme.palette.action.hover}
                        }}
                    >
                        <ContentCopyIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </Box>

            <Snackbar
                open={openSnack}
                autoHideDuration={2000}
                onClose={() => setOpenSnack(false)}
                message="Скопировано в буфер обмена"
            />
        </Box>
    );
}
