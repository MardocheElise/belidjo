"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import CartModal from "@/components/CartModal";

// Type pour le produit (ajustez selon votre structure)
interface Product {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  desc: string;
  details: string;
  img: string;
  category: string;
  origin: string;
  freshness: string;
  nutritionalInfo: string[];
  // Ajoutez d'autres propriétés si nécessaire
}

interface ProductPageClientProps {
  product: Product | null | undefined;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  
  const { addToCart, getTotalItems } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
          <p className="text-gray-600 mb-4">Le produit que vous recherchez existe pas.</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    setQuantity(prev => {
      if (action === 'increase') return prev + 1;
      if (action === 'decrease' && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optionnel: réinitialiser la quantité après ajout
    setQuantity(1);
  };

  const totalPrice = (product.priceNumber * quantity).toFixed(2);
  const cartItemsCount = getTotalItems();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header avec panier */}
      <header className="w-full bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Bélidjo.</h1>
          </div>
          
          {/* Icône panier avec compteur */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div> 
        </div>
      </header>

      {/* Reste du contenu identique... */}
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="flex justify-center">
            <Card className="p-8 bg-white">
              <div className="relative">
                <Image 
                  src={product.img} 
                  alt={product.name} 
                  width={400} 
                  height={400}
                  className="rounded-2xl object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
              </div>
            </Card>
          </div>

          {/* Détails du produit */}
          <div className="space-y-6">
            <div>
              <Badge className="bg-orange-100 text-orange-800 mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.desc}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-4xl font-bold text-orange-500 mb-4">{product.price}</p>
              <p className="text-gray-700 leading-relaxed">{product.details}</p>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Origine:</span>
                <span className="text-gray-600">{product.origin}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Fraîcheur:</span>
                <span className="text-green-600 font-medium">{product.freshness}</span>
              </div>
            </div>

            {/* Informations nutritionnelles */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Informations nutritionnelles:</h3>
              <div className="flex flex-wrap gap-2">
                {product.nutritionalInfo.map((info, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {info}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contrôles de quantité et commande */}
            <Card className="p-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Quantité:</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange('increase')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-orange-500">${totalPrice}</span>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ajouter au panier
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal du panier */}
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
}