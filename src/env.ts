import { z } from "zod";


// Validação das variáveis de ambiente
const envSchema = z.object({
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("1d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error(" Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables.");
}

//retorna as variaveis de Ambiente
export const env = _env.data;
