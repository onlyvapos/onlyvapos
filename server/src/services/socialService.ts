import socialModel, { ISocial } from "../models/socialModel";
import { SocialType } from "../models/socialModel";

class SocialService {

    public async createLink(data: ISocial): Promise<ISocial> {
        try {
            const newLink = new socialModel(data);
            return await newLink.save();
        } catch (error: any) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                throw new Error(`Ya existe un enlace con el tipo ${data.link}.`);
            }
            if (error instanceof Error) {
                throw new Error(`Error al crear un nuevo enlace: ${error.message}`);
            }
            throw new Error('Error desconocido al crear un nuevo enlace');
        }
    }

    public async getAllLinks(): Promise<ISocial[]> {
        try {
            return await socialModel.find();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al obtener los enlaces: ${error.message}`);
            }
            throw new Error('Error desconocido al obtener los enlaces');
        }
    }

    async getLinkById(id: string) {
        try {
            const link = await socialModel.findById(id);
            if (!link) {
                throw new Error('Link not found');
            }
            return link;
        } catch (error) {
            throw new Error('Error while getting link by type');
        }
    }

    public async updateLinkById(id: string, value: string): Promise<ISocial | null> {
        try {
            const updatedLink = await socialModel.findByIdAndUpdate(
                id,
                { value },
                { new: true, runValidators: true }
            );
            if (!updatedLink) {
                throw new Error('Link not found');
            }
            return updatedLink;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al actualizar el enlace con ID ${id}: ${error.message}`);
            }
            throw new Error('Error desconocido al actualizar el enlace');
        }
    }


    public async deleteLinkById(id: string): Promise<ISocial | null> {
        try {
            const deletedLink = await socialModel.findByIdAndDelete(id);
            if (!deletedLink) {
                throw new Error('Link not found');
            }
            return deletedLink;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al eliminar el enlace con ID ${id}: ${error.message}`);
            }
            throw new Error('Error desconocido al eliminar el enlace');
        }
    }

}

export const socialService = new SocialService();
