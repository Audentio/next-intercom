import crypto from 'crypto';
import { Request, Response } from 'express';

type verificationResult = {
    verified: boolean;
    user_id: string;
};

type params = {
    req: Request;
    res: Response;
    verification_key: string;
    verifyUser: (cookies: Request['cookies']) => verificationResult;
};

export async function generateUserHash({ req, res, verification_key, verifyUser }: params) {
    if (!verification_key) {
        res.status(500).json({ error: 'verification key undefined' });
        return;
    }

    const { verified, user_id } = await verifyUser(req.cookies);

    if (verified) {
        // https://www.intercom.com/help/en/articles/183-enable-identity-verification-for-web-and-mobile
        const hash = crypto.createHmac('sha256', verification_key).update(user_id);

        res.status(200).json({ hash: hash.digest('hex') });
    } else {
        res.status(401).json({ error: 'user verification failed' });
    }
}
