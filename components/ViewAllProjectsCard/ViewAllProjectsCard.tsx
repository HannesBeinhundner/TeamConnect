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
import { joinProject } from './JoinProjectAction';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteProject } from '@/components/ProjectUpdateDialog/DeleteProjectAction';
import { getUserData } from './getUserAction';
import ProjectViewDialog from '@/components/ProjectViewDialog/ProjectViewDialog';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation'

interface Props {
    session: any;
    eventData: any;
    projectResult?: any;
    reloadComponent?: any;
}

export default function ViewAllProjectsCard({ session, eventData, reloadComponent, projectResult }: Props) {

    const [reloadKey, setReloadKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [projectUsers, setProjectUsers] = useState<any>([]);
    const [userData, setUserData] = useState<any>([]);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [otherProjectJoinDialogOpen, setOtherProjectJoinDialogOpen] = useState(false);
    const router = useRouter()

    const reloadCurrentComponent = () => {
        setReloadKey(prevKey => prevKey + 1);
    };

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

    const handleJoinProject = async () => {
        const userData = await joinProject(session.user.email, projectResult?.id);

        if (!userData) {
            toast.error('You could not join the project!');
            return;
        }

        //redirect to dashboard with flag joined=true
        router.push(`/${eventData.id}?joined=true`);
    };

    const fetchProjectUsers = async () => {
        const users: any = await getProjectUsers(projectResult.id);
        setProjectUsers(users);
    };

    const fetchUserData = async () => {
        const userData: any = await getUserData(session.user.email);
        setUserData(userData);
        setIsLoading(false)
    };

    useEffect(() => {
        fetchProjectUsers();
        fetchUserData();
    }, []);

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const handleDeleteButtonClick = () => {
        setConfirmationDialogOpen(true);
    };

    const handleJoinButtonClick = () => {
        setJoinDialogOpen(true);
    };

    const handleOtherProjectJoinButtonClick = () => {
        setOtherProjectJoinDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const handleJoinDialogClose = () => {
        setJoinDialogOpen(false);
    };

    const handleOtherProjectJoinDialogClose = () => {
        setOtherProjectJoinDialogOpen(false);
    };

    function LoadingBox({ children }: any) {
        return (
            <div
                style={{
                    display: 'block',
                    lineHeight: 4.5,
                }}
            >
                {children}
            </div>
        );
    }

    return (

        <div className={styles.projectInformationArea}>
            {
                isLoading ? <Skeleton wrapper={LoadingBox} height={35} count={4} width={"100%"} /> : (
                    <>
                        <div className={styles.titleArea}>
                            <div className={styles.iconName}>
                                <Image className={styles.projectLogo} src={projectResult?.image !== 'undefined' ? projectResult?.image : CustomProjectLogo} alt="Custom Logo" layout='responsive' style={{
                                    objectFit: 'contain'
                                }} width={53} height={53} />
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
                            reloadComponent={reloadCurrentComponent}
                            key={reloadKey}
                            userData={userData}
                            handleDeleteButtonClick={handleDeleteButtonClick}
                            handleJoinButtonClick={handleJoinButtonClick}
                            handleOtherProjectJoinButtonClick={handleOtherProjectJoinButtonClick}
                        />
                        <div className={styles.propertyArea}>
                            <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                            <Chip className={styles.chipColor} text={projectUsers} icon={<AssignmentIndIcon fontSize='small' />} />
                            {
                                projectResult.file !== 'undefined' && (
                                    <Link href={projectResult.file} className={styles.chipLink} target="_blank">
                                        <Chip className={styles.chipColor} text={"Project PDF"} icon={<AttachFileIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                                    </Link>
                                )
                            }
                            {
                                (projectResult?.link !== 'undefined' && projectResult?.link !== '') && (
                                    <Link href={(projectResult.link.startsWith("https://") || projectResult.link.startsWith("http://")) ? projectResult.link : "https://" + projectResult?.link} className={styles.chipLink} target="_blank">
                                        <Chip className={styles.chipColor} text={projectResult?.link.replace(/(^\w+:|^)\/\//, '')} icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
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
                                {
                                    userData.projectId == null ? (
                                        <Button variant="contained" onClick={handleJoinButtonClick}>
                                            Join
                                        </Button>
                                    ) : (userData.projectId !== projectResult?.id && userData.projectAdmin === false) ? (
                                        <Button variant="contained" onClick={handleOtherProjectJoinButtonClick}>
                                            Join other Project
                                        </Button>
                                    ) : null
                                }

                                <Dialog
                                    open={confirmationDialogOpen}
                                    onClose={handleConfirmationDialogClose}
                                >
                                    <DialogTitle>Confirm Delete Project</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to delete <strong>{projectResult?.name}</strong>?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                                        <Button onClick={handleDeleteProject} color="error">Delete</Button>
                                    </DialogActions>
                                </Dialog>

                                <Dialog
                                    open={joinDialogOpen}
                                    onClose={handleJoinDialogClose}
                                >
                                    <DialogTitle>Confirm Join Project</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to join the project <strong>{projectResult.name}?</strong>
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleJoinDialogClose}>Cancel</Button>
                                        <Button onClick={handleJoinProject} color="success">Join</Button>
                                    </DialogActions>
                                </Dialog>

                                <Dialog
                                    open={otherProjectJoinDialogOpen}
                                    onClose={handleOtherProjectJoinDialogClose}
                                >
                                    <DialogTitle>Confirm Join Project</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Are you sure you want to join the project <strong>{projectResult.name}?</strong>
                                        </DialogContentText>
                                        <DialogContentText>
                                            You will be removed from your current team!
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleOtherProjectJoinDialogClose}>Cancel</Button>
                                        <Button onClick={handleJoinProject} color="success">Join</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};
