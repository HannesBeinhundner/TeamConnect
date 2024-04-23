"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LinkIcon from '@mui/icons-material/Link';
import UserIconText from '../UserIconText/UserIconText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./ViewAllProjectsCard.module.scss";
import Link from "next/link";
import CustomProjectLogo from '@/images/customProjectLogo.svg'
import { Button, IconButton } from '@mui/material';
import { getProjectUsers } from './GetProjectUsersAction';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { deleteProject } from '@/components/ProjectUpdateDialog/DeleteProjectAction';
import ProjectViewDialog from '@/components/ProjectViewDialog/ProjectViewDialog';

interface Props {
    session: any;
    eventData: any;
    projectResult?: any;
    reloadComponent?: any;
}

export default function ViewAllProjectsCard({ session, eventData, reloadComponent, projectResult }: Props) {
    const [projectUsers, setProjectUsers] = useState<any>([]);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

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

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const fetchProjectUsers = async () => {
        const users: any = await getProjectUsers(projectResult.id);
        setProjectUsers(users);
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
    };

    useEffect(() => {
        fetchProjectUsers();
    }, []);

    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.titleArea}>
                <div className={styles.iconName}>
                    <Image src={CustomProjectLogo} alt="Custom Logo" width={53} />
                    <h2>{projectResult?.name}</h2>
                </div>
                <IconButton aria-label="expand" sx={{ color: '#1C1C1C' }} onClick={handleUpdateDialogOpen}>
                    <OpenInFullIcon fontSize="small" />
                </IconButton>
            </div>
            <ProjectViewDialog
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
                session={session}
                eventData={eventData}
                projectResult={projectResult}
                reloadComponent={reloadComponent}
            />
            <div className={styles.propertyArea}>
                <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                <Chip className={styles.chipColor} text={projectUsers} icon={<AssignmentIndIcon fontSize='small' />} />
                <Link href={(projectResult?.link && (projectResult.link.startsWith("https://") || projectResult.link.startsWith("http://"))) ? projectResult.link : "https://" + projectResult?.link} className={styles.chipLink} target="_blank">
                    <Chip className={styles.chipColor} text={projectResult?.link} icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                </Link>
            </div>
            <div className={styles.descriptionArea}>
                <p>{projectResult?.description}</p>
                <div className={styles.buttonWrapper}>
                    {
                        // Show delete button only if the user is an event admin
                        eventData.adminEmail === session.user.email && (
                            <Button variant="contained" color="error" onClick={handleDeleteButtonClick}>
                                Delete Project
                            </Button>
                        )
                    }
                    <Button variant="contained">
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
                </div>
            </div>
        </div>
    );
};
