"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Store,
  Phone,
  Mail,
  Package,
  Leaf,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import CartModal from "@/components/CartModal";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  img: string;
  stock: number;
  unit: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    businessType: string;
    logo: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTotalItems } = useCart();
  const { addToCart } = useCart();
  // const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const cartItemsCount = getTotalItems();
  const [showCartModal, setShowCartModal] = useState(false);
  useEffect(() => {
   const fetchProduct = async () => {
  try {
    const response = await fetch(`/api/product/${params.id}`);
    if (!response.ok) throw new Error("Produit non trouvé");
    const data = await response.json();
    
    // S'assurer que le produit a un vendorId
    if (!data.vendorId) {
      console.error("❌ Produit sans vendorId:", data);
      throw new Error("Produit invalide: vendorId manquant");
    }
    
    setProduct(data);
  } catch (error) {
    console.error("Erreur:", error);
    // toast...
  } finally {
    setLoading(false);
  }
};

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);
 const handleAddToCart = () => {
  if (product) {
    // VALIDER que le produit a toutes les données nécessaires
    if (!product._id || !product.vendorId) {
      console.error("❌ Produit invalide pour le panier:", product);
      alert("Erreur: Ce produit ne peut pas être ajouté au panier");
      return;
    }

    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price.toString(),
        priceNumber: product.price,
        img: product.img,
        desc: product.description || product.description,
        category: product.category,
        stock: product.stock,
        vendorId: product.vendorId._id,
        unit: product.unit || "unité"
      },
      quantity
    );

    // toast...
  }
};

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Produit non trouvé
        </h2>
        <Button onClick={() => router.push("/")} className="bg-orange-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/product"
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            <Link href="/">Bélidjo.</Link>
          </h1>
          {/* Bouton panier  */}
          <Button
            variant="outline"
            onClick={() => setShowCartModal(true)}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Panier
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={product.img || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Category Badge */}
            <div className="mt-4">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                <Leaf className="mr-1 h-3 w-3" />
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-orange-500">
                    {product.price} FCFA
                  </span>
                  <span className="text-gray-500">/ {product.unit}</span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package className="h-5 w-5 text-orange-500" />
                    <span>
                      <strong>Stock disponible:</strong> {product.stock}{" "}
                      {product.unit}
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <label className="font-semibold text-gray-800">
                    Quantité
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 font-semibold text-lg">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-gray-600">{product.unit}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {product.stock > 0
                    ? `Ajouter au panier  ${(
                        product.price * quantity
                      ).toLocaleString()} FCFA`
                    : "Rupture de stock"}
                </Button>
              </CardContent>
            </Card>

            {/* Vendor Info */}
            {product.vendorId && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                      {product.vendorId.logo ? (
                        <Image
                          src={product.vendorId.logo}
                          alt={product.vendorId.name}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <Store className="h-8 w-8 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {product.vendorId.name}
                      </h3>
                      <Badge variant="outline" className="mb-3">
                        {product.vendorId.businessType}
                      </Badge>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-orange-500" />
                          <span>{product.vendorId.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-orange-500" />
                          <span>{product.vendorId.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      {/* Modal du panier existant */}
          <CartModal
            isOpen={showCartModal}
            onClose={() => setShowCartModal(false)}
          />
    </div>
  );

}

// function useToast() {
//   return {
//     toast: ({
//       title,
//       description,
//       variant = "default",
//     }: {
//       title: string;
//       description?: string;
//       variant?: "default" | "destructive";
//     }) => {
//       // Simple fallback: alert for destructive, console for others
//       if (variant === "destructive") {
//         alert(`${title}\n${description ?? ""}`);
//       } else {
//         console.log(`${title}: ${description ?? ""}`);
//       }
//     },
//   };
// }
