import { Router } from 'express';
import { UserController } from '../controllers/userController';

class userRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/', UserController.createUser);
        this.router.get('/get', UserController.getAllUsers);
        this.router.get('/get/:id', UserController.getUserById);
        this.router.put('/update/:id', UserController.updateUserById);
        this.router.delete('/delete/:id', UserController.deleteUserById);
        this.router.post('/validateToken', UserController.validateToken);
        this.router.post('/login', UserController.login);
    }
}
const UserRoutes = new userRoutes();
export default UserRoutes.router;
