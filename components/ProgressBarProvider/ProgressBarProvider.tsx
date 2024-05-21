'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="5px"
                color="#0057b2"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
};

export default ProgressProvider;