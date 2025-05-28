import carouselModel from '../models/carouselModel';
import cloudinary from 'cloudinary';

class CarouselService {
    async getCarouselByType(type: string) {
        // Busca o crea un carrusel si no existe
        let carousel = await carouselModel.findOne({ type });
        if (!carousel) {
            carousel = await carouselModel.create({ type, images: [] });
        }
        return carousel;
    }

    async uploadImage(type: string, fileBuffer: Buffer) {
        try {
            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: `carruseles/${type}`,
                    },
                    (error, result) => {
                        if (error) {
                            console.log("❌ Error al subir a Cloudinary:", error);
                            reject(error);
                        } else {
                            console.log("✅ Imagen subida a Cloudinary:", result?.secure_url);
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(fileBuffer);
            });

            if (!result) {
                throw new Error("No se recibió respuesta válida de Cloudinary");
            }

            const imageUrl = result.secure_url;

            const carousel = await carouselModel.findOneAndUpdate(
                { type },
                { $addToSet: { images: imageUrl } },
                { upsert: true, new: true }
            );

            return carousel;
        } catch (error) {
            console.error('❌ Error en el servicio al subir imagen:', error);
            throw new Error('Error en el servicio al subir imagen');
        }
    }


    async removeImage(type: string, imageUrl: string) {
        try {
            // Extraer el public_id desde la URL completa
            const matches = imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            const publicId = matches?.[1];

            if (publicId) {
                await cloudinary.v2.uploader.destroy(publicId, { invalidate: true });
                console.log(`✅ Imagen eliminada de Cloudinary: ${publicId}`);
            } else {
                console.warn(`⚠️ No se pudo extraer public_id de la URL: ${imageUrl}`);
            }

            // Eliminar la URL de la base de datos
            const updatedCarousel = await carouselModel.findOneAndUpdate(
                { type },
                { $pull: { images: imageUrl } },
                { new: true }
            );

            console.log(`✅ Imagen removida del carrusel en DB: ${imageUrl}`);

            return updatedCarousel;
        } catch (error) {
            console.error('❌ Error al eliminar la imagen de Cloudinary:', error);
            throw new Error('Error al eliminar la imagen del carrusel');
        }
    }


    async replaceImages(type: string, newImages: string[]) {
        // Ojo: este método no elimina físicamente las imágenes antiguas
        const oldCarousel = await carouselModel.findOne({ type });
        const oldImages = oldCarousel?.images || [];

        // Reemplaza las imágenes en la base de datos
        const updatedCarousel = await carouselModel.findOneAndUpdate(
            { type },
            { images: newImages },
            { upsert: true, new: true }
        );

        // Elimina físicamente las imágenes antiguas de Cloudinary
        oldImages.forEach(async (img) => {
            if (!newImages.includes(img)) {
                const publicId = img.split('/').pop()?.split('.').shift();
                if (publicId) {
                    await cloudinary.v2.uploader.destroy(publicId); // Elimina la imagen de Cloudinary
                }
            }
        });

        return updatedCarousel;
    }
}

export const carouselService = new CarouselService();
