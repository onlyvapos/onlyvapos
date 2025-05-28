import { Request, Response } from "express";
import { socialService } from "../services/socialService";
import { SocialType } from "../models/socialModel";

class socialController {

    public async createLink(req: Request, res: Response): Promise<Response> {
        try {
            const { link, value } = req.body;
            if (!Object.values(SocialType).includes(link as SocialType)) {
                return res.status(400).json({ message: 'Tipo de enlace no válido. Debe ser main, backup o number.' });
            }

            if (!value || typeof value !== 'string') {
                return res.status(400).json({ message: 'El campo value es obligatorio y debe ser una cadena de texto.' });
            }

            const newLink = await socialService.createLink({ link, value } as any);
            return res.status(201).json({ message: 'Enlace creado exitosamente', newLink });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: `Error al crear el enlace: ${error.message}` });
            }
            return res.status(500).json({ message: 'Error desconocido al crear el enlace' });
        }
    }

    public async getAllLinks(req: Request, res: Response): Promise<Response> {
        try {
            const links = await socialService.getAllLinks();
            return res.status(200).json(links);
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener los enlaces', error });
        }
    }

    async getLinkById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const link = await socialService.getLinkById(id);
            if (!link) {
                return res.status(404).json({ message: 'Link not found' });
            }
            return res.status(200).json(link);
        } catch (error) {
            return res.status(500).json({ message: 'Error while getting link by id' });
        }
    }

    public async updateLinkById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { value } = req.body;

            if (!value || typeof value !== 'string') {
                return res.status(400).json({ message: 'El campo value es obligatorio y debe ser una cadena de texto.' });
            }

            const updatedLink = await socialService.updateLinkById(id, value);
            return res.status(200).json({ message: 'Enlace actualizado exitosamente', updatedLink });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: `Error al actualizar el enlace: ${error.message}` });
            }
            return res.status(500).json({ message: 'Error desconocido al actualizar el enlace' });
        }
    }


    public async deleteLinkById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const deletedLink = await socialService.deleteLinkById(id);
            return res.status(200).json({ message: 'Enlace eliminado exitosamente', deletedLink });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: `Error al eliminar el enlace: ${error.message}` });
            }
            return res.status(500).json({ message: 'Error desconocido al eliminar el enlace' });
        }
    }



}

export const SocialController = new socialController();
