import { IntercomScript } from './script';
import { IntercomUser, useIntercomUser } from './useIntercomUser';
import { useRouteUpdate } from './useRouteUpdate';
import { useEffect } from 'react';

type IntercomConfig = {
    app_id: string,
    user?: IntercomUser,

    // default: '/api/intercom-user-hash'
    verification_url?: string
}

export function Intercom({ config, onError }: { config: IntercomConfig, onError?: (error: Error) => void }) {
    const {app_id, user } = config;

    useEffect(() => {
        // Start intercom
        window['Intercom']('boot', { app_id });
    }, []);

    useRouteUpdate();
    
    useIntercomUser({ user, app_id, onError });

    return (
        <>
            <IntercomScript app_id={app_id} />
        </>
    )
}