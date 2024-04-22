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
import ProjectViewDialog from '@/components/ProjectViewDialog/ProjectViewDialog';

//@ts-ignore
export default function ViewAllProjectsCard({ projectResult }) {
    const [projectUsers, setProjectUsers] = useState('');
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    const fetchProjectUsers = async () => {
        const users: any = await getProjectUsers(projectResult.id);
        setProjectUsers(users);
    };

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
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
            <ProjectViewDialog>
                open={updateDialogOpen}
                onClose={handleUpdateDialogClose}
            </ProjectViewDialog>
            <div className={styles.propertyArea}>
                <Chip className={styles.chipColor} text={projectResult?.status} icon={<CheckCircleOutlineIcon fontSize='small' sx={{ color: 'success.main' }} />} />
                <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                <Chip className={styles.chipColor} text={projectUsers} icon={<AssignmentIndIcon fontSize='small' />} />
                <Link href={(projectResult?.link && (projectResult.link.startsWith("https://") || projectResult.link.startsWith("http://"))) ? projectResult.link : "https://" + projectResult?.link} className={styles.chipLink} target="_blank">
                    <Chip className={styles.chipColor} text={projectResult?.link} icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                </Link>
            </div>
            <div className={styles.descriptionArea}>
                <p>{projectResult?.description}</p>
                <div className={styles.requestButton}>
                    <Button variant="contained">
                        Request to Join
                    </Button>
                </div>
            </div>
        </div>
    );
};
