/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * Extend next-auth types so session.user.id is available safely in this file.
 * This uses declaration merging to add an optional `id` to User and ensure Session.user can include it.
 */
declare module "next-auth" {
  interface User {
    id?: string;
  }
  interface Session {
    user?: User;
  }
}
 
// Ajoutez cette interface en haut du fichier route.ts
interface RawProduct {
  _id: any;
  vendorId: any;
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

interface PopulatedVendor {
  _id: any;
  name: string;
  email: string;
  phone: string; 
  businessType: string;
  logo?: string;
}

interface RawProductWithVendor extends RawProduct {
  vendorId: PopulatedVendor;
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 Vérification de la session...");
    
    // Passer authOptions à getServerSession
    const session = await getServerSession(authOptions);
    
    console.log("📋 Session reçue:", session);
    console.log("👤 Session user:", session?.user);
    console.log("🔑 Session user ID:", session?.user?.id);
    
    if (!session || !session.user) {
      console.log("❌ Session manquante ou utilisateur non authentifié");
      return NextResponse.json(
        { message: "Non autorisé. Vous devez être connecté." },
        { status: 401 }
      );
    }

    console.log("✅ Session valide");

    // 2. Récupérer les données du formulaire
    const body = await request.json();
    const {
      name,
      desc,
      price,
      priceNumber,
      img,
      category,
      details,
      origin,
      freshness,
      nutritionalInfo,
      stock
    } = body;

    // 3. Validation des champs obligatoires
    if (!name || !desc || !price || !img || !category) {
      return NextResponse.json(
        { message: "Les champs obligatoires doivent être remplis (nom, description, prix, image, catégorie)" },
        { status: 400 }
      );
    }

    // 4. Validation du prix
    if (typeof priceNumber !== "number" || priceNumber < 0) {
      return NextResponse.json(
        { message: "Le prix doit être un nombre positif" },
        { status: 400 }
      );
    }

    // 5. Validation du stock
    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { message: "Le stock doit être un nombre positif" },
        { status: 400 }
      );
    }

    console.log("🔄 Connexion à MongoDB...");

    // 6. Se connecter à MongoDB
    await connectDB();

    console.log("✅ Connecté à MongoDB");

    // 7. Récupérer l'ID du vendeur depuis la session
    const vendorId = session.user.id;

    console.log("🔑 Vendor ID à sauvegarder:", vendorId);
    console.log("🔑 Vendor ID type:", typeof vendorId);

    if (!vendorId) {
      console.log("❌ ID du vendeur introuvable");
      return NextResponse.json(
        { message: "ID du vendeur introuvable dans la session" },
        { status: 400 }
      );
    }

    console.log("💾 Création du produit...");

    // 8. Créer le nouveau produit
    const newProduct = await Product.create({
      vendorId,
      name,
      desc,
      price,
      priceNumber,
      img,
      category,
      details: details || undefined,
      origin: origin || undefined,
      freshness: freshness || undefined,
      nutritionalInfo: nutritionalInfo || [],
      stock,
      isActive: true,
    });

    console.log("✅ Produit créé avec succès:", newProduct._id);

    // 9. Retourner une réponse de succès
    return NextResponse.json(
      {
        message: "Produit ajouté avec succès",
        productId: newProduct._id.toString(),
        product: {
          id: newProduct._id.toString(),
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          stock: newProduct.stock,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du produit:", error);
    
    if (error instanceof Error) {
      // Erreur de timeout
      if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
        return NextResponse.json(
          { 
            message: "Impossible de se connecter à la base de données",
            details: "Timeout de connexion"
          },
          { status: 503 }
        );
      }
      
      // Erreur de validation Mongoose
      if (error.message.includes("validation failed")) {
        return NextResponse.json(
          { message: "Données invalides. Vérifiez tous les champs." },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "Erreur lors de l'ajout du produit" },
      { status: 500 }
    );
  }
}

// Dans votre API GET /api/product
export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Connexion à MongoDB...");
    await connectDB();
    console.log("✅ Connecté à MongoDB");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const vendorId = searchParams.get('vendorId');
    
     
    const filter: any = { isActive: true };
    if (category) filter.category = category;
    if (vendorId) filter.vendorId = vendorId;

    // Récupérer les produits AVEC populate pour avoir les infos vendeur
    const products = await Product.find(filter)
      .populate("vendorId", "name email phone businessType logo")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ ${products.length} produits trouvés`);

    // Transformation pour le frontend
    const transformedProducts = products.map((product: any) => {
  // Assertion de type pour traiter product comme RawProductWithVendor
  const rawProduct = product as RawProductWithVendor;
  
  return {
    id: rawProduct._id.toString(),
    _id: rawProduct._id.toString(),
    name: rawProduct.name,
    description: rawProduct.desc,
    desc: rawProduct.desc,
    price: rawProduct.price,
    priceNumber: Number(rawProduct.priceNumber),
    img: rawProduct.img,
    category: rawProduct.category,
    vendorId: rawProduct.vendorId?._id?.toString() || rawProduct.vendorId?.toString(),
    vendorInfo: rawProduct.vendorId ? {
      _id: rawProduct.vendorId._id?.toString(),
      name: rawProduct.vendorId.name,
      email: rawProduct.vendorId.email,
      phone: rawProduct.vendorId.phone,
      businessType: rawProduct.vendorId.businessType,
      logo: rawProduct.vendorId.logo
    } : null,
    details: rawProduct.details,
    origin: rawProduct.origin,
    freshness: rawProduct.freshness,
    nutritionalInfo: rawProduct.nutritionalInfo || [],
    stock: rawProduct.stock,
    unit: rawProduct.unit || "unité",
    isActive: rawProduct.isActive,
    createdAt: rawProduct.createdAt,
    updatedAt: rawProduct.updatedAt,
  };
});

    // Debug
    if (transformedProducts.length > 0) {
      console.log('🔍 Premier produit transformé:', {
        id: transformedProducts[0].id,
        name: transformedProducts[0].name,
        vendorId: transformedProducts[0].vendorId,
        vendorInfo: transformedProducts[0].vendorInfo
      });
    }

    return NextResponse.json({ products: transformedProducts }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur dans la recherche des produits:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
 
// // API GET pour récupérer tous les produits
// export async function GET() {
//   try {
//     console.log("🔄 Connexion à MongoDB...");
    
//     await connectDB();

//     console.log("✅ Connecté à MongoDB");

//     // Récupérer tous les produits actifs
//     const products = await Product.find({ isActive: true })
//       .populate("vendorId", "name email") // Récupérer aussi les infos du vendeur
//       .sort({ createdAt: -1 }); // Trier par date de création (plus récent en premier)

//     console.log(`✅ ${products.length} produits trouvés`);

//     return NextResponse.json({ products }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Erreur dans la recherche des produits:", error);
    
//     if (error instanceof Error && 
//         (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt"))) {
//       return NextResponse.json(
//         { 
//           message: "Impossible de se connecter à la base de données",
//           details: "Timeout de connexion"
//         },
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération des produits" },
//       { status: 500 }
//     );
//   }
// }









// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import connectDB from "@/lib/mongodb";
// import { Product } from "@/lib/models";
// import { authOptions } from "../auth/[...nextauth]/route";

// // Étendre le type de session utilisateur pour inclure 'id'
// declare module "next-auth" {
//   interface User {
//     id?: string;
//   }
//   interface Session {
//     user?: User;
//   }
// }
 
// export async function POST(request: NextRequest) {
//   try {
//     console.log("🔍 Vérification de la session...");
    
//     // Passer authOptions à getServerSession
//     const session = await getServerSession(authOptions);
    
//     console.log("📋 Session reçue:", session);
//     console.log("👤 Session user:", session?.user);
//     console.log("🔑 Session user ID:", session?.user?.id);
    
//     if (!session || !session.user) {
//       console.log("❌ Session manquante ou utilisateur non authentifié");
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     }

//     console.log("✅ Session valide");

//     // 2. Récupérer les données du formulaire
//     const body = await request.json();
//     const {
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details,
//       origin,
//       freshness,
//       nutritionalInfo,
//       stock
//     } = body;

//     // 3. Validation des champs obligatoires
//     if (!name || !desc || !price || !img || !category) {
//       return NextResponse.json(
//         { message: "Les champs obligatoires doivent être remplis (nom, description, prix, image, catégorie)" },
//         { status: 400 }
//       );
//     }

//     // 4. Validation du prix
//     if (typeof priceNumber !== "number" || priceNumber < 0) {
//       return NextResponse.json(
//         { message: "Le prix doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     // 5. Validation du stock
//     if (typeof stock !== "number" || stock < 0) {
//       return NextResponse.json(
//         { message: "Le stock doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     console.log("🔄 Connexion à MongoDB...");

//     // 6. Se connecter à MongoDB
//     await connectDB();

//     console.log("✅ Connecté à MongoDB");

//     // 7. Récupérer l'ID du vendeur depuis la session
//     const vendorId = session.user.id;

//     console.log("🔑 Vendor ID à sauvegarder:", vendorId);
//     console.log("🔑 Vendor ID type:", typeof vendorId);

//     if (!vendorId) {
//       console.log("❌ ID du vendeur introuvable");
//       return NextResponse.json(
//         { message: "ID du vendeur introuvable dans la session" },
//         { status: 400 }
//       );
//     }

//     console.log("💾 Création du produit...");

//     // 8. Créer le nouveau produit
//     const newProduct = await Product.create({
//       vendorId,
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details: details || undefined,
//       origin: origin || undefined,
//       freshness: freshness || undefined,
//       nutritionalInfo: nutritionalInfo || [],
//       stock,
//       isActive: true,
//     });

//     console.log("✅ Produit créé avec succès:", newProduct._id);

//     // 9. Retourner une réponse de succès
//     return NextResponse.json(
//       {
//         message: "Produit ajouté avec succès",
//         productId: newProduct._id.toString(),
//         product: {
//           id: newProduct._id.toString(),
//           name: newProduct.name,
//           price: newProduct.price,
//           category: newProduct.category,
//           stock: newProduct.stock,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("❌ Erreur lors de l'ajout du produit:", error);
    
//     if (error instanceof Error) {
//       // Erreur de timeout
//       if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
//         return NextResponse.json(
//           { 
//             message: "Impossible de se connecter à la base de données",
//             details: "Timeout de connexion"
//           },
//           { status: 503 }
//         );
//       }
      
//       // Erreur de validation Mongoose
//       if (error.message.includes("validation failed")) {
//         return NextResponse.json(
//           { message: "Données invalides. Vérifiez tous les champs." },
//           { status: 400 }
//         );
//       }
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de l'ajout du produit" },
//       { status: 500 }
//     );
//   }
// }
 
// // API GET pour récupérer tous les produits
// export async function GET() {
//   try {
//     console.log("🔄 Connexion à MongoDB...");
    
//     await connectDB();

//     console.log("✅ Connecté à MongoDB");

//     // Récupérer tous les produits actifs
//     const products = await Product.find({ isActive: true })
//       .populate("vendorId", "name email") // Récupérer aussi les infos du vendeur
//       .sort({ createdAt: -1 }); // Trier par date de création (plus récent en premier)

//     console.log(`✅ ${products.length} produits trouvés`);

//     return NextResponse.json({ products }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Erreur dans la recherche des produits:", error);
    
//     if (error instanceof Error && 
//         (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt"))) {
//       return NextResponse.json(
//         { 
//           message: "Impossible de se connecter à la base de données",
//           details: "Timeout de connexion"
//         },
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération des produits" },
//       { status: 500 }
//     );
//   }
// }










// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import connectDB from "@/lib/mongodb";
// import { Product } from "@/lib/models";
// import { authOptions } from "../auth/[...nextauth]/route";
 
// export async function POST(request: NextRequest) {
//   try {
//     console.log("🔍 Vérification de la session...");
    
//     const session = await getServerSession(authOptions);
    
//     console.log("📋 Session reçue:", session);
//     console.log("👤 Session user:", session?.user);
//     console.log("🔑 Session user ID:", session?.user?.id);
    
//     if (!session || !session.user) {
//       console.log("❌ Session manquante ou utilisateur non authentifié");
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     }

//     console.log("✅ Session valide");

//     const body = await request.json();
//     const {
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details,
//       origin,
//       freshness,
//       nutritionalInfo,
//       stock
//     } = body;

//     // Validation des champs obligatoires
//     if (!name || !desc || !price || !img || !category) {
//       return NextResponse.json(
//         { message: "Les champs obligatoires doivent être remplis (nom, description, prix, image, catégorie)" },
//         { status: 400 }
//       );
//     }

//     // Validation du prix
//     if (typeof priceNumber !== "number" || priceNumber < 0) {
//       return NextResponse.json(
//         { message: "Le prix doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     // Validation du stock
//     if (typeof stock !== "number" || stock < 0) {
//       return NextResponse.json(
//         { message: "Le stock doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     console.log("🔄 Connexion à MongoDB...");
//     await connectDB();
//     console.log("✅ Connecté à MongoDB");

//     const vendorId = session.user.id;

//     console.log("🔑 Vendor ID à sauvegarder:", vendorId);
//     console.log("🔑 Vendor ID type:", typeof vendorId);

//     if (!vendorId) {
//       console.log("❌ ID du vendeur introuvable");
//       return NextResponse.json(
//         { message: "ID du vendeur introuvable dans la session" },
//         { status: 400 }
//       );
//     }

//     console.log("💾 Création du produit...");

//     const newProduct = await Product.create({
//       vendorId,
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details: details || undefined,
//       origin: origin || undefined,
//       freshness: freshness || undefined,
//       nutritionalInfo: nutritionalInfo || [],
//       stock,
//       isActive: true,
//     });

//     console.log("✅ Produit créé avec succès:", newProduct._id);

//     return NextResponse.json(
//       {
//         message: "Produit ajouté avec succès",
//         productId: newProduct._id.toString(),
//         product: {
//           id: newProduct._id.toString(),
//           name: newProduct.name,
//           price: newProduct.price,
//           category: newProduct.category,
//           stock: newProduct.stock,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("❌ Erreur lors de l'ajout du produit:", error);
    
//     if (error instanceof Error) {
//       if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
//         return NextResponse.json(
//           { 
//             message: "Impossible de se connecter à la base de données",
//             details: "Timeout de connexion"
//           },
//           { status: 503 }
//         );
//       }
      
//       if (error.message.includes("validation failed")) {
//         return NextResponse.json(
//           { message: "Données invalides. Vérifiez tous les champs." },
//           { status: 400 }
//         );
//       }
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de l'ajout du produit" },
//       { status: 500 }
//     );
//   }
// }
 
// // ✅ API GET CORRIGÉE - Transformation des produits pour le frontend
// export async function GET(request: NextRequest) {
//   try {
//     console.log("🔄 Connexion à MongoDB...");
//     await connectDB();
//     console.log("✅ Connecté à MongoDB");

//     // Paramètres de recherche optionnels
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get('category');
//     const vendorId = searchParams.get('vendorId');
    
//     // Construire le filtre
//     const filter: any = { isActive: true };
//     if (category) filter.category = category;
//     if (vendorId) filter.vendorId = vendorId;

//     // ✅ Récupérer les produits SANS populate pour garder vendorId comme ObjectId
//     const products = await Product.find(filter)
//       .sort({ createdAt: -1 })
//       .lean(); // .lean() pour obtenir des objets JavaScript purs

//     console.log(`✅ ${products.length} produits trouvés`);

//     // ✅ TRANSFORMATION CRITIQUE : Convertir tous les ObjectId en strings
//     const transformedProducts = products.map(product => ({
//       id: product._id.toString(),
//       _id: product._id.toString(),
//       name: product.name,
//       desc: product.desc,
//       price: product.price,
//       priceNumber: product.priceNumber,
//       img: product.img,
//       category: product.category,
//       // ✅ CONVERSION CRITIQUE : ObjectId → string
//       vendorId: product.vendorId.toString(),
//       details: product.details,
//       origin: product.origin,
//       freshness: product.freshness,
//       nutritionalInfo: product.nutritionalInfo || [],
//       stock: product.stock,
//       isActive: product.isActive,
//       createdAt: product.createdAt?.toISOString?.() || product.createdAt,
//       updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
//     }));

//     // Debug log pour le premier produit
//     if (transformedProducts.length > 0) {
//       console.log('🔍 Premier produit transformé:', {
//         id: transformedProducts[0].id,
//         name: transformedProducts[0].name,
//         vendorId: transformedProducts[0].vendorId,
//         vendorIdType: typeof transformedProducts[0].vendorId,
//         vendorIdLength: transformedProducts[0].vendorId.length
//       });
//     }

//     return NextResponse.json({ products: transformedProducts }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Erreur dans la recherche des produits:", error);
    
//     if (error instanceof Error && 
//         (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt"))) {
//       return NextResponse.json(
//         { 
//           message: "Impossible de se connecter à la base de données",
//           details: "Timeout de connexion"
//         },
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération des produits" },
//       { status: 500 }
//     );
//   }
// }







// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
 
// import { authOptions } from "../auth/[...nextauth]/route";
// import connectDB from "@/lib/mongodb";
// import { Product } from "@/lib/models";
 
 
// export async function POST(request: NextRequest) {
//   try {
//     console.log("🔍 Vérification de la session...");
    
//     const session = await getServerSession(authOptions);
    
//     console.log("📋 Session reçue:", session);
//     console.log("👤 Session user:", session?.user);
//     console.log("🔑 Session user ID:", session?.user?.id);
    
//     if (!session || !session.user) {
//       console.log("❌ Session manquante ou utilisateur non authentifié");
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     }

//     console.log("✅ Session valide");

//     const body = await request.json();
//     const {
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details,
//       origin,
//       freshness,
//       nutritionalInfo,
//       stock
//     } = body;

//     // Validation des champs obligatoires
//     if (!name || !desc || !price || !img || !category) {
//       return NextResponse.json(
//         { message: "Les champs obligatoires doivent être remplis (nom, description, prix, image, catégorie)" },
//         { status: 400 }
//       );
//     }

//     // Validation du prix
//     if (typeof priceNumber !== "number" || priceNumber < 0) {
//       return NextResponse.json(
//         { message: "Le prix doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     // Validation du stock
//     if (typeof stock !== "number" || stock < 0) {
//       return NextResponse.json(
//         { message: "Le stock doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     console.log("🔄 Connexion à MongoDB...");
//     await connectDB();
//     console.log("✅ Connecté à MongoDB");

//     const vendorId = session.user.id;

//     console.log("🔑 Vendor ID à sauvegarder:", vendorId);
//     console.log("🔑 Vendor ID type:", typeof vendorId);

//     if (!vendorId) {
//       console.log("❌ ID du vendeur introuvable");
//       return NextResponse.json(
//         { message: "ID du vendeur introuvable dans la session" },
//         { status: 400 }
//       );
//     }

//     console.log("💾 Création du produit...");

//     const newProduct = await Product.create({
//       vendorId,
//       name,
//       desc,
//       price,
//       priceNumber,
//       img,
//       category,
//       details: details || undefined,
//       origin: origin || undefined,
//       freshness: freshness || undefined,
//       nutritionalInfo: nutritionalInfo || [],
//       stock,
//       isActive: true,
//     });

//     console.log("✅ Produit créé avec succès:", newProduct._id);

//     return NextResponse.json(
//       {
//         message: "Produit ajouté avec succès",
//         productId: newProduct._id.toString(),
//         product: {
//           id: newProduct._id.toString(),
//           name: newProduct.name,
//           price: newProduct.price,
//           category: newProduct.category,
//           stock: newProduct.stock,
//         }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error("❌ Erreur lors de l'ajout du produit:", error);
    
//     if (error instanceof Error) {
//       if (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt")) {
//         return NextResponse.json(
//           { 
//             message: "Impossible de se connecter à la base de données",
//             details: "Timeout de connexion"
//           },
//           { status: 503 }
//         );
//       }
      
//       if (error.message.includes("validation failed")) {
//         return NextResponse.json(
//           { message: "Données invalides. Vérifiez tous les champs." },
//           { status: 400 }
//         );
//       }
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de l'ajout du produit" },
//       { status: 500 }
//     );
//   }
// }
 
// // ✅ API GET CORRIGÉE - Transformation des produits pour le frontend
// export async function GET(request: NextRequest) {
//   try {
//     console.log("🔄 Connexion à MongoDB...");
//     await connectDB();
//     console.log("✅ Connecté à MongoDB");

//     // Paramètres de recherche optionnels
//     const { searchParams } = new URL(request.url);
//     const category = searchParams.get('category');
//     const vendorId = searchParams.get('vendorId');
    
//     // Construire le filtre
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const filter: any = { isActive: true };
//     if (category) filter.category = category;
//     if (vendorId) filter.vendorId = vendorId;

//     // ✅ Récupérer les produits SANS populate pour garder vendorId comme ObjectId
//     const products = await Product.find(filter)
//       .sort({ createdAt: -1 })
//       .lean(); // .lean() pour obtenir des objets JavaScript purs

//     console.log(`✅ ${products.length} produits trouvés`);

//     // ✅ TRANSFORMATION CRITIQUE : Convertir tous les ObjectId en strings
//     const transformedProducts = products.map(product => ({
//       id: product._id.toString(),
//       _id: product._id.toString(),
//       name: product.name,
//       desc: product.desc,
//       price: product.price,
//       priceNumber: product.priceNumber,
//       img: product.img,
//       category: product.category,
//       // ✅ CONVERSION CRITIQUE : ObjectId → string
//       vendorId: product.vendorId.toString(),
//       details: product.details,
//       origin: product.origin,
//       freshness: product.freshness,
//       nutritionalInfo: product.nutritionalInfo || [],
//       stock: product.stock,
//       isActive: product.isActive,
//       createdAt: product.createdAt?.toISOString?.() || product.createdAt,
//       updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
//     }));

//     // Debug log pour le premier produit
//     if (transformedProducts.length > 0) {
//       console.log('🔍 Premier produit transformé:', {
//         id: transformedProducts[0].id,
//         name: transformedProducts[0].name,
//         vendorId: transformedProducts[0].vendorId,
//         vendorIdType: typeof transformedProducts[0].vendorId,
//         vendorIdLength: transformedProducts[0].vendorId.length
//       });
//     }

//     return NextResponse.json({ products: transformedProducts }, { status: 200 });

//   } catch (error) {
//     console.error("❌ Erreur dans la recherche des produits:", error);
    
//     if (error instanceof Error && 
//         (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt"))) {
//       return NextResponse.json(
//         { 
//           message: "Impossible de se connecter à la base de données",
//           details: "Timeout de connexion"
//         },
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération des produits" },
//       { status: 500 }
//     );
//   }
// }