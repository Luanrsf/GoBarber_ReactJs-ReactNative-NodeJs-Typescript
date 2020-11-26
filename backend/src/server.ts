import 'reflect-metadata';
import cors from 'cors';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes/index';
import './database/index';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';
import { userInfo } from 'os';

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/files', express.static(uploadConfig.directory));

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(3334, () => {
    console.log('Server started on port 3334!');
});
