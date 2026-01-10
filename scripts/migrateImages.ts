// scripts/migrateImages.ts
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Remplacez par votre modèle Product
const ProductSchema = new mongoose.Schema({
  img: String,
  name: String,
  // ... autres champs
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function migrateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connecté à MongoDB");

    const products = await Product.find();
    console.log(`📦 ${products.length} produits trouvés\n`);

    for (const product of products) {
      if (product.img.startsWith("/uploads/")) {
        const fileName = product.img.replace("/uploads/", "");
        const localPath = path.join(process.cwd(), "public", "uploads", fileName);

        if (fs.existsSync(localPath)) {
          console.log(`📤 Upload de ${product.name}...`);

          const result = await cloudinary.uploader.upload(localPath, {
            folder: "products",
            public_id: fileName.split('.')[0],
          });

          // Mettre à jour le produit
          product.img = result.secure_url;
          await product.save();

          console.log(`✅ ${product.name} migré`);
          console.log(`   ${result.secure_url}\n`);
        } else {
          console.log(`⚠️  Image non trouvée: ${localPath}\n`);
        }
      } else {
        console.log(`⏭️  ${product.name} déjà migré\n`);
      }
    }

    console.log("🎉 Migration terminée !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

migrateImages();