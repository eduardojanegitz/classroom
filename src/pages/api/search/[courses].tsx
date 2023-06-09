import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../../utils/database';

interface ErrorResponseType {
    error: string
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | Object[]>
): Promise<void> => {

    if (req.method === "GET") {
        const courses  = req.query.courses as string;

        if (!courses) {
            res.status(400).json({ error: "Missing course name on request body" });
            return;
        }

        const { db } = await connect();

        const response = await db.collection('users').find({ courses: { $in: [new RegExp(`^${courses}`, 'i')] } }).toArray();

        if (response.length === 0) {
            res.status(400).json({ error: "Teacher not found" })
            return;
        }
        res.status(200).json(response)
    }

    else {
        res.status(400).json({ error: "Wrong request method" })
    }

}