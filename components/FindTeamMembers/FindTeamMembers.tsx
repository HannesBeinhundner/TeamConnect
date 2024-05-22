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
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { FindTeamMemberInputs, FindTeamMemberSchema } from '@/app/lib/types'
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FindTeamMembersCard from '../FindTeamMembersCard/FindTeamMembersCard';
import { UserFilter } from './UserFilterAction';
import { getExpertises } from '@/app/lib/GetExpertisesAction';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


interface Props {
    session: any;
    eventData: any;
}

export default function FindTeamMembers({ session, eventData }: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [userResult, setUserResult] = useState<any>({});
    const [expertises, setExpertises] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);

    const reloadComponent = () => {
        setReloadKey(prevReloadKey => prevReloadKey + 1); // Update key to force remount
    };

    const fetchUsers = async () => {
        reset();
        try {
            const data = {
                memberSearch: "",
                expertise: ""
            };
            const response = await UserFilter(data, eventData.id);

            if (response.success && Array.isArray(response.data)) {
                setUserResult(response.data);
                setIsLoading(false)
            } else {
                console.error('Error: ApplyFilter did not return a successful response or data is not an array.');
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    const {
        register,
        handleSubmit,
        setError,
        reset,
        resetField,
        control,
        watch,
        formState: { errors },
    } = useForm<FindTeamMemberInputs>({
        resolver: zodResolver(FindTeamMemberSchema)
    })

    useEffect(() => {
        const fetchExpertises = async () => {
            const expertises: any = await getExpertises(eventData.id);
            setExpertises(expertises);
        };
        fetchUsers();
        fetchExpertises();
    }, []);

    const processForm: SubmitHandler<FindTeamMemberInputs> = async data => {
        try {
            // Call ApplyFilter with form data
            const filteredUsers = await UserFilter(data, eventData.id);

            if (filteredUsers && filteredUsers.success && Array.isArray(filteredUsers.data)) {
                // Set the filtered project data
                setUserResult(filteredUsers.data);
            } else {
                // Handle error if ApplyFilter didn't return expected data
                console.error('Error: ApplyFilter did not return the expected data.');
            }
        } catch (error) {
            // Handle error if there's an issue with ApplyFilter or resetting the form
            toast.error('Unexpected error occurred!');
        }
    };

    function LoadingBox({ children }: any) {
        return (
            <div
                style={{
                    display: 'block',
                    lineHeight: 0,
                }}
                className={styles.skeletonContainer}
            >
                {children}
            </div>
        );
    }
    return (
        <div className={styles.container}>
            <div className={styles.headerArea}>
                <h5>Find Team Members</h5>
            </div>
            <div className={styles.contentArea}>
                <form onSubmit={handleSubmit(processForm)} className={styles.filterArea}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className={styles.nameInput}>
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
                    <FormControl variant="standard" className={styles.expertiseInput}>
                        <InputLabel id="expertise">Expertise</InputLabel>
                        <Controller
                            name="expertise"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    labelId="expertise"
                                    id="expertise"
                                    label="Expertise"
                                    fullWidth
                                    {...field}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        expertises.map((expertise: any) => (
                                            <MenuItem key={expertise.id} value={expertise.name}>{expertise.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            )}
                        />
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
                        isLoading ? <Skeleton wrapper={LoadingBox} height={40} count={4} width={"100%"} /> : (
                            Array.isArray(userResult) && userResult.map((user: any) => (
                                //Filter own user from the list
                                session?.user?.email !== user.email &&
                                <FindTeamMembersCard session={session} eventData={eventData} key={`${user.id}-${reloadKey}`} userResult={user} reloadComponent={fetchUsers} reloadParentComponent={reloadComponent} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}
