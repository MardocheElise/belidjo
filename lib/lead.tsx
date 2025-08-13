"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "./products";
import { useCart } from "./CartContext";
import { useState } from "react";
import CartModal from "@/components/CartModal";

export default function GroceryPage() {
  const { getTotalItems } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const cartItemsCount = getTotalItems();

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-4">
      {/* Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bélidjo.</h1>
        
        {/* Bouton panier */}
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
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Votre marché universitaire</h2>
          <p className="text-gray-600 mb-6">Découvrez une sélection exclusive de fruits frais soignesement cueillis et livrés en un temps record sur le campus.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 w-fit px-6 py-4 text-lg">Shop Now</Button>
        </div>
        <div className="relative flex justify-center items-center">
          <Image src="/salade.jpeg" alt="image" width={350} height={350} className="rounded-2xl"/>
        </div>
      </section>

      {/* Products */}
      <section className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {products.map((product, index) => (
          <Card key={index} className="rounded-xl md:rounded-2xl border-0 hover:shadow-lg transition">
            <Link href={`/product/${product.id}`}>
              <CardContent className="flex flex-col items-center md:p-4">
                <div className="p-4 mb-2">
                  <Image src={product.img} alt={product.name} width={90} height={100} />
                </div>
                <h3 className="font-semibold text-lg text-center">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.desc}</p>
                <span className="font-bold text-orange-500">{product.price}</span>
              </CardContent>
            </Link>
          </Card>
        ))}
      </section>

      {/* Modal du panier */}
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
}

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Search } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// export default function GroceryPage() {
//   const products = [
//     { name: "Fresh Carrot", desc: "Local (1kg)", price: "$2.9", img: "/ananas.jpeg" , hreff :"/banane" },
//     { name: "Fresh Capsicum", desc: "Red (500g)", price: "$2.9", img: "/avocat.jpeg", hreff :"/banane" },
//     { name: "Mustard Greens", desc: "Local (500g)", price: "$2.9", img: "/banane.jpeg" , hreff :"/banane" },
//     { name: "Radish", desc: "Local (1kg)", price: "$2.9", img: "/mangue.jpeg" , hreff :"/banane"},
//      { name: "Fresh Carrot", desc: "Local (1kg)", price: "$2.9", img: "/ananas.jpeg", hreff :"/banane" },
//     { name: "Fresh Capsicum", desc: "Red (500g)", price: "$2.9", img: "/avocat.jpeg", hreff :"/banane" },
//     { name: "Mustard Greens", desc: "Local (500g)", price: "$2.9", img: "/banane.jpeg" , hreff :"/banane"},
//     { name: "Radish", desc: "Local (1kg)", price: "$2.9", img: "/mangue.jpeg" , hreff :"/banane" },
//   ];

//   return (
//     <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-4">
//       {/* Navbar */}
//       <header className="w-full max-w-6xl flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Bélidjo.</h1>
//      </header>

//       {/* Hero Section */}
//       <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8">
//         <div className="flex flex-col justify-center">
//           <h2 className="text-4xl font-bold text-gray-800 mb-4">From farm to your kitchen</h2>
//           <p className="text-gray-600 mb-6">Discover the freshest and finest groceries delivered quickly and conveniently.</p>
//           <Button className="bg-orange-500 hover:bg-orange-600 w-fit px-6 py-4 text-lg">Shop Now</Button>
//         </div>
//         <div className="relative flex justify-center items-center">
//           <Image src="/salade.jpeg" alt="image" width={350} height={350}  className="rounded-2xl"/>
//           {/* <span className="absolute top-5 right-10 bg-white px-4 py-1 rounded-full text-sm text-red-500 font-semibold shadow">50% OFF!</span> */}
//         </div>
//       </section>

//       {/* Products */}
//       <section className="w-full max-w-6xl grid grid-cols-2  md:grid-cols-4 gap-6 mt-8">
//         {products.map((product, index) => (
       
//           <Card key={index} className="rounded-xl md:rounded-2xl border-0 hover:shadow-lg transition">
//              <Link href={product.hreff}>
//             <CardContent className="flex flex-col items-center md:p-4">
//               <div className="p-4 mb-2">
//                 <Image src={product.img} alt={product.name} width={90} height={100} />
//               </div>
//               <h3 className="font-semibold text-lg text-center">{product.name}</h3>
//               <p className="text-gray-500 text-sm mb-2">{product.desc}</p>
//               <span className="font-bold text-orange-500">{product.price}</span>
//             </CardContent>
//             </Link>
//           </Card>
//         ))}
//       </section>
//     </div>
//   );
// }
