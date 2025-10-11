import { model, Schema, models } from 'mongoose';

const VendorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // ✅ Ajouter unique pour éviter les doublons
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true, // ✅ AJOUT: Le mot de passe est obligatoire
      minlength: 6
    },
    businessType: {
      type: String,
      enum: ['Agriculteur', 'Grossiste', 'Détaillant', 'Producteur', 'Autre'],
      default: 'Agriculteur'
    },
    logo: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Vendor = models.Vendor || model('Vendor', VendorSchema);