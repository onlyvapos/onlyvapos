import { Router } from 'express';
import { carouselController } from '../controllers/carouselController';
import imageUpload from '../imagesConfig';

class CarouselRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:type', carouselController.getCarouselByType); // 'main' o 'secondary'
        this.router.post('/upload/:type', imageUpload.single('image'), carouselController.uploadImageToCarousel);
        this.router.post('/remove/:type', carouselController.removeImageFromCarousel);
        this.router.put('/replace/:type', carouselController.replaceCarouselImages);
    }
}

const carouselRoutes = new CarouselRoutes();
export default carouselRoutes.router;
