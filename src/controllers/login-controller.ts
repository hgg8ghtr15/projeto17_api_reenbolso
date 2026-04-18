import { Request, Response } from "express";
import { z } from "zod";
import { LoginService } from "@/service/login-service";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});


class LoginController {
    constructor(private loginService: LoginService) { }

    async create(request: Request, response: Response) {
        const { email, senha } = loginSchema.parse(request.body);
        const result = await this.loginService.execute({ email, senha });

        return response.status(200).json(result);
    }
}

export { LoginController };
