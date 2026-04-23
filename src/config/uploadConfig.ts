import crypto from "crypto";
import multer from "multer";
import path from "path";

// Caminho para a pasta temporária na raiz do projeto
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");

// Caminho para a pasta onde os uploads finais serão armazenados
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads");

// Tamanho máximo do arquivo permitido (3MB)
const MAX_FILE_SIZE = 1024 * 1024 * 3;

// Tipos de arquivos de imagem aceitos
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const MULTER = {
    // Configuração de armazenamento em disco
    storage: multer.diskStorage({
        // Define o destino inicial dos arquivos como a pasta temporária
        destination: TMP_FOLDER,
        // Define como o nome do arquivo será gerado
        filename: (req, file, callback) => {
            // Gera um hash aleatório de 16 bytes para evitar nomes duplicados
            const fileHash = crypto.randomBytes(16).toString("hex");

            // Combina o hash com o nome original do arquivo
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        }
    })
}

export default {
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MAX_FILE_SIZE,
    ACCEPTED_IMAGE_TYPES,
    MULTER,
};
