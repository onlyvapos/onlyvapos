import productModel from "../models/productModel";
import fs from 'fs';
import path from 'path';
import cloudinary from "cloudinary";
class productService {
    replaceImage(id: string, oldImageUrl: any, newImageUrl: string) {
        throw new Error("Method not implemented.");
    }

    async createProduct(productData: {
        brand: string;
        modelo: string;
        description: string;
        srcImage?: string[];
        price: number;
        capacity: number;
        flavors?: string[];
        featured?: boolean;
    }) {
        try {
            const existingProduct = await productModel.findOne({
                brand: productData.brand,
                modelo: productData.modelo,
                capacity: productData.capacity
            });

            if (existingProduct) {
                throw new Error('A product with the same brand and model and capacity already exists');
            }

            const newProduct = new productModel({
                ...productData,
                srcImage: productData.srcImage || [],
                featured: productData.featured || false,
            });
            return await newProduct.save();
        } catch (error) {
            throw new Error(`Error while creating the product: ${error}`);
        }
    }



    async getAllProducts() {
        try {
            return await productModel.find();
        } catch (error) {
            throw new Error('Error while getting products');
        }
    }

    async getProductById(id: any) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error('Error while getting product by id');
        }
    }

    async updateProductById(id: string, productData: Partial<{
        brand: string;
        modelo: string;
        description: string;
        srcImage: string[];
        price: number;
        capacity: number;
        flavors?: string[];
        featured?: boolean;
    }>) {
        try {

            const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error while updating product');
        }
    }


    async addImageToProduct(productId: string, imageUrl: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $addToSet: { srcImage: imageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error("❌ Error: Producto no encontrado.");
            }

            return updatedProduct;
        } catch (error) {
            throw new Error("❌ Error while adding image to product");
        }
    }



    async removeImageFromProduct(productId: string, imageUrl: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $pull: { srcImage: imageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error('Product not found');
            }

            const matches = imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            const publicId = matches?.[1]; // Extrae correctamente el path de carpeta

            if (publicId) {
                await cloudinary.v2.uploader.destroy(publicId);
                console.log(`✅ Imagen eliminada de Cloudinary: ${publicId}`);
            }

            return updatedProduct;
        } catch (error) {
            console.error('❌ Error al remover imagen del producto:', error);
            throw new Error('Error while removing image from product');
        }
    }


    async replaceImageInProduct(productId: string, oldImageUrl: string, newImage: Express.Multer.File) {
        try {
            // Subir la nueva imagen a Cloudinary
            const result = await cloudinary.v2.uploader.upload(newImage.path);

            const newImageUrl = result.secure_url;
            const publicId = oldImageUrl.split('/').pop()?.split('.')[0]; // Extraer el public_id de la URL

            if (!publicId) {
                throw new Error("Error al obtener el public_id de la imagen antigua.");
            }

            // Eliminar la imagen antigua de Cloudinary
            await cloudinary.v2.uploader.destroy(publicId);

            // Reemplazar la imagen en la base de datos
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $set: { 'srcImage.$': newImageUrl } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error('Failed to add the new image');
            }

            // Eliminar el archivo físico del servidor
            fs.unlinkSync(newImage.path);

            return updatedProduct;
        } catch (error) {
            console.error('Error while replacing image in product:', error);
            throw new Error(`❌ Error while replacing image in product`);
        }
    }

    async addFlavorToProduct(productId: string, flavor: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $addToSet: { flavors: flavor } },
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error while adding flavor to product`);
        }
    }

    async removeFlavorFromProduct(productId: string, flavor: string) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                productId,
                { $pull: { flavors: flavor } },
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error while removing flavor from product`);
        }
    }

    async deleteProductById(id: string) {
        try {
            const product = await productModel.findById(id);

            if (!product) {
                throw new Error('Product not found');
            }

            if (Array.isArray(product.srcImage)) {
                for (const imageUrl of product.srcImage) {
                    const matches = imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
                    const publicId = matches?.[1];
                    if (publicId) {
                        try {
                            await cloudinary.v2.uploader.destroy(publicId);
                            console.log(`✅ Imagen eliminada de Cloudinary: ${publicId}`);
                        } catch (err) {
                            console.warn(`⚠️ No se pudo eliminar imagen de Cloudinary: ${publicId}`, err);
                        }
                    }
                }
            }

            const deletedProduct = await productModel.findByIdAndDelete(id);

            return deletedProduct;
        } catch (error) {
            throw new Error('Error while deleting product and images');
        }
    }


    async getLatestProducts() {
        try {
            const latestProducts = await productModel.find().sort({ createdAt: -1 }).limit(8);
            return latestProducts;
        } catch (error) {
            console.error("Error while getting latest products from DB:", error);
            throw new Error("Error fetching latest products");
        }
    }

    async getProductsWithPromotions() {
        try {
            return await productModel.find({ hasPromotion: true });
        } catch (error) {
            throw new Error("Error while getting products with promotions");
        }
    }

    async getProductsWithoutPromotions() {
        try {
            return await productModel.find({ hasPromotion: false });
        } catch (error) {
            throw new Error("Error while getting products without promotions");
        }
    }

    async addPromotion(productId: string, quantity: number, price: number) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Verificar si ya existe una promoción con la misma cantidad
            const existingPromo = product.promotions.find(promo => promo.quantity === quantity);
            if (existingPromo) {
                throw new Error("A promotion with this quantity already exists");
            }

            // Agregar nueva promoción
            product.promotions.push({ quantity, price });
            product.hasPromotion = true;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while adding promotion");
        }
    }

    async updatePromotions(productId: string, promotions: { quantity: number; price: number }[]) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Reemplazar todas las promociones
            product.promotions = promotions;
            product.hasPromotion = promotions.length > 0;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while updating promotions");
        }
    }

    async removePromotion(productId: string, quantity: number) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Filtrar para eliminar la promoción específica
            product.promotions = product.promotions.filter(promo => promo.quantity !== quantity);
            product.hasPromotion = product.promotions.length > 0;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while removing promotion");
        }
    }

    async clearPromotions(productId: string) {
        try {
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }

            // Limpiar todas las promociones
            product.promotions = [];
            product.hasPromotion = false;
            await product.save();

            return product;
        } catch (error) {
            throw new Error("Error while clearing promotions");
        }
    }

    async getFeaturedProducts() {
        try {
            return await productModel.find({ featured: true });
        } catch (error) {
            throw new Error("Error while getting featured products");
        }
    }

    async getPromotionsProducts() {
        try {
            return await productModel.find({ hasPromotion: true });
        } catch (error) {
            throw new Error("Error while getting featured products");
        }
    }

}

export const ProductService = new productService();
