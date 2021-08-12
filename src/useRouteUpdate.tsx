import { useRouter } from 'next/router';
import { useEffect } from 'react';

// hooks into Next.js router and updates intercom on route change
export function useRouteUpdate() {
    const router = useRouter();

    useEffect(() => {
        const Intercom = window['Intercom'];
        const handleRouteChange = function onRouteChange() {
            Intercom('update');
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, []);
}