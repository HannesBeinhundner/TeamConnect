"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Link from "next/link";
import { Tooltip } from '@mui/material'
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from "./ConfigCard.module.scss"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from "next-auth/react";
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
import { getEvents } from './GetEventsAction';
import EventUpdateDialog from '../EventUpdateDialog/EventUpdateDialog';


export default function ConfigCard() {
    const { data: session } = useSession();
    const sessionEmail = session?.user?.email;

    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState<Record<string, boolean>>({});
    const [errorAlert, setErrorAlert] = useState(false)
    const [successAlert, setSucessAlert] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState("")
    const [copiedEventId, setCopiedEventId] = useState<string | null>(null);
    const [projectTypeChips, setProjectTypeChips] = useState<string[]>([])
    const [expertiseChips, setExpertiseChips] = useState<string[]>([])
    const [checkEventResult, setCheckEventResult] = useState(false);
    const [eventResult, setEventResult] = useState<any>([]);


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

    const handleUpdateOpen = (id: string) => {
        setOpenUpdate(prevState => ({ ...prevState, [id]: true }));
    };

    const handleUpdateClose = (id: string) => {
        setOpenUpdate(prevState => ({ ...prevState, [id]: false }));
    };

    const handleCloseAlert = () => {
        setSucessAlert(false)
        setErrorAlert(false)
    }

    const handleTooltipOpen = (eventId: string) => {
        setCopiedEventId(eventId);
        setTimeout(() => {
            handleTooltipClose();
        }, 2000);
    };

    const handleTooltipClose = () => {
        setCopiedEventId(null);
    }

    useEffect(() => {
        if (successAlert || errorAlert) {
            const timerId = setTimeout(() => {
                handleCloseAlert();
            }, 3000);

            return () => clearTimeout(timerId);
        }
    }, [successAlert, errorAlert]);

    const fetchEvents = async () => {
        const eventResult: any = await getEvents(sessionEmail);
        eventResult ? setCheckEventResult(true) : setCheckEventResult(false)
        setEventResult(eventResult);
        console.log(eventResult)
    };

    useEffect(() => {
        fetchEvents();
    }, []);

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
        const result = await addEvent(data, sessionEmail)

        if (!result) {
            alert("Something went wrong")
            return
        }

        if (result.error) {
            setServerErrorMessage(result.error.toString())
            setErrorAlert(true)
            return
        }

        setSucessAlert(true)
        reset()
        handleCreateClose()
        fetchEvents()
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Event Settings</h5>
            </div>
            <div className={styles.contentArea}>
                <p>This is your admin dashboard, where you can oversee all your events. Click on the event name to view it and all associated projects.</p>
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
                            {
                                eventResult && eventResult.map((event: any) => (

                                    <TableRow
                                        key={event.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Link href={`${window.location.origin}/${event.id}`}>
                                                <b>{event.name}</b>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">
                                            {event.usersCount}
                                        </TableCell>
                                        <TableCell align="right">{event.projectsCount}</TableCell>
                                        <TableCell align="right">
                                            <CopyToClipboard text={`${window.location.origin}/invite/${event.id}`} onCopy={() => handleTooltipOpen(event.id)}>
                                                <Tooltip
                                                    PopperProps={{
                                                        disablePortal: true
                                                    }}
                                                    open={copiedEventId === event.id}
                                                    title="Copied"
                                                    placement="top"
                                                >
                                                    <div className={styles.copyLinkWrapper}>
                                                        <span>
                                                            {`${window.location.origin}/invite/${event.id}`}
                                                        </span>
                                                        <IconButton aria-label="open Modal" sx={{ color: '#1C1C1C' }}>
                                                            <ContentCopyIcon fontSize='small' />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="open Modal" sx={{ color: '#1C1C1C' }} onClick={() => handleUpdateOpen(event.id)}>
                                                <EditIcon fontSize='small' />
                                            </IconButton>
                                            {
                                                checkEventResult && eventResult && <EventUpdateDialog
                                                    open={openUpdate[event.id] || false}
                                                    onClose={() => handleUpdateClose(event.id)}
                                                    eventResult={event}
                                                    reloadComponent={fetchEvents}
                                                />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
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
                    <DialogTitle>Create Event</DialogTitle>
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
            </div>
        </div>
    );
}
