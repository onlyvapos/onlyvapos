import { Router } from 'express';
import { RoleController } from '../controllers/roleController';

class roleRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/', RoleController.createRole);
        this.router.get('/get', RoleController.getAllRoles);
        this.router.get('/get/:id', RoleController.getRoleById);
        this.router.put('/update/:id', RoleController.updateRoleById);
        this.router.delete('/delete/:id', RoleController.deleteRoleById);
    }
}
const RoleRoutes = new roleRoutes();
export default RoleRoutes.router;
