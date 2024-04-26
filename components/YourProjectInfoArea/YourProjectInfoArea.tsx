import React from 'react';
import Image from "next/image";
import Chip from '@/components/Chip/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LinkIcon from '@mui/icons-material/Link';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import UserIconText from '../UserIconText/UserIconText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import styles from "./YourProjectInformationArea.module.scss";
import Link from "next/link";
import CustomProjectLogo from '@/images/customProjectLogo.svg'

//@ts-ignore
export default function YourProjectInformationArea({ projectResult }) {
    return (
        <div className={styles.projectInformationArea}>
            <div className={styles.titleArea}>
                <Image src={projectResult?.image !== 'undefined' ? projectResult?.image : CustomProjectLogo} alt="Custom Logo" width={53} height={53} />
                <h1>{projectResult?.name}</h1>
            </div>
            <div className={styles.propertyArea}>
                <Chip text={projectResult?.type} icon={<CategoryIcon fontSize='small' />} />
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
                {projectResult?.users
                    .sort((a: any, b: any) => (a.projectAdmin === b.projectAdmin ? 0 : a.projectAdmin ? -1 : 1))
                    .map((user: any) => (
                        <div key={user.id}>
                            {user.projectAdmin ? (
                                <UserIconText text={user.name} smallText='MMT Web' icon={<AccountCircleIcon sx={{ fontSize: 30 }} />} />
                            ) : (
                                <UserIconText text={user.name} smallText='MMT Web' icon={<PersonIcon sx={{ fontSize: 30 }} />} />
                            )}
                        </div>
                    ))}
            </div>
            <div className={styles.descriptionArea}>
                <p>{projectResult?.description}</p>
            </div>
        </div>
    );
};
