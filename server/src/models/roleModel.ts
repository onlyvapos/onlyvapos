import { Schema, model, Document } from 'mongoose';

export enum roleType {
    Admin = 'admin',
    Customer = 'customer'
}

export interface iRole extends Document {
    role: roleType;
}

const roleSchema = new Schema<iRole>({
    role: {
        type: String,
        enum: Object.values(roleType),
        required: true,
        unique: true
    }
},

    {
        timestamps: true
    }
)

const roleModel = model<iRole>('Role', roleSchema);

export default roleModel;
