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

        // Use a regex to extract the eventId from the pathname
        const eventIdMatch = pathname.match(/^\/([^\/]+)\/confirm-invitation/);
        const eventId = eventIdMatch ? eventIdMatch[1] : null;

        if (token && eventId) {
            fetch(`/api/confirm-invitation?token=${token}`)
                .then(response => {
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
