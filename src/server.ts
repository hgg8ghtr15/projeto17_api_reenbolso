import { app } from "@/app";

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});