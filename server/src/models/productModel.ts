import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
    brand: string;
    modelo: string;
    description: string;
    srcImage: string[];
    price: number;
    capacity: number
    flavors: string[];
    hasPromotion: boolean;
    promotions: { quantity: number; price: number }[];
    featured: boolean;
}

const productSchema = new Schema<IProduct>(
    {
        brand: {
            type: String,
            required: true,
            trim: true
        },
        modelo: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        srcImage: {
            type: [String],
            required: false,
            default: [],
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            min: 0,
        },
        capacity: {
            type: Number,
            required: true,
            trim: true,
            min: 0,
        },
        flavors: {
            type: [String],
            default: [],
        },
        hasPromotion: {
            type: Boolean,
            default: false,
        },
        promotions: [{
            quantity: { type: Number, required: true, min: 0 },
            price: { type: Number, required: true, min: 0 }
        }],
        featured: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
);


const productModel = model<IProduct>('Product', productSchema);

export default productModel;
