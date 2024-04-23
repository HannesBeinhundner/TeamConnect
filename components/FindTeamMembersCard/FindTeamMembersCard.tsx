"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import LinkIcon from '@mui/icons-material/Link';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./FindTeamMembersCard.module.scss";
import Link from "next/link";
import ProfilePicture from '@/images/profile_girl.png'
import { Button, IconButton } from '@mui/material';
import { getProjectUsers } from '../ViewAllProjectsCard/GetProjectUsersAction';
import FindTeamMembersViewDialog from '@/components/FindTeamMembersViewDialog/FindTeamMembersViewDialog';

//@ts-ignore
export default function FindTeamMembersCard({ userResult, session }) {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

    const handleUpdateDialogOpen = () => {
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.topArea}>
                <div className={styles.headArea}>
                    <div className={styles.titleArea}>
                        <Link href="#" className={styles.profile}>
                            <Image
                                className={styles.profile}
                                src={userResult.image}
                                alt="Profile picture of user"
                                width={50}
                                height={50}
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </Link>
                        <h2>{userResult?.name}</h2>
                    </div>
                    <IconButton aria-label="expand" sx={{ color: '#1C1C1C' }} onClick={handleUpdateDialogOpen}>
                            <OpenInFullIcon fontSize="small" />
                    </IconButton>
                </div>
                <div className={styles.propertyArea}>
                    <Chip className={styles.chipColor} text={userResult?.expertise} icon={<SchoolIcon fontSize='small' />} />
                    <Link href={`mailto:${userResult?.email}`} className={styles.chipLink} target="_blank">
                        <Chip className={styles.chipColor} text={userResult?.email} icon={<EmailIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                    </Link>
                </div>
            </div>
            <div className={styles.descriptionArea}>
                <p>{userResult?.description}</p>
                <div className={styles.requestButton}>
                    {/* <Button variant="contained">
                        Contact
                    </Button> */}
                    <Button variant="contained">
                        Invite to Join
                    </Button>
                </div>
            </div>
            <FindTeamMembersViewDialog
                    open={updateDialogOpen}
                    onClose={handleUpdateDialogClose}
                    session={session}
                    userResult={userResult}
                />
        </div>
    );
};
