import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";
import { z } from "zod";


const app = express();
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
    // throw new AppError("Erro de Teste", 400);

    const bodySchema = z.object({
        idade: z.number({
            // No Zod 4, usamos a propriedade 'error' com uma função
            error: (issue) =>
                issue.input === undefined
                    ? "Idade é obrigatória e não foi informada!"
                    : "Idade deve ser um número!",
        }).min(18, "Deve ter pelo menos 18 anos!")
    })
    const { idade } = bodySchema.parse(req.body || {});

    return res.json({ message: "Hello World" });
});

app.use(errorHandling);

export { app };
