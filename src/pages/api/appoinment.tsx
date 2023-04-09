import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

interface User {
    name: string;
    email: string;
    phone: string;
    teacher: boolean;
    coins: number;
    cousers: string[];
    available_hours: Record<string, number[]>;
    available_locations: string[];
    reviews: Record<string, unknown>[];
    appoinments: {
        date: string;
    }[];
    _id: string;
}

interface ErrorResponseType {
    error: string
}

interface SuccessResponseType {
    date: string;
    teacher_name: string;
    teacher_id: string;
    student_name: string;
    student_id: string;
    course: string;
    location: string;
    appointment_link: string;
}



export default async (
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {

    if (req.method === "POST") {

        const session = await getSession({ req });

        if (!session) {
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
            // appoinment_link,
        }: {
            date: string;
            teacher_name: string;
            teacher_id: string;
            student_name: string;
            student_id: string;
            course: string;
            location: string;
            appointment_link: string;
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

        let teacherID: ObjectID;
        let studentID: ObjectID;
        try {
            teacherID = new ObjectID(teacher_id);
            studentID = new ObjectID(student_id);
        } catch {
            res.status(400).json({ error: "Wrong objectID" });
            return;
        }

        const parsedDate = new Date(date);
        const now = new Date();
        const today = {
            day: now.getDate(),
            month: now.getMonth(),
            year: now.getFullYear(),
        };
        const fullDate = {
            day: parsedDate.getDate(),
            month: parsedDate.getMonth(),
            year: parsedDate.getFullYear(),
        };

        if (
            fullDate.year < today.year ||
            fullDate.month < today.month ||
            fullDate.day < today.day
        ) {
            res.status(400).json({
                error: "You can't create appointments on the past",
            });
            return;
        }

        const { db } = await connect();

        const teacherExists: User = await db.collection('users').findOne({ _id: teacherID });

        if (!teacherExists) {
            res.status(400).json({ error: `Teacher ${teacher_name} with ID ${teacher_id} doesn't exist` });
        }
        const studentExists: User = await db.collection('users').findOne({ _id: studentID });

        if (!studentExists) {
            res.status(400).json({ error: `Student ${student_name} with ID ${student_id} doesn't exist` });
        }

        if (studentExists.coins === 0) {
            res.status(400).json({ error: `Student ${student_name} doesn't have enough coins` });
            return;
        }

        const weekdays = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday'
        ];
        const requestDay = weekdays[parsedDate.getDay()];
        const requestHour = parsedDate.getUTCHours() - 3;
        if (!teacherExists.available_hours[requestDay]?.includes(requestHour)) {
            res.status(400).json({
                error: `Teacher ${teacher_name} isn't available at ${requestDay} ${requestHour}:00`
            });
            return;
        }

        teacherExists.appoinments.forEach((appointment) => {
            const appointmentDate = new Date(appointment.date);

            if (appointmentDate.getTime() === parsedDate.getTime()) {
                res.status(400).json({
                    error: `Teacher ${teacher_name} already have an appointment at ${appointmentDate.getDate()}/${appointmentDate.getMonth() + 1
                        }/${appointmentDate.getFullYear()} ${appointmentDate.getUTCHours() - 3
                        }:00`
                });
                return;
            }
        });

        const appointment = {
            date,
            teacher_name: teacherExists.name,
            teacher_id,
            student_name: studentExists.name,
            student_id,
            course,
            location,
            // appoinment_link: appoinment_link || '',
        };

        await db
            .collection('users')
            .updateOne(
                { _id: new ObjectID(teacher_id) },
                { $push: { appoinments: appointment }, $inc: { coins: 1 } }
            );
        await db
            .collection('users')
            .updateOne(
                { _id: new ObjectID(student_id) },
                { $push: { appoinments: appointment }, $inc: { coins: -1 } }
            );

        // if (!response) {
        //     res.status(400).json({ error: "Teacher not found" })
        //     return;
        // }
        // res.status(200).json(appointment);
    }

    else {
        res.status(400).json({ error: "Wrong request method" })
    }

}
