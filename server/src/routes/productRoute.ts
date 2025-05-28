import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import imageUpload from '../imagesConfig';

class productRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/', ProductController.createProduct);
        this.router.get('/get', ProductController.getAllProducts);
        this.router.get('/get/:id', ProductController.getProductById);
        this.router.put('/update/:id', ProductController.updateProductById);
        this.router.delete('/delete/:id', ProductController.deleteProductById);
        this.router.post('/addFlavor/:id', ProductController.addFlavor);
        this.router.post('/removeFlavor/:id', ProductController.removeFlavor);
        this.router.post('/addImage/:id', imageUpload.single('image'), ProductController.addImage);
        this.router.post('/removeImage/:id', ProductController.removeImage);
        this.router.post('/replaceImage/:id', imageUpload.single('image'), ProductController.replaceImage);
        this.router.get('/latest', ProductController.getLatestProducts);
        this.router.get('/featured', ProductController.getFeaturedProducts);
        this.router.get('/promotion', ProductController.getPromotionsProducts);
        this.router.get('/with-promotions', ProductController.getProductsWithPromotions);
        this.router.get('/without-promotions', ProductController.getProductsWithoutPromotions);
        this.router.post('/:id/add-promotion', ProductController.addPromotion);
        this.router.put('/:id/update-promotions', ProductController.updatePromotions);
        this.router.delete('/:id/remove-promotion/:quantity', ProductController.removePromotion);
        this.router.delete('/:id/clear-promotions', ProductController.clearPromotions);
    }
}
const ProductRoutes = new productRoutes();
export default ProductRoutes.router;
