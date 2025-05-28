import { Schema, model, Document } from 'mongoose';

export enum SocialType {
    Main = 'main',
    Backup = 'backup',
    Number = 'number',
}

export interface ISocial extends Document {
    link: SocialType;
    value: string;
}

const socialSchema = new Schema<ISocial>({
    link: {
        type: String,
        enum: Object.values(SocialType),
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true,
        trim: true,
    }
},

    {
        timestamps: true
    }
)

const socialModel = model<ISocial>('Link', socialSchema);

export default socialModel;

