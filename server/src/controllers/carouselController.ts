import { Request, Response } from 'express';
import { carouselService } from '../services/carouselService';
import { v2 as cloudinary } from 'cloudinary';

class CarouselController {
    async getCarouselByType(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const result = await carouselService.getCarouselByType(type);
            return res.status(200).json(result);
        } catch (error) {
            console.error('❌ Error al obtener carrusel:', error);
            return res.status(500).json({ message: 'Error al obtener carrusel' });
        }
    }


    async uploadImageToCarousel(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const file = req.file as Express.Multer.File;

            if (!file) {
                return res.status(400).json({ message: 'No se recibió imagen' });
            }

            const result = await carouselService.uploadImage(type, file.buffer);

            return res.status(200).json({
                message: 'Imagen subida con éxito',
                data: result,
            });
        } catch (error) {
            console.error('❌ Error al subir imagen:', error);
            return res.status(500).json({ message: 'Error al subir imagen al carrusel' });
        }
    }



    async removeImageFromCarousel(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const { imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({ message: 'Se requiere la URL de la imagen' });
            }

            const public_id = imageUrl.split('/').pop()?.split('.')[0];
            if (!public_id) {
                return res.status(400).json({ message: 'URL de imagen no válida' });
            }

            await cloudinary.uploader.destroy(public_id);
            const result = await carouselService.removeImage(type, imageUrl);

            return res.status(200).json({
                message: 'Imagen eliminada correctamente',
                data: result,
            });
        } catch (error) {
            console.error('❌ Error al eliminar imagen:', error);
            return res.status(500).json({ message: 'Error al eliminar imagen del carrusel' });
        }
    }

    async replaceCarouselImages(req: Request, res: Response) {
        try {
            const { type } = req.params;
            const { images } = req.body;

            if (!Array.isArray(images)) {
                return res.status(400).json({ message: 'Se espera un array de imágenes' });
            }

            const uploadedImages = await Promise.all(
                images.map(async (image: any) => {
                    const result = await cloudinary.uploader.upload(image.path);
                    return result.secure_url;
                })
            );

            const result = await carouselService.replaceImages(type, uploadedImages);

            return res.status(200).json({
                message: 'Carrusel actualizado correctamente',
                data: result,
            });
        } catch (error) {
            console.error('❌ Error al reemplazar imágenes:', error);
            return res.status(500).json({ message: 'Error al reemplazar imágenes del carrusel' });
        }
    }
}

export const carouselController = new CarouselController();
