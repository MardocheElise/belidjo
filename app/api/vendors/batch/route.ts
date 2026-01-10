// // app/api/vendors/batch/route.ts
// import { Vendor } from '@/lib/models/model_vendor';
// import connectDB from '@/lib/mongodb';
// import { NextRequest, NextResponse } from 'next/server';


// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const { vendorIds } = await req.json();
    
//     // Validation
//     if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
//       return NextResponse.json(
//         { error: 'vendorIds array is required and cannot be empty' },
//         { status: 400 }
//       );
//     }

//     // Récupérer tous les vendeurs correspondants
//     const vendors = await Vendor.find({
//       _id: { $in: vendorIds }
//     }).select('_id name phone email businessType');

//     // Vérifier qu'on a trouvé tous les vendeurs
//     if (vendors.length !== vendorIds.length) {
//       console.warn('⚠️ Certains vendeurs sont introuvables:', {
//         requested: vendorIds.length,
//         found: vendors.length
//       });
//     }

//     return NextResponse.json(vendors, { status: 200 });
//   } catch (error) {
//     console.error('❌ Error fetching vendors:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch vendors information' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Vendor } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { vendorIds } = await request.json();
    
    if (!vendorIds || !Array.isArray(vendorIds)) {
      return NextResponse.json(
        { error: "vendorIds must be an array" },
        { status: 400 }
      );
    }

    console.log("🔍 Recherche des vendeurs:", vendorIds);

    const vendors = await Vendor.find({
      _id: { $in: vendorIds }
    }).select("name email phone businessType logo");

    console.log(`✅ ${vendors.length} vendeurs trouvés`);

    return NextResponse.json(vendors);

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des vendeurs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}