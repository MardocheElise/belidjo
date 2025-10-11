// import { Vendor } from "@/lib/models";
// import connectDB from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();
//     const fetchvendors = await Vendor.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({
//       status: 200,
//       vendeurs: fetchvendors,
//       count: fetchvendors.length
//     });
//   } catch (error) {
//     console.error("❌ Erreur dans la recherche des vendeurs:", error);
//     return NextResponse.json(
//       { status: 500, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     // Récupérer les données du body
//     const body = await req.json();
//     const {
//       name,
//       email,
//       password,
//       phone,
//       logo,
//     } = body;

//     // Validation des champs obligatoires
//     if (!name || !email || !phone || !password) {
//       return NextResponse.json(
//         {
//           status: 400,
//           message: "Champs requis manquants: name, email, phone, businessName, businessType"
//         },
//         { status: 400 }
//       );
//     }

//     // // Validation de l'adresse
//     // if (!address || !address.street || !address.city) {
//     //   return NextResponse.json(
//     //     {
//     //       status: 400,
//     //       message: "Adresse complète requise (street, city)"
//     //     },
//     //     { status: 400 }
//     //   );
//     // }

//     // Validation format email
//     const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { status: 400, message: "Format d'email invalide" },
//         { status: 400 }
//       );
//     }

//     // Vérifier si l'email existe déjà
//     const existingVendor = await Vendor.findOne({ email: email.toLowerCase() });
//     if (existingVendor) {
//       return NextResponse.json(
//         {
//           status: 409,
//           message: "Un vendeur avec cet email existe déjà"
//         },
//         { status: 409 }
//       );
//     }

//     // Créer le nouveau vendeur
//     const newVendor = new Vendor({
//       name,
//       email: email.toLowerCase(),
//       phone,
//       logo: logo || "",
      
//     });

//     // Sauvegarder dans la base de données
//     await newVendor.save();

//     console.log("✅ Vendeur créé avec succès:", newVendor.email);

//     return NextResponse.json(
//       {
//         status: 201,
//         message: "Vendeur ajouté avec succès",
//         vendeur: newVendor
//       },
//       { status: 201 }
//     );

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("❌ Erreur lors de la création du vendeur:", error);

//     // Gestion des erreurs de validation Mongoose
//     if (error.name === "ValidationError") {
//       const errors = Object.keys(error.errors).map((key) => ({
//         field: key,
//         message: error.errors[key].message
//       }));

//       return NextResponse.json(
//         {
//           status: 400,
//           message: "Erreur de validation",
//           errors: errors
//         },
//         { status: 400 }
//       );
//     }

//     // Gestion des erreurs de duplication (index unique)
//     if (error.code === 11000) {
//       const field = Object.keys(error.keyPattern)[0];
//       return NextResponse.json(
//         {
//           status: 409,
//           message: `Un vendeur avec ce ${field} existe déjà`
//         },
//         { status: 409 }
//       );
//     }

//     return NextResponse.json(
//       { status: 500, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { Vendor } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const fetchvendors = await Vendor.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      status: 200,
      vendeurs: fetchvendors,
      count: fetchvendors.length
    });
  } catch (error) {
    console.error("❌ Erreur dans la recherche des vendeurs:", error);
    return NextResponse.json(
      { status: 500, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Début de l'inscription");

    // 1️⃣ Récupérer les données du formulaire
    const body = await request.json();
    const { name, email, phone, password } = body;

    // 2️⃣ Validation des champs requis
    if (!name || !email || !phone || !password) {
      console.log("❌ Champs manquants");
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // 3️⃣ Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Email invalide:", email);
      return NextResponse.json(
        { message: "Email invalide" },
        { status: 400 }
      );
    }

    // 4️⃣ Validation du mot de passe
    if (password.length < 6) {
      console.log("❌ Mot de passe trop court");
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    // 5️⃣ Se connecter à MongoDB avec Mongoose
    console.log("🔄 Connexion à MongoDB...");
    await connectDB();
    console.log("✅ Connecté à MongoDB");

    // 6️⃣ Vérifier si le nom existe déjà
    const existingVendorByName = await Vendor.findOne({ name });
    if (existingVendorByName) {
      console.log("❌ Nom déjà utilisé:", name);
      return NextResponse.json(
        { message: "Ce nom est déjà utilisé" },
        { status: 409 }
      );
    }

    // 7️⃣ Vérifier si l'email existe déjà
    const existingVendorByEmail = await Vendor.findOne({ email });
    if (existingVendorByEmail) {
      console.log("❌ Email déjà utilisé:", email);
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // 8️⃣ Hasher le mot de passe
    console.log("🔐 Hachage du mot de passe...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ Mot de passe haché");

    // 9️⃣ Créer le nouveau vendeur avec Mongoose
    console.log("💾 Création du vendeur...");
    const newVendor = await Vendor.create({
      name,
      email,
      phone,
      password: hashedPassword, // ✅ Ajouter le mot de passe au schéma Vendor
      businessType: "Agriculteur" // Valeur par défaut
    });

    console.log("✅ Vendeur créé avec succès");
    console.log("📋 ID du vendeur:", newVendor._id.toString());

    // 🔟 Retourner une réponse de succès
    return NextResponse.json(
      {
        message: "Inscription réussie",
        vendorId: newVendor._id.toString(),
        vendor: {
          id: newVendor._id.toString(),
          name: newVendor.name,
          email: newVendor.email,
          phone: newVendor.phone,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);
    
    if (error instanceof Error) {
      // Erreur de validation Mongoose
      if (error.message.includes("validation failed")) {
        return NextResponse.json(
          { message: "Données invalides. Vérifiez tous les champs." },
          { status: 400 }
        );
      }
      
      // Erreur de clé unique
      if (error.message.includes("E11000")) {
        return NextResponse.json(
          { message: "Cet email ou ce nom est déjà utilisé" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}