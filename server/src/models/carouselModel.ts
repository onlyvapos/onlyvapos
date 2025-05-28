import mongoose, { Document, Schema } from 'mongoose';

export interface ICarouselImage extends Document {
    type: 'main' | 'secondary';
    images: string[];
}

const carouselImageSchema: Schema = new Schema<ICarouselImage>({
    type: {
        type: String,
        enum: ['main', 'secondary'],
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const CarouselImage = mongoose.model<ICarouselImage>('CarouselImage', carouselImageSchema);

export default CarouselImage;
