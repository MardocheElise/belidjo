// import { Product } from "@/lib/models";
// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";

// export async function GET() {
//     try {
//         await connectDB();
    
//         const fetchProducts = await Product.find({})
//             .populate('vendorId', 'name businessName email phone rating isVerified')
//             .sort({ createdAt: -1 });
        
//         return NextResponse.json({ 
//             status: 200,
//             produits: fetchProducts,
//             count: fetchProducts.length
//         });
//     } catch (error) {
//         console.error("❌ Error fetching products:", error);
//         return NextResponse.json(
//             { status: 500, message: "Something went wrong" }, 
//             { status: 500 }
//         );
//     }
// }

// // POST - Créer un nouveau produit
// export async function POST(req: NextRequest) {
//     try {
//         await connectDB();
        
//         const body = await req.json();
//         const { 
//             vendorId,
//             name, 
//             desc, 
//             price, 
//             priceNumber, 
//             img, 
//             category, 
//             details, 
//             origin, 
//             freshness, 
//             nutritionalInfo, 
//             isActive, 
//             stock 
//         } = body;
        
//         // Validation des champs requis
//         if (!vendorId) {
//             return NextResponse.json(
//                 { status: 400, message: "vendorId est requis" }, 
//                 { status: 400 }
//             );
//         }
        
//         if (!name || !desc || !price || !priceNumber || !img || !category || !details || !origin || !freshness || !nutritionalInfo || isActive === undefined || stock === undefined) {
//             return NextResponse.json(
//                 { status: 400, message: "Informations incomplètes" }, 
//                 { status: 400 }
//             );
//         }
        
//         // Créer le produit
//         const addProduct = new Product({
//             vendorId,
//             name,
//             desc,
//             price,
//             priceNumber,
//             img,
//             category,
//             details,
//             origin,
//             freshness,
//             nutritionalInfo,
//             isActive,
//             stock
//         });
        
//         await addProduct.save();
        
//         // Récupérer le produit avec les infos du vendeur
//         const populatedProduct = await Product.findById(addProduct._id)
//             .populate('vendorId', 'name businessName email phone');
        
//         return NextResponse.json({ 
//             status: 201, 
//             message: "Produit ajouté avec succès",
//             produit: populatedProduct
//         }, { status: 201 });
        
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         console.error("❌ Error creating product:", error);
        
//         // Gestion des erreurs de validation
//         if (error.name === 'ValidationError') {
//             const errors = Object.keys(error.errors).map(key => ({
//                 field: key,
//                 message: error.errors[key].message
//             }));
            
//             return NextResponse.json(
//                 { 
//                     status: 400, 
//                     message: "Erreur de validation",
//                     errors: errors
//                 },
//                 { status: 400 }
//             );
//         }
//         return NextResponse.json(
//             { status: 500, message: "Something went wrong" }, 
//             { status: 500 }
//         );
//     }
// }
// export async function POST(request: NextRequest) {
//   try {
//     // 1. Vérifier que l'utilisateur est connecté
//     const session = await getServerSession();
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     } 

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

//     if (!vendorId) {
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
 
// API GET pour récupérer tous les produits
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











import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { authOptions } from "../auth/[...nextauth]/route";
 
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
 
// API GET pour récupérer tous les produits
export async function GET() {
  try {
    console.log("🔄 Connexion à MongoDB...");
    
    await connectDB();

    console.log("✅ Connecté à MongoDB");

    // Récupérer tous les produits actifs
    const products = await Product.find({ isActive: true })
      .populate("vendorId", "name email") // Récupérer aussi les infos du vendeur
      .sort({ createdAt: -1 }); // Trier par date de création (plus récent en premier)

    console.log(`✅ ${products.length} produits trouvés`);

    return NextResponse.json({ products }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur dans la recherche des produits:", error);
    
    if (error instanceof Error && 
        (error.message.includes("ETIMEOUT") || error.message.includes("queryTxt"))) {
      return NextResponse.json(
        { 
          message: "Impossible de se connecter à la base de données",
          details: "Timeout de connexion"
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}