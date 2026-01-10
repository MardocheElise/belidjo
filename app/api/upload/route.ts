// app/api/upload/route.ts
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json(
//         { message: "Aucun fichier fourni" },
//         { status: 400 }
//       );
//     }

//     // Valider le type de fichier
//     const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
//     if (!validTypes.includes(file.type)) {
//       return NextResponse.json(
//         { message: "Format d'image invalide" },
//         { status: 400 }
//       );
//     }

//     // Valider la taille (5MB max)
//     if (file.size > 5 * 1024 * 1024) {
//       return NextResponse.json(
//         { message: "L'image ne doit pas dépasser 5MB" },
//         { status: 400 }
//       );
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // Créer le dossier s'il n'existe pas
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     await mkdir(uploadDir, { recursive: true });

//     // Générer un nom unique pour l'image
//     const ext = path.extname(file.name);
//     const fileName = `${uuidv4()}${ext}`;
//     const filePath = path.join(uploadDir, fileName);

//     // Sauvegarder le fichier
//     await writeFile(filePath, buffer);

//     // Retourner l'URL accessible publiquement
//     const publicUrl = `/uploads/${fileName}`;

//     return NextResponse.json(
//       { 
//         url: publicUrl,
//         message: "Image uploadée avec succès"
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Erreur d'upload:", error);
//     return NextResponse.json(
//       { message: "Erreur lors de l'upload de l'image" },
//       { status: 500 }
//     );
//   }
// }


// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Valider le type de fichier
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Format d'image invalide" },
        { status: 400 }
      );
    }

    // Valider la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "L'image ne doit pas dépasser 5MB" },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer une promesse pour l'upload Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products", // Dossier dans Cloudinary
            resource_type: "auto",
            transformation: [
              { width: 1000, height: 1000, crop: "limit" }, // Optimisation automatique
              { quality: "auto" },
              { fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = uploadResult as any;

    // Retourner l'URL Cloudinary
    return NextResponse.json(
      {
        url: result.secure_url,
        publicId: result.public_id,
        message: "Image uploadée avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur d'upload:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}