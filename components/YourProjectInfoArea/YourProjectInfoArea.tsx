import React, { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import Button from '@mui/material/Button';
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
import UserChip from '../UserChip/UserChip';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { removeUserFromProject } from './RemoveUserProjectAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//@ts-ignore
export default function YourProjectInformationArea({ projectResult, reloadComponent }) {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

    const handleDeleteRemoveClick = (userId: any) => {
        setSelectedUserId(userId)
        setConfirmationDialogOpen(true);
    };

    const handleConfirmationDialogClose = () => {
        setConfirmationDialogOpen(false);
    };

    const handleRemoveUser = async () => {
        const result = await removeUserFromProject(selectedUserId);

        if (!result) {
            toast.error('Unexpected error occurred!');
            return;
        }

        if (result.error) {
            toast.success('User could not be removed!');
            return;
        }
        toast.success('User was successfully removed!');
        setConfirmationDialogOpen(false);
        reloadComponent()
    }

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
                            {
                                user.projectAdmin ? (
                                    <UserChip userIconText={
                                        <UserIconText text={user.name} smallText={user.expertise} icon={<AccountCircleIcon sx={{ fontSize: 30 }} />} />
                                    }
                                    />
                                ) : (
                                    // show remove functionality only when currentUser is proecjt admin
                                    projectResult.currentUser.projectAdmin ? (
                                        <>
                                            <UserChip userIconText={
                                                <UserIconText text={user.name} smallText={user.expertise} icon={<PersonIcon sx={{ fontSize: 30 }} />} />
                                            }
                                                rightIcon={<IconButton
                                                    aria-label="close"
                                                    onClick={() => handleDeleteRemoveClick(user.id)}
                                                >
                                                    <ClearIcon sx={{ fontSize: 18 }} />
                                                </IconButton>}
                                            />
                                            <Dialog
                                                open={confirmationDialogOpen}
                                                onClose={handleConfirmationDialogClose}
                                            >
                                                <DialogTitle>Confirm Remove User</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Are you sure you want to remove {user.name} from the project?
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                                                    <Button onClick={() => handleRemoveUser()} color="error">Remove</Button>
                                                </DialogActions>
                                            </Dialog>
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
            </div>
            <div className={styles.descriptionArea}>
                <p>{projectResult?.description}</p>
            </div>
        </div>
    );
};
