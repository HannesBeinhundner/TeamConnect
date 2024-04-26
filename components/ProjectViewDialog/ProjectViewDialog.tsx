"use client"
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogActions from '@mui/material/DialogActions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import Alert from '@mui/material/Alert';
import styles from './ProjectViewDialog.module.scss';
import Image from 'next/image';
import CustomProjectLogo from '@/images/customProjectLogo.svg'
import CategoryIcon from '@mui/icons-material/Category';
import Chip from '@/components/Chip/Chip';
import Link from "next/link";
import LinkIcon from '@mui/icons-material/Link';
import UserIconText from '../UserIconText/UserIconText';
import { checkProject } from './CheckProjectAction';
import { deleteProject } from '@/components/ProjectUpdateDialog/DeleteProjectAction';
import AttachFileIcon from '@mui/icons-material/AttachFile';



interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    eventData: any;
    reloadComponent: any;
    projectResult: any;
}

const ProjectViewDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, session, eventData, reloadComponent }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const [projectUsers, setProjectUsers] = useState<any>([]);

    const handleDeleteProject = async () => {
        const result = await deleteProject(projectResult?.id);

        if (!result) {
            alert("Something went wrong");
            return;
        }

        if (result.error) {
            setErrorAlert(true);
            return;
        }
        setSuccessAlert(true);
        setTimeout(() => reloadComponent(), 1500)
    };

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
    };

    const fetchProjectUsers = async () => {
        const projectUsers: any = await checkProject(projectResult.id);
        setProjectUsers(projectUsers);
        console.log(projectResult)
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    useEffect(() => {
        if (successAlert || errorAlert) {
            const timerId = setTimeout(() => {
                handleCloseAlert();
            }, 3000);

            return () => clearTimeout(timerId);
        }
        fetchProjectUsers();
        console.log(projectResult)
    }, [successAlert, errorAlert]);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>Project</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[700],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent className={styles.viewDialog}>
                    <div className={styles.titleArea}>
                        <Image src={projectResult?.image !== 'undefined' ? projectResult?.image : CustomProjectLogo} alt="Custom Logo" width={53} height={53} />
                        <h1>{projectResult?.name}</h1>
                    </div>
                    <div className={styles.propertyArea}>
                        <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                        {
                            projectResult.file !== 'undefined' && (
                                <Link href={projectResult.file} className={styles.chipLink} target="_blank">
                                    <Chip className={styles.chipColor} text={"Project file"} icon={<AttachFileIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                                </Link>
                            )
                        }
                        {
                            projectResult?.link && (
                                <Link href={(projectResult.link.startsWith("https://") || projectResult.link.startsWith("http://")) ? projectResult.link : "https://" + projectResult?.link} className={styles.chipLink} target="_blank">
                                    <Chip className={styles.chipColor} text={projectResult?.link} icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                                </Link>
                            )
                        }
                    </div>
                    <div className={styles.teamArea}>
                        {projectUsers
                            .sort((a: any, b: any) => (a.projectAdmin === b.projectAdmin ? 0 : a.projectAdmin ? -1 : 1))
                            .map((user: any) => (
                                <div key={user.id}>
                                    {user.projectAdmin ? (
                                        <UserIconText text={user.name} smallText={user.expertise} icon={<AccountCircleIcon sx={{ fontSize: 30 }} />} />
                                    ) : (
                                        <UserIconText text={user.name} smallText={user.expertise} icon={<PersonIcon sx={{ fontSize: 30 }} />} />
                                    )}
                                </div>
                            ))}
                    </div>
                    <DialogContentText sx={{ color: '#1C1C1C' }}>
                        {projectResult.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {
                        // Show delete button only if the user is an event admin
                        eventData.adminEmail === session.user.email && (
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Delete Project
                            </Button>
                        )
                    }
                    <Button variant="contained" type="submit">
                        Request to Join
                    </Button>
                    <Dialog
                        open={confirmationDialogOpen}
                        onClose={handleConfirmationDialogClose}
                    >
                        <DialogTitle>Confirm Delete Project</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this Project?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                            <Button onClick={handleDeleteProject} color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
                </DialogActions>
            </Dialog>
            {successAlert && (
                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                    This Project was successfully deleted!
                </Alert>
            )}
            {errorAlert && (
                <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                    This Project couldn't be deleted!
                </Alert>
            )}
        </>
    );
};

export default ProjectViewDialog;
