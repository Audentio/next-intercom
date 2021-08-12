## SETUP

#### Add to your next.js app

1. Add Intercom app ID to your .env

```
NEXT_PUBLIC_INTERCOM_APP_ID=yourAppIdHere
```

2. Add `<Intercom />` to your `_app.page.tsx`.

_(You can add to specific routes as well but we recommend adding globally via `_app.tsx`)_

```jsx
import { Intercom } from '@audentio/next-intercom';

export default function MyApp({ Component, pageProps }) {
    // user coming from somewhere else
    // if you don't pass user Intercom will treat all visitors as guests
    const user = getUser();

    return (
        <>
            <Component {...pageProps} />
            <Intercom user={user} app_id={process.env.NEXT_PUBLIC_INTERCOM_APP_ID} />
        </>
    );
}
```

#### Setup Indentity verification

1. In intercom control panel, go to Settings → Identity verification → Web

2. Copy the secret key and store in your `.env`

```bash
INTERCOM_VERIFICATION_KEY=*secret-key*
```

3. Create a new [API route](https://nextjs.org/docs/api-routes/introduction) called `intercom-user-hash` (should be available at `/api/intercom-user-hash`) and pass your user custom verification function

```jsx
import { generateUserHash } from '@audentio/next-intercom';

export async function handler(req, res) {
    generateUserHash({
        req,
        res,
        verification_key: process.env.INTERCOM_VERIFICATION_KEY,

        // use your own auth/verification flow here
        // we pass cookies to this function so you can use user's access_token from cookies if you store it here
        verifyUser: async (cookies) => {
            const response = await callMyApiWithToken(cookies.access_token);

            if (response.user.id) {
                return {
                    verified: true,
                    user_id: response.user.id,
                };
            } else {
                return {
                    verified: false,
                    user_id: null,
                };
            }
        },
    });
}
```
