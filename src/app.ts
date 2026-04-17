import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";
import { z } from "zod";


const app = express();
app.use(cors());
app.use(express.json());



app.use(errorHandling);

export { app };
