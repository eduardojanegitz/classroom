import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

interface ErrorResponseType {
    error: string
}

interface SuccessResponseType {
    date: string,
    teacher_name: string,
    teacher_id: string,
    student_name: string,
    student_id: string,
    course: string,
    location: string,
    appointment_link: string
}

export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

    if (req.method === "POST") {

        const session = await getSession({ req });

        if(!session) {
            res.status(400).json({ error: "Please login first" });
            return;
        } 
        const {
            date,
            teacher_name,
            teacher_id,
            student_name,
            student_id,
            course,
            location,
            appoinment_link
        } = req.body;

        if (
            !date ||
            !teacher_name ||
            !teacher_id ||
            !student_name ||
            !student_id ||
            !course ||
            !location
        ) {
            res.status(400).json({ error: "Missing parameter on request body" });
            return;
        }

        const { db } = await connect();

        const teacherExists = await db.collection('users').findOne({ _id: new ObjectID(teacher_id) });

        if (!teacherExists) {
            res.status(400).json({ error: `Teacher ${teacher_name} with ID ${teacher_id} doesn't exist` });
        }
        const studentExists = await db.collection('users').findOne({ _id: new ObjectID(student_id) });

        if (!studentExists) {
            res.status(400).json({ error: `Student ${student_name} with ID ${student_id} doesn't exist` });
        }

        const appoinment = {
            date,
            teacher_name,
            teacher_id,
            student_name,
            student_id,
            course,
            location,
            appoinment_link: appoinment_link || '',
        };

        await db
            .collection('users')
            .updateOne(
                { _id: new ObjectID(teacher_id) },
                { $push: { appoinments: appoinment } }
            );
        await db
            .collection('users')
            .updateOne(
                { _id: new ObjectID(student_id) },
                { $push: { appoinments: appoinment } }
            );

        // if (!response) {
        //     res.status(400).json({ error: "Teacher not found" })
        //     return;
        // }
        // res.status(200).json(appoinment);
    }

    else {
        res.status(400).json({ error: "Wrong request method" })
    }

}
