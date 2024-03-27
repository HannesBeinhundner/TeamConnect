"use client"

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Link from "next/link";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import CloseIcon from '@mui/icons-material/Close';
import styles from "./ConfigCard.module.scss"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from "next-auth/react";
import YourProjectInformationArea from '../YourProjectInfoArea/YourProjectInfoArea';
import ProjectUpdateDialog from '@/components/ProjectUpdateDialog/ProjectUpdateDialog';
import { projectTypes } from '@/app/lib/data'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MuiChipsInput } from 'mui-chips-input'
import { CreateEventSchema } from '@/app/lib/types'
import { CreateEventInputs } from '@/app/lib/types'
import { addEvent } from './AddEventAction';


function createData(
    name: string,
    users: number,
    projects: number,
    link: string,
) {
    return { name, users, projects, link };
}

const rows = [
    createData('Hackathon 2024', 77, 12, 'https://teamconnect.com/invite/a2sdlkjfh'),
    createData('MMP3 Salzburg', 77, 12, 'https://teamconnect.com/invite/a2sdlkjfh'),
];

export default function ConfigCard() {
    const { data: session } = useSession();
    const sessionEmail = session?.user?.email;

    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false)
    const [successAlert, setSucessAlert] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")
    const [copyState, setCopyState] = useState(false);
    const [projectTypeChips, setProjectTypeChips] = useState<string[]>([])
    const [expertiseChips, setExpertiseChips] = useState<string[]>([])


    const handleProjectTypeChange = (newChips: string[]) => {
        setProjectTypeChips(newChips)
    }

    const handleExpertiseChange = (newChips: string[]) => {
        setExpertiseChips(newChips)
    }

    const handleCreateOpen = () => {
        setOpenCreate(true);
    };

    const handleCreateClose = () => {
        reset()
        setOpenCreate(false);
    };
    const handleUpdateOpen = () => {
        setOpenUpdate(true);
    };

    const handleUpdateClose = () => {
        //reset()
        setOpenUpdate(false);
    };

    const handleCloseAlert = () => {
        setSucessAlert(false)
        setErrorAlert(false)
    }

    const {
        register,
        handleSubmit,
        setError,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<CreateEventInputs>({
        resolver: zodResolver(CreateEventSchema)
    })

    const processForm: SubmitHandler<CreateEventInputs> = async data => {
        console.log(data)
        // const result = await addEvent(data, sessionEmail)

        // if (!result) {
        //     alert("Something went wrong")
        //     return
        // }

        // if (result.error) {
        //     setServerErrorMessage(result.error.toString())
        //     setErrorAlert(true)
        //     return
        // }

        // setSucessAlert(true)
        // reset()
        // handleCreateClose()
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Event Settings</h5>
            </div>
            <div className={styles.contentArea}>
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea taLorem ipsum dolor sit amet, consetetur sadipscing elitrLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor</p>

                <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="event table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                    <div className={styles.tableHeaderWrapper}>
                                        <PersonIcon fontSize='small' />
                                        Users
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.tableHeaderWrapper}>
                                        <DesignServicesIcon fontSize='small' />
                                        Projects
                                    </div>
                                </TableCell>
                                <TableCell align="right">
                                    <div className={styles.tableHeaderWrapper}>
                                        <LinkIcon fontSize='small' sx={{ color: '#000000DE' }} />
                                        Invite link
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Link href="/test">
                                            <b>{row.name}</b>
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">

                                        {row.users}</TableCell>
                                    <TableCell align="right">{row.projects}</TableCell>
                                    <TableCell align="right">
                                        <CopyToClipboard text={row.link.toString()} onCopy={() => setCopyState(true)}>
                                            <div className={styles.copyLinkWrapper}>
                                                <ContentCopyIcon fontSize='small' />
                                                <span>{row.link}</span>
                                            </div>
                                        </CopyToClipboard>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton aria-label="open Modal" sx={{ color: '#1C1C1C' }} onClick={handleUpdateOpen}>
                                            <EditIcon fontSize='small' />
                                        </IconButton>
                                        <Dialog
                                            open={openUpdate}
                                            onClose={handleUpdateClose}
                                            fullWidth={true}
                                            maxWidth={"md"}
                                            className={styles.createModal}
                                        >
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button className={styles.createButton} variant="contained" onClick={handleCreateOpen}>
                    Create Event
                </Button>
                <Dialog
                    open={openCreate}
                    onClose={handleCreateClose}
                    fullWidth={true}
                    maxWidth={"md"}
                    className={styles.createModal}
                >
                    <DialogTitle>Create Project</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCreateClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[700],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText sx={{ color: '#1C1C1C' }}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        </DialogContentText>
                        <form onSubmit={handleSubmit(processForm)} className={styles.formContainer}>
                            <TextField
                                margin="dense"
                                id="eventName"
                                label="Event Name*"
                                type="text"
                                fullWidth
                                variant="standard"
                                {...register('eventName')}
                                error={!!errors.eventName}
                                helperText={errors.eventName?.message}
                            />
                            <FormGroup>
                                <FormControlLabel control={<Checkbox {...register('isPartOfEvent')} defaultChecked />} label="As Admin, I want to be part of the event" />
                            </FormGroup>

                            <FormGroup>
                                <FormControlLabel control={<Checkbox {...register('hasMilestones')} />} label="The Event has Milestones or Deadlines" />
                            </FormGroup>

                            <Controller
                                control={control}
                                render={({ field, fieldState }) => (
                                    <MuiChipsInput {...field} error={fieldState.invalid} helperText={fieldState.error?.message} label="Project Types" />
                                )}
                                name="eventProjectType"
                            />

                            <Controller
                                control={control}
                                render={({ field, fieldState }) => (
                                    <MuiChipsInput {...field} error={fieldState.invalid} helperText={fieldState.error?.message} label="User Expertises" />
                                )}
                                name="eventExpertise"
                            />

                            <DialogActions>
                                <Button variant="contained" type="submit">Create</Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
                {
                    successAlert && (
                        <Alert severity="success" onClose={handleCloseAlert} className={styles.alert}>
                            {'Your Event was successfully created!'}
                        </Alert>
                    )
                }
                {
                    errorAlert && (
                        <Alert severity="error" onClose={handleCloseAlert} className={styles.alert}>
                            {serverErrorMessage}
                        </Alert>
                    )
                }
            </div >
        </div >
    );
}
