import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { iRole } from './roleModel';
import roleModel from './roleModel';

export interface IUser extends Document {
    name: string;
    lastname: string;
    dateBirth: Date;
    phone: string;
    email: string;
    password: string;
    role: iRole['_id'];
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        dateBirth: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true,
            validate: {
                validator: async function (value: Schema.Types.ObjectId) {
                    const roleExists = await roleModel.exists({ _id: value });
                    return roleExists != null;
                },
                message: 'The specified role does not exist.',
            },
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: /^[0-9]{10}$/,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const userModel = model<IUser>('User', userSchema);

export default userModel;
