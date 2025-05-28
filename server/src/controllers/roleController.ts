import { Request, Response } from "express";
import { RoleService } from "../services/roleService";
import { roleType } from "../models/roleModel";

class roleController {
    async createRole(req: Request, res: Response) {
        try {
            const { role } = req.body;

            if (!Object.values(roleType).includes(role)) {
                return res.status(400).json({ message: 'Invalide role' });
            }

            const newRole = await RoleService.createRole(role);
            return res.status(201).json(newRole);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating the role' });
        }
    }

    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({ message: 'Error while getting roles' });
        }
    }

    async getRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const role = await RoleService.getRoleById(id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json(role);
        } catch (error) {
            return res.status(500).json({ message: 'Error while getting role by id' });
        }
    }

    async updateRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            if (!Object.values(roleType).includes(role)) {
                return res.status(400).json({ message: 'Invalid role' });
            }
            const updateRole = await RoleService.updateRoleById(id, role);
            return res.status(200).json(updateRole);
        } catch (error) {
            return res.status(500).json({ message: 'Error while updating role' });
        }
    }

    async deleteRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletRole = await RoleService.deleteRoleById(id);
            if (!deletRole) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error while deleting role' });
        }
    }

}
export const RoleController = new roleController();
