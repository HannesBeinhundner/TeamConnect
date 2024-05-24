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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import styles from './ProjectViewDialog.module.scss';
import Image from 'next/image';
import UserChip from '../UserChip/UserChip';
import ClearIcon from '@mui/icons-material/Clear';
import CustomProjectLogo from '@/images/customProjectLogo.svg'
import CategoryIcon from '@mui/icons-material/Category';
import Chip from '@/components/Chip/Chip';
import Link from "next/link";
import LinkIcon from '@mui/icons-material/Link';
import UserIconText from '../UserIconText/UserIconText';
import { checkProject } from './CheckProjectAction';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { removeUserFromProject } from '@/components/YourProjectInfoArea/RemoveUserProjectAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    eventData: any;
    reloadComponent: any;
    projectResult: any;
    userData: any;
    handleDeleteButtonClick: any;
    handleJoinButtonClick: any;
    handleOtherProjectJoinButtonClick: any;
}

const ProjectViewDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, session, eventData, reloadComponent, userData, handleDeleteButtonClick, handleJoinButtonClick, handleOtherProjectJoinButtonClick }) => {
    const [selectedUser, setSelectedUser] = useState<any>();
    const [removeConfirmationDialogOpen, setRemoveConfirmationDialogOpen] = useState(false);
    const [projectUsers, setProjectUsers] = useState<any>([]);

    const fetchProjectUsers = async () => {
        const projectUsers: any = await checkProject(projectResult.id);
        setProjectUsers(projectUsers);
    };

    const handleRemoveClick = (user: any) => {
        setSelectedUser(user)
        setRemoveConfirmationDialogOpen(true);
    };

    const handleRemoveUser = async () => {
        const result = await removeUserFromProject(selectedUser?.id);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.success('User could not be removed!');
            return;
        }

        toast.success('User was successfully removed!');
        reloadComponent()
    }

    const handleConfirmationDialogClose = () => {
        setRemoveConfirmationDialogOpen(false);
    };

    useEffect(() => {
        fetchProjectUsers();
    }, []);

    return (
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
                    <Image className={styles.projectLogo} src={projectResult?.image !== 'undefined' ? projectResult?.image : CustomProjectLogo} alt="Custom Logo" layout='responsive' style={{
                        objectFit: 'contain',
                    }} width={60} height={60} />
                    <h1 className={styles.projectName}>{projectResult?.name}</h1>
                </div>
                <div className={styles.propertyArea}>
                    <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
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
                <div className={styles.teamArea}>
                    {projectUsers
                        .sort((a: any, b: any) => (a.projectAdmin === b.projectAdmin ? 0 : a.projectAdmin ? -1 : 1))
                        .map((user: any) => (
                            <div key={user.id}>
                                {
                                    user.projectAdmin ? (
                                        // show remove functionality only when currentUser is event admin but not for his own project (so he cant delete himself)
                                        (session.user.email === eventData.adminEmail) && (userData.projectId !== user.projectId) ?
                                            (
                                                <UserChip userIconText={
                                                    <UserIconText text={user.name} smallText={user.expertise} icon={<ManageAccountsIcon sx={{ fontSize: 30 }} />} />
                                                }
                                                    rightIcon={<IconButton
                                                        aria-label="close"
                                                        onClick={() => handleRemoveClick(user)}
                                                    >
                                                        <ClearIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>}
                                                />
                                            ) : (
                                                <UserChip userIconText={
                                                    <UserIconText text={user.name} smallText={user.expertise} icon={<ManageAccountsIcon sx={{ fontSize: 30 }} />} />
                                                }
                                                />
                                            )
                                    ) : (
                                        // show remove functionality only when currentUser is event admin and not for his own project (so he cant delete himself)                                 
                                        (session.user.email === eventData.adminEmail) && (userData.projectId !== user.projectId) ? (
                                            <>
                                                <UserChip userIconText={
                                                    <UserIconText text={user.name} smallText={user.expertise} icon={<PersonIcon sx={{ fontSize: 30 }} />} />
                                                }
                                                    rightIcon={<IconButton
                                                        aria-label="close"
                                                        onClick={() => handleRemoveClick(user)}
                                                    >
                                                        <ClearIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>}
                                                />
                                            </>
                                        ) : (
                                            <UserChip userIconText={
                                                <UserIconText text={user.name} smallText={user.expertise} icon={<PersonIcon sx={{ fontSize: 30 }} />} />
                                            }
                                            />
                                        )
                                    )
                                }
                            </div>
                        ))}
                    <Dialog
                        open={removeConfirmationDialogOpen}
                        onClose={handleConfirmationDialogClose}
                    >
                        <DialogTitle>Confirm Remove User</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to remove <strong>{selectedUser?.name}</strong> from the project?
                                {
                                    selectedUser?.projectAdmin && (<strong> This user is a project admin and therefore the project will be deleted!</strong>)
                                }
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                            <Button onClick={() => handleRemoveUser()} color="error">Remove</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <DialogContentText sx={{ color: '#1C1C1C' }}>
                    <div>
                        <div className={styles.textArea}>
                            <h4>Description</h4>
                            <p>{projectResult?.description}</p>
                        </div>
                        <div className={styles.textArea}>
                            <h4>Preferred skills and expertise</h4>
                            <p>{projectResult?.skills ? projectResult?.skills : 'not defined'}</p>
                        </div>
                    </div>
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
            </DialogActions>
        </Dialog>
    );
};

export default ProjectViewDialog;
