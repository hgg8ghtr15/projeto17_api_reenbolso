import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";
import { router } from "./routes";
import uploadConfig from "./config/uploadConfig";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/upload", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(router);
app.use(errorHandling);

export { app };
