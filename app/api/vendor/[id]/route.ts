import { Vendor } from "@/lib/models";
import { Product } from "@/lib/models";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

// GET - Récupérer un vendeur par ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const vendor = await Vendor.findById(id);
        
        if (!vendor) {
            return NextResponse.json(
                { status: 404, message: "Vendeur non trouvé" },
                { status: 404 }
            );
        }
        
        // Récupérer aussi les produits du vendeur
        const products = await Product.find({ vendorId: id });
        
        return NextResponse.json({
            status: 200,
            vendeur: vendor,
            produits: products,
            nombreProduits: products.length
        });
    } catch (error) {
        console.error("❌ Error fetching vendor:", error);
        return NextResponse.json(
            { status: 500, message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour un vendeur
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        const body = await req.json();
        
        const updatedVendor = await Vendor.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );
        
        if (!updatedVendor) {
            return NextResponse.json(
                { status: 404, message: "Vendeur non trouvé" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            status: 200,
            message: "Vendeur mis à jour avec succès",
            vendeur: updatedVendor
        });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("❌ Error updating vendor:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            
            return NextResponse.json(
                {
                    status: 400,
                    message: "Erreur de validation",
                    errors: errors
                },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { status: 500, message: "Something went wrong" },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un vendeur (soft delete)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Soft delete - désactiver le vendeur au lieu de le supprimer
        const vendor = await Vendor.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );
        
        if (!vendor) {
            return NextResponse.json(
                { status: 404, message: "Vendeur non trouvé" },
                { status: 404 }
            );
        }
        
        // Désactiver aussi tous ses produits
        await Product.updateMany(
            { vendorId: id },
            { isActive: false }
        );
        
        return NextResponse.json({
            status: 200,
            message: "Vendeur désactivé avec succès"
        });
    } catch (error) {
        console.error("❌ Error deleting vendor:", error);
        return NextResponse.json(
            { status: 500, message: "Something went wrong" },
            { status: 500 }
        );
    }
}