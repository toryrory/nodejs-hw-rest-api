const multer = require('multer');
const path = require('path');

const tempDir = path.join(__dirname, '../', 'temp');

const multerConfig = multer.diskStorage({ // обьект настроек для мидлвары которая обрабатывает файлы, обьязательная настройка это дестинейшн, которая указывает путь к временной папке 
    destination: tempDir,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    } // значение это функция которая позволяет сохранять файл не под тем именем под которым он пришел
})
const upload = multer({
    storage: multerConfig
})

module.exports = upload;