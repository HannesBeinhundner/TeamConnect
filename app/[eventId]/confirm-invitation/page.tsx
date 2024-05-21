"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

const ConfirmInvitationPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname

    useEffect(() => {
        const token = searchParams.get('token');
        console.log("Current path:", pathname); // Log the current pathname

        // Use a regex to extract the eventId from the pathname
        const eventIdMatch = pathname.match(/^\/([^\/]+)\/confirm-invitation/);
        const eventId = eventIdMatch ? eventIdMatch[1] : null;

        console.log("Token received:", token);  // Ensure this logs
        console.log("Event ID received:", eventId); // Ensure this logs

        if (token && eventId) {
            console.log("Making API call");
            fetch(`/api/confirm-invitation?token=${token}`)
                .then(response => {
                    console.log("API response received");
                    if (!response.ok) {
                        throw new Error('API response not ok');
                    }
                    return response.json();
                })
                .then(result => {
                    if (result.success) {
                        toast.success('Invitation confirmed successfully!');
                        router.push(`/${eventId}`);
                    } else {
                        toast.error(result.error);
                        router.push(`/${eventId}/confirmation-error`);
                    }
                })
                .catch(error => {
                    console.error('Error confirming invitation:', error);
                    toast.error('An unexpected error occurred.');
                    router.push(`/${eventId}/confirmation-error`);
                });
        } else {
            console.error("Token or Event ID is missing");
        }
    }, [searchParams, router, pathname]);

    return null;
};

export default ConfirmInvitationPage;
