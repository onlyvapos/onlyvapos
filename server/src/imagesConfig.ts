import multer from 'multer';

// Configuración del almacenamiento en memoria
const storage = multer.memoryStorage(); // <<<<<< Aquí cambia

// Validación del tipo de archivo
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no soportado. Usa JPEG, PNG o WEBP.'));
    }
};

// Multer configurado
const imageUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5 MB por archivo
});

export default imageUpload;
