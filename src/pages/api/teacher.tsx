import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';
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
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

   if (req.method === "GET") {
        const { id } = req.body;

        if(!id) {
            res.status(400).json({ error: "Missing teacher id on request body" });
            return;
        }

        const { db } = await connect();

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