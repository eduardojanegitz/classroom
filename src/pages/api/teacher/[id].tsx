import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../../utils/database';
import { ObjectID } from "mongodb";

interface ErrorResponseType {
    error: string
}

interface SuccessResponseType {
    _id: string,
    name: string,
    email: string,
    phone: string,
    teacher: boolean,
    coins: number,
    courses: string[],
    available_hours: object,
    available_locations: string[],
    reviews: object[],
    appointments: object[];
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

   if (req.method === "GET") {
        const { id } = req.query;

        if(!id) {
            res.status(400).json({ error: "Missing teacher id on request body" });
            return;
        }

        const { db } = await connect();

        if( id.length > 24) {
            res.status(400).json({ error: "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters at new ObjectID " })
        }

        const response = await db.collection('users').findOne({"_id": new ObjectID(id)})

        if(!response) {
            res.status(400).json({ error: "Teacher not found" })
            return;
        }
        res.status(200).json(response)
    }

    else {
        res.status(400).json({ error: "Wrong request method" })
    }

}