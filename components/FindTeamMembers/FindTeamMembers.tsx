"use client"

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import styles from "./FindTeamMembers.module.scss"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { FindTeamMemberInputs, FindTeamMemberSchema } from '@/app/lib/types'
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FindTeamMembersCard from '../FindTeamMembersCard/FindTeamMembersCard';
import { UserFilter } from './UserFilterAction';
import { getExpertises } from '@/app/lib/GetExpertisesAction';

interface Props {
    session: any;
    eventId: any;
}

export default function FindTeamMembers({ session, eventId }: Props) {

    const [userResult, setUserResult] = useState<any>({});
    const [expertises, setExpertises] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = {
                    memberSearch: "",
                    expertise: ""
                };
                const response = await UserFilter(data, eventId);

                if (response.success && Array.isArray(response.data)) {
                    setUserResult(response.data);
                } else {
                    console.error('Error: ApplyFilter did not return a successful response or data is not an array.');
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        const fetchExpertises = async () => {
            const expertises: any = await getExpertises(eventId);
            setExpertises(expertises);
        };

        fetchUsers();
        fetchExpertises();
    }, []);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm<FindTeamMemberInputs>({
        resolver: zodResolver(FindTeamMemberSchema)
    })

    const processForm: SubmitHandler<FindTeamMemberInputs> = async data => {
        try {
            // Call ApplyFilter with form data
            const filteredUsers = await UserFilter(data, eventId);

            if (filteredUsers && filteredUsers.success && Array.isArray(filteredUsers.data)) {
                // Set the filtered project data
                setUserResult(filteredUsers.data);
            } else {
                // Handle error if ApplyFilter didn't return expected data
                console.error('Error: ApplyFilter did not return the expected data.');
            }
        } catch (error) {
            console.error('Error processing form:', error);
            // Handle error if there's an issue with ApplyFilter or resetting the form
            alert("Something went wrong");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Find Team Members</h5>
            </div>
            <div className={styles.contentArea}>
                <form onSubmit={handleSubmit(processForm)} className={styles.filterArea}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', minWidth: "30%" }}>
                        <SearchIcon
                            sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                        />
                        <TextField
                            sx={{ minWidth: "100%" }}
                            id="memberSearch"
                            label="Search for member..."
                            variant="standard"
                            {...register('memberSearch')}
                        />
                    </Box>
                    <FormControl variant="standard" sx={{ width: "25%" }}>
                        <InputLabel id="expertise">Expertise</InputLabel>
                        <Select
                            labelId="expertise"
                            id="expertise"
                            label="expertise"
                            fullWidth
                            {...register('expertise')}
                        >
                            {
                                expertises.map((expertise: any) => (
                                    <MenuItem key={expertise.id} value={expertise.name}>{expertise.name}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}></FormHelperText>
                    </FormControl>
                    <Button
                        variant="contained"
                        type="submit">
                        Apply Filter
                    </Button>
                </form>
                <div className={styles.cardsArea}>
                    {

                        Array.isArray(userResult) && userResult.map((user: any) => (
                            //Filter own user from the list
                            session?.user?.email !== user.email &&
                            <FindTeamMembersCard key={user.id} userResult={user} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
