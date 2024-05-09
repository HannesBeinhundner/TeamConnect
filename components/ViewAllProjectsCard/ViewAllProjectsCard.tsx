"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LinkIcon from '@mui/icons-material/Link';
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
import { deleteProject } from '@/components/ProjectUpdateDialog/DeleteProjectAction';
import ProjectViewDialog from '@/components/ProjectViewDialog/ProjectViewDialog';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

    const handleDeleteProject = async () => {
        const result = await deleteProject(projectResult?.id);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.error('The Project could not be deleted!');
            return;
        }

        toast.success('The Project was successfully deleted!');
        reloadComponent();
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

    useEffect(() => {
        fetchProjectUsers();
    }, []);

    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.titleArea}>
                <div className={styles.iconName}>
                    <Image src={projectResult?.image !== 'undefined' ? projectResult?.image : CustomProjectLogo} alt="Custom Logo" width={53} height={53} />
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
                                Are you sure you want to delete {projectResult?.name}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                            <Button onClick={handleDeleteProject} color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
