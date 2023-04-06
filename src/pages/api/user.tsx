import { NextApiRequest, NextApiResponse } from 'next';

interface ResponseType {
    message: string
}
export default (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    res.status(200).json({message: "A api está funfando"})
}