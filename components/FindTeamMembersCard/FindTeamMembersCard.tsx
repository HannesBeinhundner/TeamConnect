"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import LinkIcon from '@mui/icons-material/Link';
import SchoolIcon from '@mui/icons-material/School';
import styles from "./FindTeamMembersCard.module.scss";
import Link from "next/link";
import ProfilePicture from '@/images/profile_girl.png'
import { Button } from '@mui/material';
import { getProjectUsers } from '../ViewAllProjectsCard/GetProjectUsersAction';

//@ts-ignore
export default function FindTeamMembersCard({ userResult }) {
    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.titleArea}>
                <Link href="#" className={styles.profile}>
                    <Image
                        className={styles.profile}
                        src={ProfilePicture}
                        alt="Girl"
                        style={{
                            objectFit: 'cover',
                        }}
                    />
                </Link>
                <h2>{userResult?.name}</h2>
            </div>
            <div className={styles.propertyArea}>
                <Chip className={styles.chipColor} text={userResult?.major} icon={<SchoolIcon fontSize='small' />} />
                <Link href={"https://" + userResult?.portfolio} className={styles.chipLink} target="_blank" >
                    <Chip className={styles.chipColor} text="Portfolio" icon={<LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />} />
                </Link>
            </div>
            <div className={styles.descriptionArea}>
                <p>{userResult?.description}</p>
                <div className={styles.requestButton}>
                    <Button variant="contained">
                        Contact
                    </Button>
                    <Button variant="contained">
                        Invite to Join
                    </Button>
                </div>
            </div>
        </div>
    );
};
