import express from 'express';
import cors from 'cors';

import {noteRouter} from "./routes";
import {MongoClient} from "mongodb";
import bodyParser from "body-parser";
import {dbConfig} from "./config/db";
import {DatabaseSingleton} from "./helpers/DatabaseSingleton";
import {dbConfig} from "./config/db";

const mongoClient = MongoClient;
const app = express();
const PORT = 3200;

app.use(cors());
app.use(bodyParser.json())
mongoClient.connect(dbConfig.url, (err, database) => {
    if (err) return console.log(err);

    DatabaseSingleton.setClient(database, 'notes');

    app.use(noteRouter);
    app.listen(PORT, () => {
        console.log(`server is running at port ${PORT}`);
    });
})
