import userModel from "../models/userModel";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from "../config";

class userService {

    async createUser(userData: {
        name: string;
        lastname: string;
        dateBirth: Date;
        email: string;
        password: string;
        role: string;
        phone: number;
    }) {
        try {
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error) {
            throw new Error(`Error while creating the user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllUsers() {
        try {
            return await userModel.find();
        } catch (error) {
            throw new Error('Error while getting users');
        }
    }

    async getUserById(id: string) {
        try {
            const user = await userModel.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error while getting user by id');
        }
    }

    async updateUserById(id: string, userData: Partial<{
        name: string;
        lastname: string;
        dateBirth: Date;
        email: string;
        password: string;
        role: string;
        phone: number;
    }>) {
        try {
            if (userData.password) {
                userData.password = await bcrypt.hash(userData.password, 10);
            }

            const updatedUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        } catch (error) {
            throw new Error('Error while updating user');
        }
    }

    async deleteUserById(id: string) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new Error('User not found');
            }
            return deletedUser;
        } catch (error) {
            throw new Error('Error while deleting user by id');
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new Error('Credenciales incorrectas');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Credenciales incorrectas');
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                config.jwtSecret,
                { expiresIn: '1h' }
            );

            return { token };
        } catch (error) {
            const errorMessage = 
                error instanceof Error ? error.message : 'Error en el servidor';
            throw new Error(errorMessage);
        }
    }
}

export const UserService = new userService();
