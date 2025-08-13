// 2. Créez le composant modal du panier: components/CartModal.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Minus, Plus, ShoppingCart, Phone, User, Home, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderForm {
  firstName: string;
  lastName: string;
  whatsapp: string;
  roomNumber: string;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    firstName: '',
    lastName: '',
    whatsapp: '',
    roomNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  // Remplacez par votre numéro WhatsApp (format international sans +)
  const BUSINESS_WHATSAPP = "2250556939672"; // Exemple: remplacez par votre vrai numéro

  if (!isOpen) return null;

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    // Validation basique
    if (!orderForm.firstName || !orderForm.lastName || !orderForm.whatsapp || !orderForm.roomNumber) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (!orderForm.whatsapp.match(/^[0-9+\-\s]+$/)) {
      alert("Veuillez entrer un numéro WhatsApp valide");
      return;
    }

    setIsSubmitting(true);

    // Préparer le message de commande
    const orderDetails = cartItems.map(item => 
      `• ${item.product.name} (${item.quantity}x) - $${(item.product.priceNumber * item.quantity).toFixed(2)}`
    ).join('\n');

    const totalPrice = getTotalPrice().toFixed(2);

    const message = `🛒 *NOUVELLE COMMANDE - Bélidjo*

👤 *Client:* ${orderForm.firstName} ${orderForm.lastName}
📱 *WhatsApp:* ${orderForm.whatsapp}
🏠 *Chambre:* ${orderForm.roomNumber}

📦 *Commande:*
${orderDetails}

💰 *Total:* $${totalPrice}

⏰ *Heure de commande:* ${new Date().toLocaleString('fr-FR')}

---
Commande à livrer en moins de 15 min 🚀`;

    // Ouvrir WhatsApp avec le message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Simuler un délai pour l'effet de chargement
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSent(true);
      
      // Vider le panier
      clearCart();
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        setOrderSent(false);
        setShowOrderForm(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  // Message de confirmation
  if (orderSent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Commande envoyée !</h2>
              <p className="text-green-700 leading-relaxed">
                Nous avons reçu votre commande, le colis vous sera livré dans moins de 15 min.
              </p>
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-600 font-medium">
                  💬 Un message a été envoyé via WhatsApp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Mon Panier</span>
            {cartItems.length > 0 && (
              <Badge className="bg-orange-500">{cartItems.length}</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {!showOrderForm ? (
            <div className="max-h-[60vh] overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.product.img}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.desc}</p>
                        <p className="font-bold text-orange-500">${item.product.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-orange-500">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Prénom</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={orderForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={orderForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="whatsapp" className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>Numéro WhatsApp</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={orderForm.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="roomNumber" className="flex items-center space-x-1">
                    <Home className="h-4 w-4" />
                    <span>Numéro de chambre</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={orderForm.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    placeholder="Ex: A-205, Bât B-104..."
                  />
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Récapitulatif de commande:</h4>
                  <div className="text-sm space-y-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>${(item.product.priceNumber * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t p-4 bg-gray-50">
            {!showOrderForm ? (
              cartItems.length > 0 && (
                <Button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Passer la commande
                </Button>
              )
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1"
                >
                  Retour au panier
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? "Envoi en cours..." : "Confirmer la commande"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
