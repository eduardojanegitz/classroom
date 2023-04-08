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
    teacher: string
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

    if (req.method === "POST") {
        
        const { name, email, phone, teacher } = req.body;
        
        if(!name || !email || !phone || !teacher) {
            res.status(400).json({error: 'Missing body parameter'});
            return;
        }
        const { db } = await connect();
        
        const response = await db.collection('users').insertOne({
            name, 
            email,
            phone,
            teacher
        })
        res.status(200).json(response.ops[0])
    } else {
        res.status(400).json({ error: "Wrong method" })
    }

}