import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import cloudinary from "../lib/cloudinary";
import fs from 'fs';
class productController {
    async createProduct(req: Request, res: Response) {
        try {
            const { brand, modelo, description, srcImage, price, capacity, flavors, featured } = req.body;
            const newProduct = await ProductService.createProduct({
                brand,
                modelo,
                description,
                srcImage: srcImage || [],
                price,
                capacity,
                flavors,
                featured,
            });
            return res.status(201).json(newProduct);
        } catch (error: unknown) {
            console.error('Error while creating product:', error);
            if (error instanceof Error) {
                if (error.message.includes('A product with the same brand and model and capacity already exists')) {
                    return res.status(400).json({
                        message: error.message,
                    });
                }
                return res.status(500).json({
                    message: `Error creating the product: ${error.message}`,
                });
            }
            return res.status(500).json({
                message: 'Unknown error occurred',
                error: error,
            });
        }
    }


    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await ProductService.getAllProducts();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: `Error while getting products` });
        }
    }

    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ message: `Error while getting product by id` });
        }
    }

    async updateProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const productData = req.body;

            if (!productData || Object.keys(productData).length === 0) {
                return res.status(400).json({ message: 'No data provided for update' });
            }
            const updatedProduct = await ProductService.updateProductById(id, productData);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({
                message: 'Product updated successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while updating product` });
        }
    }

    async addImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const file = req.file as Express.Multer.File | undefined;

            if (!file) {
                return res.status(400).json({ message: 'No se recibió imagen' });
            }

            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'products',
                        use_filename: true,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(file.buffer);
            });

            const imageUrl = result.secure_url;

            const updatedProduct = await ProductService.addImageToProduct(id, imageUrl);

            return res.status(200).json({
                message: " Imagen agregada correctamente",
                data: updatedProduct,
            });
        } catch (error) {
            console.error(" Error al agregar la imagen:", error);
            return res.status(500).json({ message: "Error while adding image to product" });
        }
    }


    async removeImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { imageUrl } = req.body;

            if (!imageUrl) {
                return res.status(400).json({ message: 'Image URL is required' });
            }

            // Extraer el public_id de la URL de Cloudinary (esto es necesario para eliminar la imagen)
            const public_id = imageUrl.split('/').pop()?.split('.')[0];  // Asumiendo que la URL es algo como 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg'

            if (!public_id) {
                return res.status(400).json({ message: 'Invalid image URL' });
            }

            // Eliminar la imagen de Cloudinary
            await cloudinary.uploader.destroy(public_id);

            // Llamar al servicio para eliminar la URL de la imagen del producto
            const updatedProduct = await ProductService.removeImageFromProduct(id, imageUrl);

            return res.status(200).json({
                message: 'Image removed successfully',
                data: updatedProduct,
            });
        } catch (error) {
            console.error("❌ Error al eliminar la imagen de Cloudinary:", error);
            return res.status(500).json({ message: "Error while removing image from product" });
        }
    }

    async replaceImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { oldImageUrl } = req.body;

            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "❌ No se recibió un archivo válido." });
            }

            // Subir la nueva imagen
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });

            fs.unlinkSync(req.file.path);

            const newImageUrl = result.secure_url;

            const updatedProduct = await ProductService.replaceImage(id, oldImageUrl, newImageUrl);

            return res.status(200).json({
                message: "✅ Imagen reemplazada correctamente",
                data: updatedProduct,
            });
        } catch (error) {
            console.error("❌ Error al reemplazar la imagen:", error);
            return res.status(500).json({ message: "Error al reemplazar la imagen" });
        }
    }

    async addFlavor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { flavor } = req.body;
            if (!flavor) {
                return res.status(400).json({ message: 'Flavor is required' });
            }
            const updatedProduct = await ProductService.addFlavorToProduct(id, flavor);
            return res.status(200).json({
                message: 'Flavor added successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while adding flavor to product` });
        }
    }

    async removeFlavor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { flavor } = req.body;
            if (!flavor) {
                return res.status(400).json({ message: 'Flavor is required' });
            }
            const updatedProduct = await ProductService.removeFlavorFromProduct(id, flavor);
            return res.status(200).json({
                message: 'Flavor removed successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: `Error while removing flavor from product` });
        }
    }

    async deleteProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedProduct = await ProductService.deleteProductById(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: `Error while deleting product` });
        }
    }

    // Método para obtener los últimos tres productos añadidos
    async getLatestProducts(req: Request, res: Response) {
        try {
            const latestProducts = await ProductService.getLatestProducts();
            return res.status(200).json(latestProducts);
        } catch (error) {
            console.error("Error while getting latest products:", error);
            return res.status(500).json({ message: "Error while getting latest products" });
        }
    }

    async getProductsWithPromotions(req: Request, res: Response) {
        try {
            const products = await ProductService.getProductsWithPromotions();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: "Error while getting products with promotions" });
        }
    }

    async getProductsWithoutPromotions(req: Request, res: Response) {
        try {
            const products = await ProductService.getProductsWithoutPromotions();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ message: "Error while getting products without promotions" });
        }
    }

    async addPromotion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { quantity, price } = req.body;

            if (!quantity || !price) {
                return res.status(400).json({ message: "Quantity and price are required" });
            }

            const updatedProduct = await ProductService.addPromotion(id, quantity, price);
            return res.status(200).json({
                message: "Promotion added successfully",
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error while adding promotion" });
        }
    }

    async updatePromotions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { promotions } = req.body;

            if (!Array.isArray(promotions) || promotions.length === 0) {
                return res.status(400).json({ message: "Promotions array is required" });
            }

            const updatedProduct = await ProductService.updatePromotions(id, promotions);
            return res.status(200).json({
                message: "Promotions updated successfully",
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error while updating promotions" });
        }
    }

    async removePromotion(req: Request, res: Response) {
        try {
            const { id, quantity } = req.params;

            if (!quantity) {
                return res.status(400).json({ message: "Quantity is required" });
            }

            const updatedProduct = await ProductService.removePromotion(id, parseInt(quantity));
            return res.status(200).json({
                message: "Promotion removed successfully",
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error while removing promotion" });
        }
    }

    async clearPromotions(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedProduct = await ProductService.clearPromotions(id);
            return res.status(200).json({
                message: "All promotions cleared successfully",
                data: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error while clearing promotions" });
        }
    }

    async getFeaturedProducts(req: Request, res: Response) {
        try {
            const featuredProducts = await ProductService.getFeaturedProducts();
            return res.status(200).json(featuredProducts);
        } catch (error) {
            return res.status(500).json({ message: "Error while getting featured products" });
        }
    }

    async getPromotionsProducts(req: Request, res: Response) {
        try {
            const promotionProducts = await ProductService.getPromotionsProducts();
            return res.status(200).json(promotionProducts);
        } catch (error) {
            return res.status(500).json({ message: "Error while getting promotion products" });
        }
    }

}

export const ProductController = new productController();
