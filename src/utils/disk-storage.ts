import uploadConfig from "@/config/uploadConfig";
import path from "path";
import fs from "fs";
import { AppError } from "./AppError";

class DiskStorage {
    /**
     * Move um arquivo da pasta temporária para a pasta de uploads final.
     * @param file Nome do arquivo a ser movido.
     */
    async saveFile(file: string) {
        // Define o caminho completo do arquivo na pasta temporária
        const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file);

        // Define o caminho completo de destino na pasta de uploads
        const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            // Verifica se o arquivo realmente existe na pasta temporária
            await fs.promises.access(tmpPath);
        } catch (error) {
            throw new AppError("O arquivo nao existe ou nao pode ser movido", 500);
        }

        try {
            // Cria a pasta de uploads caso ela ainda não exista
            await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true });

            // Move o arquivo da pasta temporária para a pasta final
            await fs.promises.rename(tmpPath, destPath);

            return file;
        } catch (error) {
            throw new AppError("O arquivo nao pode ser movido", 500);
        }
    }

    /**
     * Remove um arquivo do sistema de arquivos.
     * @param file Nome do arquivo a ser deletado.
     */
    async deleteFile(file: string) {
        // Resolve o caminho do arquivo (atualmente configurado para a TMP_FOLDER)
        const filePath = path.resolve(uploadConfig.TMP_FOLDER, file);

        try {
            // Verifica se o arquivo existe antes de tentar deletar
            await fs.promises.stat(filePath);

            // Deleta o arquivo fisicamente do disco
            await fs.promises.unlink(filePath);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("O arquivo nao pode ser deletado", 500);
        }
    }

    async deleteFileInUpload(file: string) {
        // Resolve o caminho do arquivo (atualmente configurado para a TMP_FOLDER)
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

        try {
            // Verifica se o arquivo existe antes de tentar deletar
            await fs.promises.stat(filePath);

            // Deleta o arquivo fisicamente do disco
            await fs.promises.unlink(filePath);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("Erro ao tentar deletar um aquivo existente na pasta de uploads", 500);
        }
    }
}

export { DiskStorage };