import express, { Application } from 'express';
import { zodMiddleWare } from './middlewares/zod.middleware';
import { client } from './database/db';
import doctorRouter from './routes/doctor.route';
import session from 'express-session';
import passport from 'passport';
import cookieparser from 'cookie-parser';
import cors from 'cors';

const PORT = 8000;
const app: Application = express();

const clienturl =
    (process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_PROD_URL
        : process.env.CLIENT_DEV_URL) ?? 'http://localhost:5173';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: clienturl,
        credentials: true,
    }),
);

app.use(cookieparser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'hello',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
        },
    }),
);

//Passport Setup
import './passport/localStratergy';
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.get('/', (req, res) => {
    res.send('Pong');
});

app.use('/doctor', doctorRouter);

//Middlewares
app.use(zodMiddleWare);

app.listen(PORT, () => {
    client
        .connect()
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.log('Database connection failed', err));
    console.log('Application Running in port' + PORT);
});
