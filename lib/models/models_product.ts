// import {model, Schema, models} from 'mongoose'

// const ProductSchema = new Schema(
//   {
//     vendorId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: 'Vendor'
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     }, 
//     desc: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     price: {
//       type: String,
//       required: true
//     },
//     priceNumber: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     img: {
//       type: String,
//       required: true
//     },
//     category: {
//       type: String,
//       required: true
//     },
//     details: {
//       type: String,
//       required: false
//     },
//     origin: {
//       type: String,
//       required: false
//     },
//     freshness: {
//       type: String,
//       required: false
//     },
//     nutritionalInfo: [{
//       type: String
//     }],
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     stock: {
//       type: Number,
//       required: true,
//       min: 0, 
//       default: 0
//     }
//   },
// );

// export const Product= models.Product || model('Product', ProductSchema);


import { model, Schema, models } from "mongoose";

export interface IProduct {
  vendorId: Schema.Types.ObjectId;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
  img: string;
  category: string;
  details?: string;
  origin?: string;
  freshness?: string;
  nutritionalInfo?: string[];
  isActive: boolean;
  stock: number;
  unit?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      required: [true, "L'ID du vendeur est requis"],
      ref: "Vendor",
    },
    name: {
      type: String,
      required: [true, "Le nom du produit est requis"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Le prix est requis"],
    },
    priceNumber: {
      type: Number,
      required: [true, "Le prix numérique est requis"],
      min: [0, "Le prix doit être positif"],
    },
    img: {
      type: String,
      required: [true, "L'image est requise"],
    },
    category: {
      type: String,
      required: [true, "La catégorie est requise"],
    },
    details: {
      type: String,
      required: false,
    },
    origin: {
      type: String,
      required: false,
    },
    freshness: {
      type: String,
      required: false,
    },
    nutritionalInfo: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: [true, "Le stock est requis"],
      min: [0, "Le stock doit être positif"],
      default: 0,
    },
    unit: {
      type: String,
      required: false,
      default: "unité"
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Index pour améliorer les performances de recherche
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);