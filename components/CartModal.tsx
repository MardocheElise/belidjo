// "use client";

// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { X, Minus, Plus, ShoppingCart, Phone, User, Home, MessageCircle } from "lucide-react";
// import Image from "next/image";
// import { useCart } from "@/lib/CartContext";

// interface CartModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// interface OrderForm {
//   firstName: string;
//   lastName: string;
//   whatsapp: string;
//   roomNumber: string;
//   citeUniversitaire:string
//   reservation: string
// }

// export default function CartModal({ isOpen, onClose }: CartModalProps) {
//   const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [orderForm, setOrderForm] = useState<OrderForm>({
//     firstName: '',
//     lastName: '',
//     whatsapp: '',
//     roomNumber: '',
//     citeUniversitaire:'',
//     reservation: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderSent, setOrderSent] = useState(false);

//   const BUSINESS_WHATSAPP = "2250556939672";

//   if (!isOpen) return null;

//   const handleInputChange = (field: keyof OrderForm, value: string) => {
//     setOrderForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmitOrder = async () => {
//     // Validation basique
//     if (!orderForm.firstName || !orderForm.lastName || !orderForm.whatsapp || !orderForm.roomNumber || !orderForm.citeUniversitaire ) {
//       alert("Veuillez remplir tous les champs");
//       return;
//     }

//     if (!orderForm.whatsapp.match(/^[0-9+\-\s]+$/)) {
//       alert("Veuillez entrer un numéro WhatsApp valide");
//       return;
//     }

//     setIsSubmitting(true);

//     // Préparer le message de commande
//     const orderDetails = cartItems.map(item =>
//       `• ${item.product.name} (${item.quantity}x) - $${(item.product.priceNumber * item.quantity).toFixed(2)}`
//     ).join('\n');

//     const totalPrice = getTotalPrice().toFixed(2);

//     const message = `NOUVELLE COMMANDE - Bélidjo

// 👤 Client: ${orderForm.firstName} ${orderForm.lastName}
// 📱 WhatsApp: ${orderForm.whatsapp}
// 🏠 Cité Universitaire: ${orderForm.citeUniversitaire}
// 🏠 Chambre: ${orderForm.roomNumber}

// 📦 Commande:
// ${orderDetails}

// 💰 Total: $${totalPrice}

// ⏰ Heure de commande: ${new Date().toLocaleString('fr-FR')}`;

//     // Ouvrir WhatsApp avec le message
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`;

//     // Ouvrir WhatsApp
//     window.open(whatsappUrl, '_blank');

//     // Simuler un délai pour l'effet de chargement
//     setTimeout(() => {
//       setIsSubmitting(false);
//       setOrderSent(true);

//       // Vider le panier
//       clearCart();

//       // Fermer le modal après 3 secondes
//       setTimeout(() => {
//         setOrderSent(false);
//         setShowOrderForm(false);
//         onClose();
//       }, 3000);
//     }, 1500);
//   };

//   // Message de confirmation
//   if (orderSent) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <Card className="w-full max-w-md bg-green-50 border-green-200">
//           <CardContent className="p-8 text-center">
//             <div className="mb-4">
//               <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//                 <MessageCircle className="h-8 w-8 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-green-800 mb-2">Commande envoyée !</h2>
//               <p className="text-green-700 leading-relaxed">
//                 Nous avons reçu votre commande, le colis vous sera livré dans moins de 15 min.
//               </p>
//               <div className="mt-4 p-4 bg-green-100 rounded-lg">
//                 <p className="text-sm text-green-600 font-medium">
//                   💬 Un message a été envoyé via WhatsApp
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
//         <CardHeader className="flex flex-row items-center justify-between border-b">
//           <CardTitle className="flex items-center space-x-2">
//             <ShoppingCart className="h-5 w-5" />
//             <span>Mon Panier</span>
//             {cartItems.length > 0 && (
//               <Badge className="bg-orange-500">{cartItems.length}</Badge>
//             )}
//           </CardTitle>
//           <Button variant="ghost" size="sm" onClick={onClose}>
//             <X className="h-4 w-4" />
//           </Button>
//         </CardHeader>

//         <CardContent className="p-0">
//           {!showOrderForm ? (
//             <div className="max-h-[60vh] overflow-y-auto">
//               {cartItems.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                   <p className="text-gray-500">Votre panier est vide</p>
//                 </div>
//               ) : (
//                 <div className="p-4 space-y-4">
//                   {cartItems.map((item) => (
//                     <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
//                       <Image
//                         src={item.product.img}
//                         alt={item.product.name}
//                         width={60}
//                         height={60}
//                         className="rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-semibold">{item.product.name}</h3>
//                         <p className="text-sm text-gray-500">{item.product.desc}</p>
//                         <p className="font-bold text-orange-500">${item.product.price}</p>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
//                         >
//                           <Minus className="h-3 w-3" />
//                         </Button>
//                         <span className="w-8 text-center font-semibold">{item.quantity}</span>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
//                         >
//                           <Plus className="h-3 w-3" />
//                         </Button>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeFromCart(item.product.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}

//                   <div className="border-t pt-4 mt-4">
//                     <div className="flex justify-between items-center text-xl font-bold">
//                       <span>Total:</span>
//                       <span className="text-orange-500">${getTotalPrice().toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="p-6 max-h-[60vh] overflow-y-auto">
//               <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="firstName" className="flex items-center space-x-1">
//                       <User className="h-4 w-4" />
//                       <span>Prénom</span>
//                     </Label>
//                     <Input
//                       id="firstName"
//                       value={orderForm.firstName}
//                       onChange={(e) => handleInputChange('firstName', e.target.value)}
//                       placeholder="Votre prénom"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="lastName">Nom</Label>
//                     <Input
//                       id="lastName"
//                       value={orderForm.lastName}
//                       onChange={(e) => handleInputChange('lastName', e.target.value)}
//                       placeholder="Votre nom"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="whatsapp" className="flex items-center space-x-1">
//                     <Phone className="h-4 w-4" />
//                     <span>Numéro WhatsApp</span>
//                   </Label>
//                   <Input
//                     id="whatsapp"
//                     value={orderForm.whatsapp}
//                     onChange={(e) => handleInputChange('whatsapp', e.target.value)}
//                     placeholder="+225 XX XX XX XX XX"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="roomNumber" className="flex items-center space-x-1">
//                     <Home className="h-4 w-4" />
//                     <span>Numéro de chambre</span>
//                   </Label>
//                   <Input
//                     id="roomNumber"
//                     value={orderForm.roomNumber}
//                     onChange={(e) => handleInputChange('roomNumber', e.target.value)}
//                     placeholder="Ex: A-205, Bât B-104..."
//                   />
//                 </div>
//                  <div>
//                   <Label htmlFor="citeUniversitaire" className="flex items-center space-x-1">
//                     <Home className="h-4 w-4" />
//                     <span>Nom de votre cité Universitaire</span>
//                   </Label>
//                   <Input
//                     id="citeUniversitaire"
//                     value={orderForm.citeUniversitaire}
//                     onChange={(e) => handleInputChange('citeUniversitaire', e.target.value)}
//                     placeholder="Ex: Abobo 1 ...."
//                   />
//                 </div>

//                 <div className="bg-orange-50 p-4 rounded-lg">
//                   <h4 className="font-semibold text-orange-800 mb-2">Récapitulatif de commande:</h4>
//                   <div className="text-sm space-y-1">
//                     {cartItems.map((item) => (
//                       <div key={item.product.id} className="flex justify-between">
//                         <span>{item.product.name} x{item.quantity}</span>
//                         <span>${(item.product.priceNumber * item.quantity).toFixed(2)}</span>
//                       </div>
//                     ))}
//                     <div className="border-t pt-2 mt-2 font-bold flex justify-between">
//                       <span>Total:</span>
//                       <span>${getTotalPrice().toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="border-t p-4 bg-gray-50">
//             {!showOrderForm ? (
//               cartItems.length > 0 && (
//                 <Button
//                   onClick={() => setShowOrderForm(true)}
//                   className="w-full bg-orange-500 hover:bg-orange-600"
//                 >
//                   Passer la commande
//                 </Button>
//               )
//             ) : (
//               <div className="flex space-x-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setShowOrderForm(false)}
//                   className="flex-1"
//                 >
//                   Retour au panier
//                 </Button>
//                 <Button
//                   onClick={handleSubmitOrder}
//                   disabled={isSubmitting}
//                   className="flex-1 bg-orange-500 hover:bg-orange-600"
//                 >
//                   {isSubmitting ? "Envoi en cours..." : "Confirmer la commande"}
//                 </Button>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
















"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Minus,
  Plus,
  ShoppingCart,
  Phone,
  User,
  Home,
  MessageCircle,
  AlertCircle,
  Store,
} from "lucide-react";
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
  citeUniversitaire: string;
  reservation: string;
}

interface VendorInfo {
  _id: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    firstName: "",
    lastName: "",
    whatsapp: "",
    roomNumber: "",
    citeUniversitaire: "",
    reservation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [vendorsInfo, setVendorsInfo] = useState<Record<string, VendorInfo>>(
    {}
  );
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [vendorError, setVendorError] = useState<string | null>(null);

  // ✅ Récupérer les informations des vendeurs quand le panier change
  useEffect(() => {
    const fetchVendorsInfo = async () => {
      if (cartItems.length === 0) {
        setVendorsInfo({});
        return;
      }

      setIsLoadingVendors(true);
      setVendorError(null);

      try {
        // Extraire les IDs uniques des vendeurs
        const vendorIds = [
          ...new Set(cartItems.map((item) => item.product.vendorId)),
        ];

        console.log("🔍 Récupération des vendeurs:", vendorIds);

        const response = await fetch("/api/vendors/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendorIds }),
        });

        if (!response.ok) {
          throw new Error("Échec de la récupération des vendeurs");
        }

        const vendors = await response.json();
        console.log("✅ Vendeurs récupérés:", vendors);

        // Créer un map pour un accès rapide
        const vendorsMap = vendors.reduce(
          (acc: Record<string, VendorInfo>, vendor: VendorInfo) => {
            acc[vendor._id] = vendor;
            return acc;
          },
          {}
        );

        setVendorsInfo(vendorsMap);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des vendeurs:", error);
        setVendorError("Impossible de récupérer les informations des vendeurs");
      } finally {
        setIsLoadingVendors(false);
      }
    };

    fetchVendorsInfo();
  }, [cartItems]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    // ✅ Validation basique
    if (
      !orderForm.firstName ||
      !orderForm.lastName ||
      !orderForm.whatsapp ||
      !orderForm.roomNumber ||
      !orderForm.citeUniversitaire
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!orderForm.whatsapp.match(/^[0-9+\-\s]+$/)) {
      alert("Veuillez entrer un numéro WhatsApp valide");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Grouper les articles par vendeur
      const itemsByVendor = cartItems.reduce((acc, item) => {
        const vendorId = item.product.vendorId.toString();

        if (!acc[vendorId]) {
          acc[vendorId] = {
            vendor: vendorsInfo[vendorId],
            items: [],
          };
        }
        acc[vendorId].items.push(item);
        return acc;
      }, {} as Record<string, { vendor: VendorInfo; items: typeof cartItems }>);

      // ✅ Vérifier que tous les vendeurs ont un numéro de téléphone
      const vendorsWithoutPhone = Object.entries(itemsByVendor).filter(
        ([_, data]) => !data.vendor || !data.vendor.phone
      );

      if (vendorsWithoutPhone.length > 0) {
        alert(
          `Erreur: ${vendorsWithoutPhone.length} vendeur(s) n'ont pas de numéro WhatsApp configuré. Contactez le support.`
        );
        setIsSubmitting(false);
        return;
      }

      // ✅ Envoyer un message WhatsApp pour chaque vendeur
      let messagesSent = 0;
      const vendorEntries = Object.entries(itemsByVendor);

      vendorEntries.forEach(([vendorId, vendorData], index) => {
        // Construction du message spécifique pour ce vendeur
        const orderDetails = vendorData.items
          .map(
            (item) =>
              `• ${item.product.name} (${item.quantity}x) - ${item.product.price}`
          )
          .join("\n");

        const vendorTotal = vendorData.items
          .reduce(
            (sum, item) => sum + item.product.priceNumber * item.quantity,
            0
          )
          .toFixed(2);

        const message = `🛒 NOUVELLE COMMANDE - Bélidjo

👋 Bonjour ${vendorData.vendor.name} !

👤 Client: ${orderForm.firstName} ${orderForm.lastName}
📱 WhatsApp Client: ${orderForm.whatsapp}
🏢 Cité Universitaire: ${orderForm.citeUniversitaire}
🏠 Chambre: ${orderForm.roomNumber}

📦 Produits commandés:
${orderDetails}

💰 Total pour vos produits: ${vendorTotal} FCFA

⏰ Commande passée le: ${new Date().toLocaleString("fr-FR", {
          dateStyle: "short",
          timeStyle: "short",
        })}

Merci de confirmer la disponibilité et le délai de livraison ! 🚀`;

        // Nettoyer le numéro de téléphone (retirer espaces, tirets, parenthèses)
        let cleanPhone = vendorData.vendor.phone.replace(/[\s\-()]/g, "");

        // S'assurer qu'il commence par le code pays
        if (cleanPhone.startsWith("0")) {
          cleanPhone = "225" + cleanPhone.substring(1);
        }
        if (!cleanPhone.startsWith("+")) {
          cleanPhone = "+" + cleanPhone;
        }

        console.log(
          `📱 Envoi WhatsApp au vendeur ${vendorData.vendor.name}: ${cleanPhone}`
        );

        // Ouvrir WhatsApp avec le message pour ce vendeur
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhone.replace(
          /\+/g,
          ""
        )}?text=${encodedMessage}`;

        // Ouvrir WhatsApp avec un délai entre chaque message pour éviter les conflits
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
          messagesSent++;

          console.log(
            `✅ Message ${messagesSent}/${vendorEntries.length} envoyé`
          );
        }, index * 800); // Délai de 800ms entre chaque message
      });

      // Simuler un délai pour l'effet de chargement
      setTimeout(() => {
        setIsSubmitting(false);
        setOrderSent(true);

        // Vider le panier
        clearCart();

        // Réinitialiser le formulaire
        setOrderForm({
          firstName: "",
          lastName: "",
          whatsapp: "",
          roomNumber: "",
          citeUniversitaire: "",
          reservation: "",
        });

        // Fermer le modal après 3 secondes
        setTimeout(() => {
          setOrderSent(false);
          setShowOrderForm(false);
          onClose();
        }, 3000);
      }, 1500);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la commande:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  // ✅ Grouper les produits par vendeur pour l'affichage
  const groupedByVendor = cartItems.reduce((acc, item) => {
    const vendorId = item.product.vendorId;
    if (!acc[vendorId]) {
      acc[vendorId] = [];
    }
    acc[vendorId].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  // ✅ Message de confirmation
  if (orderSent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Commande envoyée !
              </h2>
              <p className="text-green-700 leading-relaxed">
                Votre commande a été envoyée aux vendeurs concernés. Vous serez
                livré dans moins de 15 min.
              </p>
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-600 font-medium">
                  💬 Message(s) WhatsApp envoyé(s) avec succès
                </p>
                <p className="text-xs text-green-500 mt-2">
                  {Object.keys(groupedByVendor).length} vendeur(s) contacté(s)
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
                <div className="p-4 space-y-6">
                  {/* ✅ Afficher une alerte si erreur de chargement des vendeurs */}
                  {vendorError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800 font-medium">
                          {vendorError}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Certaines informations de vendeurs peuvent être
                          manquantes
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ✅ Grouper par vendeur */}
                  {Object.entries(groupedByVendor).map(([vendorId, items]) => {
                    const vendor = vendorsInfo[vendorId];
                    const vendorTotal = items.reduce(
                      (sum, item) =>
                        sum + item.product.priceNumber * item.quantity,
                      0
                    );

                    return (
                      <div
                        key={vendorId}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        {/* En-tête du vendeur */}
                        <div className="flex items-center space-x-2 mb-3 pb-3 border-b">
                          <Store className="h-4 w-4 text-orange-600" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {isLoadingVendors ? (
                                <span className="text-gray-400">
                                  Chargement...
                                </span>
                              ) : vendor ? (
                                vendor.name
                              ) : (
                                <span className="text-gray-400">
                                  Vendeur inconnu
                                </span>
                              )}
                            </h3>
                            {vendor?.businessType && (
                              <p className="text-xs text-gray-500">
                                {vendor.businessType}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-orange-600">
                            {items.length} article{items.length > 1 ? "s" : ""}
                          </Badge>
                        </div>

                        {/* Produits du vendeur */}
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex items-center space-x-4 p-3 bg-white rounded-lg border"
                            >
                              <Image
                                src={item.product.img}
                                alt={item.product.name}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.product.desc}
                                </p>
                                <p className="font-bold text-orange-500 text-sm mt-1">
                                  {item.product.price}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity - 1
                                    )
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-semibold text-sm">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuantity(
                                      item.product.id,
                                      item.quantity + 1
                                    )
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700 h-7 w-7 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Sous-total du vendeur */}
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            Sous-total:
                          </span>
                          <span className="font-bold text-orange-600">
                            {vendorTotal.toFixed(2)} FCFA
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Total global */}
                  <div className="border-t pt-4 mt-4 bg-orange-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total général</p>
                        <p className="text-xs text-gray-500">
                          {Object.keys(groupedByVendor).length} vendeur(s)
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">
                        {getTotalPrice().toFixed(2)} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                Informations de livraison
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>Prénom *</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={orderForm.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={orderForm.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="whatsapp"
                    className="flex items-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Numéro WhatsApp *</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={orderForm.whatsapp}
                    onChange={(e) =>
                      handleInputChange("whatsapp", e.target.value)
                    }
                    placeholder="+225 XX XX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="citeUniversitaire"
                    className="flex items-center space-x-1"
                  >
                    <Home className="h-4 w-4" />
                    <span>Cité Universitaire *</span>
                  </Label>
                  <Input
                    id="citeUniversitaire"
                    value={orderForm.citeUniversitaire}
                    onChange={(e) =>
                      handleInputChange("citeUniversitaire", e.target.value)
                    }
                    placeholder="Ex: Abobo 1, Yopougon..."
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="roomNumber"
                    className="flex items-center space-x-1"
                  >
                    <Home className="h-4 w-4" />
                    <span>Numéro de chambre *</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={orderForm.roomNumber}
                    onChange={(e) =>
                      handleInputChange("roomNumber", e.target.value)
                    }
                    placeholder="Ex: A-205, Bât B-104..."
                    required
                  />
                </div>

                {/* Récapitulatif par vendeur */}
                <div className="bg-orange-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Récapitulatif de commande:
                  </h4>

                  {Object.entries(groupedByVendor).map(([vendorId, items]) => {
                    const vendor = vendorsInfo[vendorId];
                    const vendorTotal = items.reduce(
                      (sum, item) =>
                        sum + item.product.priceNumber * item.quantity,
                      0
                    );

                    return (
                      <div
                        key={vendorId}
                        className="bg-white rounded p-3 border border-orange-200"
                      >
                        <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center">
                          <Store className="h-3 w-3 mr-1" />
                          {vendor?.name || "Vendeur inconnu"}
                        </p>
                        <div className="text-sm space-y-1">
                          {items.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-gray-700">
                                {item.product.name} x{item.quantity}
                              </span>
                              <span className="text-gray-900 font-medium">
                                {(
                                  item.product.priceNumber * item.quantity
                                ).toFixed(2)}{" "}
                                FCFA
                              </span>
                            </div>
                          ))}
                          <div className="border-t pt-1 mt-1 flex justify-between font-semibold text-sm">
                            <span>Sous-total:</span>
                            <span className="text-orange-600">
                              {vendorTotal.toFixed(2)} FCFA
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t-2 border-orange-300 pt-2 mt-2 font-bold flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      {getTotalPrice().toFixed(2)} FCFA
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">
                  * Champs obligatoires
                </p>
              </div>
            </div>
          )}

          <div className="border-t p-4 bg-gray-50">
            {!showOrderForm ? (
              cartItems.length > 0 && (
                <Button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isLoadingVendors || !!vendorError}
                >
                  {isLoadingVendors ? "Chargement..." : "Passer la commande"}
                </Button>
              )
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1"
                  disabled={isSubmitting}
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
