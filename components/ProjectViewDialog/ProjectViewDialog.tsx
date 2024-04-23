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


interface ProjectUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    session: any;
    projectResult: any;
}

const ProjectViewDialog: React.FC<ProjectUpdateDialogProps> = ({ open, onClose, projectResult, session }) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [projectUsers, setProjectUsers] = useState<any>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [serverErrorMessage, setServerErrorMessage] = useState('');

    const handleCloseAlert = () => {
        setSuccessAlert(false);
        setErrorAlert(false);
    };

    const fetchProjectUsers = async () => {
        const projectUsers: any = await checkProject(projectResult.id);
        setProjectUsers(projectUsers);
        console.log(projectResult)
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
                        <Image src={CustomProjectLogo} alt="Custom Logo" width={53} />
                        <h1>{projectResult?.name}</h1>
                    </div>
                    <div className={styles.propertyArea}>
                        <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                        <Link href={(projectResult?.link && (projectResult.link.startsWith("https://") || projectResult.link.startsWith("http://"))) ? projectResult.link : "https://" + projectResult?.link} className={styles.chipLink} target="_blank">
                            <Chip className={styles.chipColor} text={projectResult?.link} icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                        </Link>
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
                    <Button variant="contained" type="submit">
                        Request to Join
                    </Button>
                </DialogActions>
            </Dialog>
            {successAlert && (
                <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                    {successMessage}
                </Alert>
            )}
            {errorAlert && (
                <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                    {serverErrorMessage}
                </Alert>
            )}
        </>
    );
};

export default ProjectViewDialog;
