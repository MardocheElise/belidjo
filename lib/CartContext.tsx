
// "use client";

// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { Product } from "@/lib/models/models_product";

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: Product, quantity: number) => void;
//   removeFromCart: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
// }

// const livraison = 50
// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   const addToCart = (product: Product, quantity: number) => {
//     setCartItems(prev => {
//       const existingItem = prev.find(item => item.product.id === product.id);
//       if (existingItem) {
//         return prev.map(item =>
//           item.product.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
//       return [...prev, { product, quantity }];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCartItems(prev => prev.filter(item => item.product.id !== productId));
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCartItems(prev =>
//       prev.map(item =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + (item.product.priceNumber * item.quantity) + livraison, 0);
//   };

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getTotalItems,
//       getTotalPrice
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

















// "use client";

// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// // Interface alignée avec le modèle MongoDB Product
//  interface CartProduct {
//   id: string;
//   name: string;
//   desc: string;
//   price: string;
//   priceNumber: number;
//   img: string;
//   category: string;
//   vendorId: string; // ✅ AJOUTER CETTE LIGNE
//   details?: string;
//   origin?: string;
//   freshness?: string;
//   nutritionalInfo?: string[];
//   stock: number;
// }
// // Structure d'un item dans le panier
// interface CartItem {
//   product: CartProduct;
//   quantity: number;
// }

// interface CartContextType {
//   cartItems: CartItem[];
//   addToCart: (product: CartProduct, quantity?: number) => void;
//   removeFromCart: (productId: string) => void;
//   updateQuantity: (productId: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalItems: () => number;
//   getTotalPrice: () => number;
//   getSubtotal: () => number;
//   getDeliveryFee: () => number;
// }

// const DELIVERY_FEE = 0; // Pas de frais de livraison selon votre modal
// const STORAGE_KEY = 'belidjo_cart';

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // Charger le panier depuis localStorage au montage (côté client uniquement)
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedCart = localStorage.getItem(STORAGE_KEY);
//       if (savedCart) {
//         try {
//           const parsedCart = JSON.parse(savedCart);
          
//           // ✅ MIGRATION : Vérifier si l'ancien format existe
//           if (parsedCart.length > 0 && !parsedCart[0].product) {
//             console.warn('⚠️ Ancien format de panier détecté, réinitialisation...');
//             localStorage.removeItem(STORAGE_KEY);
//             setCartItems([]);
//           } else {
//             setCartItems(parsedCart);
//           }
//         } catch (error) {
//           console.error('Erreur lors du chargement du panier:', error);
//           // En cas d'erreur, vider le localStorage
//           localStorage.removeItem(STORAGE_KEY);
//         }
//       }
//       setIsInitialized(true);
//     }
//   }, []);

//   // Sauvegarder le panier dans localStorage à chaque modification
//   useEffect(() => {
//     if (isInitialized && typeof window !== 'undefined') {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
//     }
//   }, [cartItems, isInitialized]);

//   const addToCart = (product: CartProduct, quantity: number = 1) => {
//     setCartItems(prev => {
//       const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      
//       if (existingItemIndex > -1) {
//         // Mettre à jour la quantité si le produit existe déjà
//         const newItems = [...prev];
//         newItems[existingItemIndex] = {
//           ...newItems[existingItemIndex],
//           quantity: newItems[existingItemIndex].quantity + quantity
//         };
//         return newItems;
//       }
      
//       // Ajouter un nouveau produit au panier
//       return [...prev, {
//         product: product,
//         quantity: quantity
//       }];
//     });
//   };

//   const removeFromCart = (productId: string) => {
//     setCartItems(prev => prev.filter(item => item.product.id !== productId));
//   };

//   const updateQuantity = (productId: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     setCartItems(prev =>
//       prev.map(item =>
//         item.product.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(STORAGE_KEY);
//     }
//   };

//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getSubtotal = () => {
//     return cartItems.reduce((total, item) => 
//       total + (item.product.priceNumber * item.quantity), 0
//     );
//   };

//   const getDeliveryFee = () => {
//     return cartItems.length > 0 ? DELIVERY_FEE : 0;
//   };

//   const getTotalPrice = () => {
//     return getSubtotal() + getDeliveryFee();
//   };

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getTotalItems,
//       getTotalPrice,
//       getSubtotal,
//       getDeliveryFee
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

// // Type exports pour utilisation dans d'autres composants
// export type { CartProduct, CartItem };


















"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// ✅ Interface alignée EXACTEMENT avec le modèle MongoDB Product
interface CartProduct {
  id: string;
  _id?: string;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
  img: string;
  category: string;
  vendorId: string; // ← S'ASSURER QUE C'EST INCLUS
  details?: string;
  origin?: string;
  freshness?: string;
  nutritionalInfo?: string[];
  stock: number;
  unit?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Structure d'un item dans le panier
interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
}

const DELIVERY_FEE = 0;
const STORAGE_KEY = 'belidjo_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          
          // ✅ Validation et migration du format
          if (Array.isArray(parsedCart)) {
            // Vérifier que chaque item a la bonne structure
            const validCart = parsedCart.filter(item => {
              return (
                item.product &&
                item.product.id &&
                item.product.vendorId && // ✅ IMPORTANT : Vérifier que vendorId existe
                item.quantity > 0
              );
            });

            if (validCart.length !== parsedCart.length) {
              console.warn('⚠️ Certains items du panier étaient invalides et ont été retirés');
            }

            setCartItems(validCart);
          } else {
            console.warn('⚠️ Format de panier invalide, réinitialisation...');
            localStorage.removeItem(STORAGE_KEY);
            setCartItems([]);
          }
        } catch (error) {
          console.error('❌ Erreur lors du chargement du panier:', error);
          localStorage.removeItem(STORAGE_KEY);
          setCartItems([]);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      console.log('💾 Panier sauvegardé:', cartItems.length, 'items');
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    // ✅ Validation stricte du produit avant ajout
    if (!product.id || !product.vendorId) {
      console.error('❌ Produit invalide:', product);
      alert('Erreur: Ce produit ne peut pas être ajouté au panier (données manquantes)');
      return;
    }

    console.log('➕ Ajout au panier:', {
      id: product.id,
      name: product.name,
      vendorId: product.vendorId,
      quantity
    });

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Mettre à jour la quantité si le produit existe déjà
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        console.log('✅ Quantité mise à jour:', newItems[existingItemIndex].quantity);
        return newItems;
      }
      
      // Ajouter un nouveau produit au panier
      console.log('✅ Nouveau produit ajouté au panier');
      return [...prev, {
        product: product,
        quantity: quantity
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    console.log('🗑️ Suppression du panier:', productId);
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    console.log('🔄 Mise à jour quantité:', productId, quantity);
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('🧹 Panier vidé');
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.product.priceNumber * item.quantity), 0
    );
  };

  const getDeliveryFee = () => {
    return cartItems.length > 0 ? DELIVERY_FEE : 0;
  };

  const getTotalPrice = () => {
    return getSubtotal() + getDeliveryFee();
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getSubtotal,
      getDeliveryFee
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Type exports pour utilisation dans d'autres composants
export type { CartProduct, CartItem };