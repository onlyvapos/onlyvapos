import { Router } from 'express';
import { SocialController } from '../controllers/socialController';

class socialRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/', SocialController.createLink);
        this.router.get('/get', SocialController.getAllLinks);
        this.router.get('/get/:id', SocialController.getLinkById);
        this.router.put('/update/:id', SocialController.updateLinkById);
        this.router.delete('/delete/:id', SocialController.deleteLinkById);
    }
}
const SocialRoutes = new socialRoutes();
export default SocialRoutes.router;
