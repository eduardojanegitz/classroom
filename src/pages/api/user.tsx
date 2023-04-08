import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

interface ErrorResponseType {
    error: string
}

interface SuccessResponseType {
    _id: string,
    name: string,
    email: string,
    phone: string,
    teacher: boolean,
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

    if (req.method === "POST") {

        const {
            name,
            email,
            phone,
            teacher,
            coins,
            courses,
            available_hours,
            available_locations,
            reviews,
            appointments
        } = req.body;

        if (teacher) {
            if (!name || !email || !phone) {
                res.status(400).json({ error: 'Missing body parameter' });
                return;
            }
        } else if (teacher) {
            if (!name ||
                !email ||
                !phone ||
                !courses ||
                !available_hours ||
                !available_locations ||
                !reviews ||
                !appointments) {
                res.status(400).json({ error: 'Missing body parameter' });
                return;
            }
        }

        const { db } = await connect();

        const response = await db.collection('users').insertOne({
            name,
            email,
            phone,
            teacher,
            coins: 1,
            courses: courses || [],
            available_hours: available_hours || [],
            available_locations: available_locations || [],
            reviews: [],
            appointments: []
        })
        res.status(200).json(response.ops[0])
    } else if (req.method === "GET") {
        const { email } = req.body;

        if(!email) {
            res.status(400).json({ error: "Missing e-mail on request body" });
            return;
        }

        const { db } = await connect();

        const response = await db.collection('users').findOne({ email })

        if(!response) {
            res.status(400).json({ error: "User with is e-mail not found" })
            return;
        }
        res.status(200).json(response)
    }

    else {
        res.status(400).json({ error: "Wrong request method" })
    }

}