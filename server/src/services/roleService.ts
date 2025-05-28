import roleModel from "../models/roleModel";
import { roleType } from "../models/roleModel";

class roleService {

    async createRole(role: roleType) {
        try {
            const newRole = new roleModel({ role });
            return await newRole.save();
        } catch (error) {
            throw new Error('Error while creating the role');
        }
    }

    async getAllRoles() {
        try {
            return await roleModel.find();
        } catch (error) {
            throw new Error('Error while getting roles');
        }
    }

    async getRoleById(id: string) {
        try {
            const role = await roleModel.findById(id);
            if (!role) {
                throw new Error('Role not found');
            }
            return role;
        } catch (error) {
            throw new Error('Error while getting role by id');
        }
    }

    async updateRoleById(id: string, role: roleType) {
        try {
            const updateRole = await roleModel.findByIdAndUpdate(id, { role }, { new: true });
            if (!updateRole) {
                throw new Error('Role not found');
            }
            return updateRole;
        } catch (error) {
            throw new Error('Error while updating role');
        }
    }

    async deleteRoleById(id: string) {
        try {
            const deleteRole = await roleModel.findByIdAndDelete(id);
            if (!deleteRole) {
                throw new Error('Role not found');
            }
            return deleteRole;
        } catch (error) {
            throw new Error('Error while deleting role by id');
        }
    }

}
export const RoleService = new roleService();
