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
import styles from "./ViewAllProjectsCard.module.scss";
import Link from "next/link";
import CustomProjectLogo from '@/images/customProjectLogo.svg'
import { Button } from '@mui/material';
import { getProjectUsers } from './GetProjectUsersAction';

//@ts-ignore
export default function ViewAllProjectsCard({ projectResult }) {
    const [projectUsers, setProjectUsers] = useState('');

    const fetchProjectUsers = async () => {
        const students: any = await getProjectUsers(projectResult.id);
        console.log(students)
        setProjectUsers(students);
    };
 
    useEffect(() => {
        fetchProjectUsers();
    }, []);
    
    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.titleArea}>
                <Image src={CustomProjectLogo} alt="Custom Logo" width={53} />
                <h1>{projectResult?.name}</h1>
            </div>
            <div className={styles.propertyArea}>
                <Chip className={styles.chipColor} text={projectResult?.status} icon={<CheckCircleOutlineIcon fontSize='small' sx={{ color: 'success.main' }} />} />
                <Chip className={styles.chipColor} text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
                <Chip className={styles.chipColor} text={projectResult?.supervisor} icon={<AssignmentIndIcon fontSize='small' />} />
                <Chip className={styles.chipColor} text={projectUsers} icon={<AssignmentIndIcon fontSize='small' />} />
                <Link href={"https://" + projectResult?.link} className={styles.chipLink} target="_blank" >
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
