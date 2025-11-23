// import { Product } from "@/lib/models/models_product";
// import connectDB from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();

//     // ✅ Await params avant de l'utiliser
//     const { id } = await params;

//     const product = await Product.findById(id)
//       .populate("vendorId", "name email phone businessType logo")
//       .lean();

//     if (!product) {
//       return NextResponse.json(
//         { error: "Produit non trouvé" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(product);
//   } catch (error) {
//     console.error("Erreur lors de la récupération du produit:", error);
//     return NextResponse.json(
//       { error: "Erreur serveur" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();

//     // ✅ Await params
//     const { id } = await params;
//     const body = await request.json();
    
//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       body,
//       { new: true, runValidators: true }
//     ).populate("vendorId", "name email phone businessType logo");

//     if (!updatedProduct) {
//       return NextResponse.json(
//         { error: "Produit non trouvé" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedProduct);
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du produit:", error);
//     return NextResponse.json(
//       { error: "Erreur serveur" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();

//     // ✅ Await params
//     const { id } = await params;

//     const deletedProduct = await Product.findByIdAndDelete(id);

//     if (!deletedProduct) {
//       return NextResponse.json(
//         { error: "Produit non trouvé" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ message: "Produit supprimé avec succès" });
//   } catch (error) {
//     console.error("Erreur lors de la suppression du produit:", error);
//     return NextResponse.json(
//       { error: "Erreur serveur" },
//       { status: 500 }
//     );
//   }
// }






// ✅ GET - Récupérer un produit spécifique
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
    
//     const product = await Product.findById(params.id);
    
//     if (!product) {
//       return NextResponse.json(
//         { message: "Produit introuvable" },
//         { status: 404 }
//       );
//     }

//     // Transformer pour le frontend
//     const transformedProduct = {
//       id: product._id.toString(),
//       _id: product._id.toString(),
//       name: product.name,
//       desc: product.desc,
//       price: product.price,
//       priceNumber: product.priceNumber,
//       img: product.img,
//       category: product.category,
//       vendorId: product.vendorId.toString(),
//       details: product.details,
//       origin: product.origin,
//       freshness: product.freshness,
//       nutritionalInfo: product.nutritionalInfo || [],
//       stock: product.stock,
//       isActive: product.isActive,
//       createdAt: product.createdAt?.toISOString(),
//       updatedAt: product.updatedAt?.toISOString(),
//     };

//     return NextResponse.json({ product: transformedProduct }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Erreur récupération produit:", error);
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération du produit" },
//       { status: 500 }
//     );
//   }
// }


// ✅ GET - Récupérer un produit spécifique avec toutes les infos

// export async function GET(
//   request: NextRequest,
//  { params }: { params: { id: string } }
// ) {
//   try {
//     console.log("🔍 Récupération produit...");
    
//     await connectDB();
    
//     const { id } = await params;
//     console.log("📦 ID produit:", id);
    
//     // ✅ Récupérer le produit AVEC populate pour avoir les infos du vendeur
//     const product = await Product.findById(id)
//       .populate('vendorId', 'name email phone businessType logo')
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       .lean() as any;
    
//     if (!product) {
//       console.log("❌ Produit introuvable");
//       return NextResponse.json(
//         { message: "Produit introuvable" },
//         { status: 404 }
//       );
//     }

//     console.log("✅ Produit trouvé:", product.name);

//     // ✅ Transformer pour le frontend (format compatible avec ta page)
//     const transformedProduct = {
//       _id: product._id.toString(),
//       id: product._id.toString(),
//       name: product.name,
//       desc: product.desc || '',
//       description: product.desc || '', // Alias pour compatibilité
//       price: product.priceNumber, // ⚠️ Format nombre pour ta page
//       priceNumber: product.priceNumber,
//       priceString: product.price, // Version string
//       img: product.img,
//       category: product.category,
//       stock: product.stock,
//       unit: product.unit || 'unité',
//       // ✅ Vendeur : soit l'objet complet si populate, soit juste l'ID
//       vendorId: product.vendorId 
//         ? typeof product.vendorId === 'object'
//           ? {
//               _id: product.vendorId._id.toString(),
//               name: product.vendorId.name,
//               email: product.vendorId.email,
//               phone: product.vendorId.phone,
//               businessType: product.vendorId.businessType,
//               logo: product.vendorId.logo || ''
//             }
//           : { _id: product.vendorId.toString() }
//         : null,
//       details: product.details,
//       origin: product.origin,
//       freshness: product.freshness,
//       nutritionalInfo: product.nutritionalInfo || [],
//       isActive: product.isActive,
//       createdAt: product.createdAt?.toISOString?.() || product.createdAt,
//       updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
//     };

//     console.log("📤 Produit transformé:", {
//       id: transformedProduct.id,
//       name: transformedProduct.name,
//       price: transformedProduct.price,
//       vendorId: transformedProduct.vendorId
//     });

//     return NextResponse.json(transformedProduct, { status: 200 });
//   } catch (error) {
//     console.error("❌ Erreur récupération produit:", error);
//     return NextResponse.json(
//       { 
//         message: "Erreur lors de la récupération du produit",
//         error: error instanceof Error ? error.message : 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }










// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";
import { authOptions } from "../../auth/[...nextauth]/route";

 
// ✅ GET - Récupérer un produit spécifique avec toutes les infos
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 Récupération produit...");
    
    await connectDB();
    
    // ✅ Await params pour Next.js 15
    const { id } = await context.params;
    console.log("📦 ID produit:", id);
    
    // ✅ Récupérer le produit AVEC populate pour avoir les infos du vendeur
    const product = await Product.findById(id)
      .populate('vendorId', 'name email phone businessType logo')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .lean() as any;
    
    if (!product) {
      console.log("❌ Produit introuvable");
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    // product could be returned as an array in some typings; normalize to object
    const productObj = Array.isArray(product) ? product[0] : product;

    console.log("✅ Produit trouvé:", productObj?.name);

    // ✅ Transformer pour le frontend (format compatible avec ta page)
    const transformedProduct = {
      _id: productObj._id.toString(),
      id: productObj._id.toString(),
      name: productObj.name,
      desc: productObj.desc || '',
      description: productObj.desc || '', // Alias pour compatibilité
      price: productObj.priceNumber, // ⚠️ Format nombre pour ta page
      priceNumber: productObj.priceNumber,
      priceString: productObj.price, // Version string
      img: productObj.img,
      category: productObj.category,
      stock: productObj.stock,
      unit: productObj.unit || 'unité',
      // ✅ Vendeur : soit l'objet complet si populate, soit juste l'ID
      vendorId: productObj.vendorId 
        ? typeof productObj.vendorId === 'object'
          ? {
              _id: productObj.vendorId._id.toString(),
              name: productObj.vendorId.name,
              email: productObj.vendorId.email,
              phone: productObj.vendorId.phone,
              businessType: productObj.vendorId.businessType,
              logo: productObj.vendorId.logo || ''
            }
          : { _id: productObj.vendorId.toString() }
        : null,
      details: productObj.details,
      origin: productObj.origin,
      freshness: productObj.freshness,
      nutritionalInfo: productObj.nutritionalInfo || [],
      isActive: productObj.isActive,
      createdAt: productObj.createdAt?.toISOString?.() || productObj.createdAt,
      updatedAt: productObj.updatedAt?.toISOString?.() || productObj.updatedAt,
    };

    console.log("📤 Produit transformé:", {
      id: transformedProduct.id,
      name: transformedProduct.name,
      price: transformedProduct.price,
      vendorId: transformedProduct.vendorId
    });

    return NextResponse.json(transformedProduct, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur récupération produit:", error);
    return NextResponse.json(
      { 
        message: "Erreur lors de la récupération du produit",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
// // ✅ PUT - Modifier un produit (seulement par le vendeur propriétaire)
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     console.log("🔍 Vérification de la session...");
    
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     }

//     const vendorId = session.user.id;
//     console.log("👤 Vendeur connecté:", vendorId);

//     await connectDB();

//     // Vérifier que le produit existe et appartient au vendeur
//     const product = await Product.findById(params.id);

//     if (!product) {
//       return NextResponse.json(
//         { message: "Produit introuvable" },
//         { status: 404 }
//       );
//     }

//     // ✅ SÉCURITÉ : Vérifier que le vendeur est bien le propriétaire
//     if (product.vendorId.toString() !== vendorId) {
//       console.log("❌ Tentative de modification non autorisée");
//       console.log("   Vendeur du produit:", product.vendorId.toString());
//       console.log("   Vendeur connecté:", vendorId);
      
//       return NextResponse.json(
//         { message: "Non autorisé. Vous ne pouvez modifier que vos propres produits." },
//         { status: 403 }
//       );
//     }

//     // Récupérer les données de mise à jour
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
//       stock,
//       isActive
//     } = body;

//     console.log("📝 Mise à jour du produit:", params.id);

//     // Validation
//     if (name !== undefined && !name) {
//       return NextResponse.json(
//         { message: "Le nom du produit est requis" },
//         { status: 400 }
//       );
//     }

//     if (priceNumber !== undefined && (typeof priceNumber !== "number" || priceNumber < 0)) {
//       return NextResponse.json(
//         { message: "Le prix doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
//       return NextResponse.json(
//         { message: "Le stock doit être un nombre positif" },
//         { status: 400 }
//       );
//     }

//     // Construire l'objet de mise à jour (seulement les champs fournis)
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const updateData: any = {};
//     if (name !== undefined) updateData.name = name;
//     if (desc !== undefined) updateData.desc = desc;
//     if (price !== undefined) updateData.price = price;
//     if (priceNumber !== undefined) updateData.priceNumber = priceNumber;
//     if (img !== undefined) updateData.img = img;
//     if (category !== undefined) updateData.category = category;
//     if (details !== undefined) updateData.details = details;
//     if (origin !== undefined) updateData.origin = origin;
//     if (freshness !== undefined) updateData.freshness = freshness;
//     if (nutritionalInfo !== undefined) updateData.nutritionalInfo = nutritionalInfo;
//     if (stock !== undefined) updateData.stock = stock;
//     if (isActive !== undefined) updateData.isActive = isActive;

//     // Mettre à jour
//     const updatedProduct = await Product.findByIdAndUpdate(
//       params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     console.log("✅ Produit mis à jour avec succès");

//     return NextResponse.json(
//       {
//         message: "Produit mis à jour avec succès",
//         product: {
//           id: updatedProduct._id.toString(),
//           name: updatedProduct.name,
//           price: updatedProduct.price,
//           stock: updatedProduct.stock,
//           isActive: updatedProduct.isActive,
//         }
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Erreur mise à jour produit:", error);
    
//     if (error instanceof Error && error.message.includes("validation failed")) {
//       return NextResponse.json(
//         { message: "Données invalides. Vérifiez tous les champs." },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: "Erreur lors de la mise à jour du produit" },
//       { status: 500 }
//     );
//   }
// }





// ✅ PUT - CORRECTION ICI
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ Changé
) {
  try {
    console.log("🔍 Vérification de la session...");
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Non autorisé. Vous devez être connecté." },
        { status: 401 }
      );
    }

    const vendorId = session.user.id;
    console.log("👤 Vendeur connecté:", vendorId);

    await connectDB();

    const { id } = await context.params;  // ✅ Changé

    // Vérifier que le produit existe et appartient au vendeur
    const product = await Product.findById(id);  // ✅ Changé

    if (!product) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    // ✅ SÉCURITÉ : Vérifier que le vendeur est bien le propriétaire
    if (product.vendorId.toString() !== vendorId) {
      console.log("❌ Tentative de modification non autorisée");
      console.log("   Vendeur du produit:", product.vendorId.toString());
      console.log("   Vendeur connecté:", vendorId);
      
      return NextResponse.json(
        { message: "Non autorisé. Vous ne pouvez modifier que vos propres produits." },
        { status: 403 }
      );
    }

    // Récupérer les données de mise à jour
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
      stock,
      isActive
    } = body;

    console.log("📝 Mise à jour du produit:", id);  // ✅ Changé

    // Validation
    if (name !== undefined && !name) {
      return NextResponse.json(
        { message: "Le nom du produit est requis" },
        { status: 400 }
      );
    }

    if (priceNumber !== undefined && (typeof priceNumber !== "number" || priceNumber < 0)) {
      return NextResponse.json(
        { message: "Le prix doit être un nombre positif" },
        { status: 400 }
      );
    }

    if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
      return NextResponse.json(
        { message: "Le stock doit être un nombre positif" },
        { status: 400 }
      );
    }

    // Construire l'objet de mise à jour
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (desc !== undefined) updateData.desc = desc;
    if (price !== undefined) updateData.price = price;
    if (priceNumber !== undefined) updateData.priceNumber = priceNumber;
    if (img !== undefined) updateData.img = img;
    if (category !== undefined) updateData.category = category;
    if (details !== undefined) updateData.details = details;
    if (origin !== undefined) updateData.origin = origin;
    if (freshness !== undefined) updateData.freshness = freshness;
    if (nutritionalInfo !== undefined) updateData.nutritionalInfo = nutritionalInfo;
    if (stock !== undefined) updateData.stock = stock;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Mettre à jour
    const updatedProduct = await Product.findByIdAndUpdate(
      id,  // ✅ Changé
      updateData,
      { new: true, runValidators: true }
    );

    console.log("✅ Produit mis à jour avec succès");

    return NextResponse.json(
      {
        message: "Produit mis à jour avec succès",
        product: {
          id: updatedProduct._id.toString(),
          name: updatedProduct.name,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          isActive: updatedProduct.isActive,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Erreur mise à jour produit:", error);
    
    if (error instanceof Error && error.message.includes("validation failed")) {
      return NextResponse.json(
        { message: "Données invalides. Vérifiez tous les champs." },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du produit" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - CORRECTION ICI
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // ✅ Changé
) {
  try {
    console.log("🔍 Vérification de la session pour suppression...");
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Non autorisé. Vous devez être connecté." },
        { status: 401 }
      );
    }

    const vendorId = session.user.id;
    console.log("👤 Vendeur connecté:", vendorId);

    await connectDB();

    const { id } = await context.params;  // ✅ Changé

    // Vérifier que le produit existe
    const product = await Product.findById(id);  // ✅ Changé

    if (!product) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 }
      );
    }

    // ✅ SÉCURITÉ : Vérifier que le vendeur est bien le propriétaire
    if (product.vendorId.toString() !== vendorId) {
      console.log("❌ Tentative de suppression non autorisée");
      console.log("   Vendeur du produit:", product.vendorId.toString());
      console.log("   Vendeur connecté:", vendorId);
      
      return NextResponse.json(
        { message: "Non autorisé. Vous ne pouvez supprimer que vos propres produits." },
        { status: 403 }
      );
    }

    console.log("🗑️ Suppression du produit:", id);  // ✅ Changé

    // Supprimer le produit
    await Product.findByIdAndDelete(id);  // ✅ Changé

    console.log("✅ Produit supprimé avec succès");

    return NextResponse.json(
      {
        message: "Produit supprimé avec succès",
        productId: id  // ✅ Changé
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Erreur suppression produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}



// // ✅ DELETE - Supprimer un produit (seulement par le vendeur propriétaire)
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     console.log("🔍 Vérification de la session pour suppression...");
    
//     const session = await getServerSession(authOptions);
    
//     if (!session || !session.user) {
//       return NextResponse.json(
//         { message: "Non autorisé. Vous devez être connecté." },
//         { status: 401 }
//       );
//     }

//     const vendorId = session.user.id;
//     console.log("👤 Vendeur connecté:", vendorId);

//     await connectDB();

//     // Vérifier que le produit existe
//     const product = await Product.findById(params.id);

//     if (!product) {
//       return NextResponse.json(
//         { message: "Produit introuvable" },
//         { status: 404 }
//       );
//     }

//     // ✅ SÉCURITÉ : Vérifier que le vendeur est bien le propriétaire
//     if (product.vendorId.toString() !== vendorId) {
//       console.log("❌ Tentative de suppression non autorisée");
//       console.log("   Vendeur du produit:", product.vendorId.toString());
//       console.log("   Vendeur connecté:", vendorId);
      
//       return NextResponse.json(
//         { message: "Non autorisé. Vous ne pouvez supprimer que vos propres produits." },
//         { status: 403 }
//       );
//     }

//     console.log("🗑️ Suppression du produit:", params.id);

//     // Supprimer le produit
//     await Product.findByIdAndDelete(params.id);

//     console.log("✅ Produit supprimé avec succès");

//     return NextResponse.json(
//       {
//         message: "Produit supprimé avec succès",
//         productId: params.id
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Erreur suppression produit:", error);
//     return NextResponse.json(
//       { message: "Erreur lors de la suppression du produit" },
//       { status: 500 }
//     );
//   }
// }