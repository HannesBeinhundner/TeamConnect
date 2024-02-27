"use client"

import * as React from 'react';
import Link from "next/link";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import styles from "./YourProjectCard.module.scss"

export default function YourProjectCard() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Your Project</h5>
                {/* <Link href="#" className={styles.expandLink}>
                    <OpenInFullIcon fontSize="small" />
                </Link> */}
            </div>
            <div className={styles.contentArea}>
                <p>You haven’t yet created a project or joined an existing one</p>
                <React.Fragment>
                    <Button variant="contained" onClick={handleClickOpen}>
                        Create Project
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        fullWidth={true}
                        maxWidth={"md"}
                        className={styles.createModal}
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                const formJson = Object.fromEntries((formData as any).entries());
                                const email = formJson.email;
                                console.log(email);
                                handleClose();
                            },
                        }}
                    >
                        <DialogTitle>Create Project</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
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
                            <DialogContentText>
                                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.Stet clita kasd gubergren, no sea taLorem ipsum dolor sit amet, consetetur sadipscing elitr
                            </DialogContentText>
                            <form action="" className={styles.formContainer}>
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="name"
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    fullWidth
                                    variant="standard"
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="projectName"
                                    name="projectName"
                                    label="Project Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                />
                                <FormControl variant="standard" sx={{ minWidth: "100%" }}>
                                    <InputLabel id="projectType">Project Type *</InputLabel>
                                    <Select
                                        labelId="projectType"
                                        id="projectType"
                                        name="projectType"
                                        value={age}
                                        onChange={handleChange}
                                        label="Project Type"
                                        required
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Web-projec"}>Web-project</MenuItem>
                                        <MenuItem value={"Game-project"}>Game-project</MenuItem>
                                        <MenuItem value={"Film-project"}>Film-project</MenuItem>
                                        <MenuItem value={"Audio-project"}>Audio-project</MenuItem>
                                        <MenuItem value={"Computeranimation-project"}>Computeranimation-Project</MenuItem>
                                        <MenuItem value={"Multimedia-project"}> Multimedia-project</MenuItem>
                                        <MenuItem value={"other"}>other</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    required
                                    margin="dense"
                                    id="projectDescription"
                                    name="projectDescription"
                                    label="Project Description"
                                    type="text"
                                    placeholder="Specify what your project is about..."
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                />
                                <TextField
                                    margin="dense"
                                    id="projectSkills"
                                    name="projectSkills"
                                    label="Preffered skills and study program"
                                    type="text"
                                    placeholder="Specify desired team skills and relevant student courses for your project..."
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                />
                            </form>
                        </DialogContent>
                        <DialogActions>
                            {/* <Button onClick={handleClose}>Cancel</Button> */}
                            <Button variant="contained" type="submit">Create</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
            </div>


        </div>


    );
}
