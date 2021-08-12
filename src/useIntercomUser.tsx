import { useEffect } from 'react';

export type IntercomUser = {
    id: string,
    name: string,
    email: string,
    isGuest: boolean,
    user_hash?: string,
}

// updates intercom based on user passed
// this is necessary for showing user's conversations and keeping in sync with login state
export function useIntercomUser({ user,app_id, verification_url = '/api/intercom-user-hash', onError }: { user: IntercomUser, app_id: string, verification_url?:string,  onError: Function }) {
    useEffect(() => {
        const Intercom = window['Intercom'];

        // has ID and not guest
        const isUser = user && !user.isGuest;

        if (isUser && verification_url) {
            // generate user hash
            fetch(verification_url)
                .then((response) => response.json())
                .then((response) => {
                    if (response.error) {
                        if (onError) onError(new Error('Intercom verification failure: ' + response.error));
                    } else if (response.hash) {
                        window['intercomSettings'] = {
                            app_id,
                            email: user.email,
                            name: user.name,
                            user_id: user.id,
                            user_hash: response.hash,
                        };
                        Intercom('update');
                    }
                })
                .catch((error) => {
                    if (onError) onError(error);
                });
        } else if (window['intercomSettings'].user_id) {
            // handle logout or reset
            // back to guest mode
            window['intercomSettings'] = {
                app_id,
            };
            Intercom('update');
        }
    }, [user?.id, user?.name, user?.email]);
}