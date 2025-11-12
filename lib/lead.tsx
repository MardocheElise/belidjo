// "use client";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// import { useCart } from "./CartContext";
// import { useState } from "react";
// import CartModal from "@/components/CartModal";
// import { products } from "./products";

// export default function GroceryPage() {
//   const { getTotalItems } = useCart();
//   const [showCartModal, setShowCartModal] = useState(false);
//   const cartItemsCount = getTotalItems();

//   return (
//     <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-4">
//       {/* Navbar */}
//       <header className="w-full max-w-6xl flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-gray-800"><Link href={"/"}>Bélidjo.</Link></h1>

//         {/* Bouton panier */}
//         <Button
//           variant="outline"
//           onClick={() => setShowCartModal(true)}
//           className="relative"
//         >
//           <ShoppingCart className="h-4 w-4 mr-2" />
//           Panier
//           {cartItemsCount > 0 && (
//             <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
//               {cartItemsCount}
//             </Badge>
//           )}
//         </Button>
//       </header>

//       {/* Hero Section */}
//       <section
//         id="hero"
//         className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8"
//       >
//         <div className="flex flex-col justify-center">
//           <h2 className="text-4xl font-bold text-gray-800 mb-4">
//             Votre marché universitaire
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Découvrez une sélection exclusive de fruits, légumes, tubercules et
//             céréales frais soignesement cueillis et livrés en un temps record
//             sur le campus.
//           </p>
//           <Button className="bg-orange-500 hover:bg-orange-600 w-fit px-6 py-4 text-lg">
//             Achetez maintenant
//           </Button>
//         </div>
//         <div className="relative flex justify-center items-center">
//           <Image
//             src="/salade.jpeg"
//             alt="image"
//             width={350}
//             height={350}
//             className="rounded-2xl"
//           />
//         </div>
//       </section>

//       {/* Products */}
//       <section className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
//         {products.map((product, index) => (
//           <Card
//             key={index}
//             className="rounded-xl md:rounded-2xl border-0 hover:shadow-lg transition"
//           >
//             <Link href={`/product/${product.id}`}>
//               <CardContent className="flex flex-col items-center md:p-4">
//                 <div className="p-4 mb-2">
//                   <Image
//                     src={product.img}
//                     alt={product.name}
//                     width={90}
//                     height={100}
//                   />
//                 </div>
//                 <h3 className="font-semibold text-lg text-center">
//                   {product.name}
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-2">{product.desc}</p>
//                 <span className="font-bold text-orange-500">
//                   {product.price}
//                 </span>
//               </CardContent>
//             </Link>
//           </Card>
//         ))}
//       </section>

//       {/* Modal du panier */}
//       <CartModal
//         isOpen={showCartModal}
//         onClose={() => setShowCartModal(false)}
//       />
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useState } from "react";
import CartModal from "@/components/CartModal";
import VendorLoginModal from "@/components/VendorLoginModal";
import ProductsPage from "@/components/Fetch_products";
import VendorMenu from "@/components/VendorClick";

// Composant Principal GroceryPage
export default function GroceryPage() {
  const { getTotalItems } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showVendorLogin, setShowVendorLogin] = useState(false);
  const cartItemsCount = getTotalItems();

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-4">
      {/* Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <Link href={"/"}>Bélidjo.</Link>
        </h1>

        {/* Navigation  */}
        <div className="flex items-center gap-3">
          <VendorMenu />
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

       

      {/* Hero Section */}
      <section
        id="hero"
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8"
      >
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Votre marché universitaire
          </h2>
          <p className="text-gray-600 mb-6">
            Découvrez une sélection exclusive de fruits, légumes, tubercules et
            céréales frais soigneusement cueillis et livrés en un temps record
            sur le campus.
          </p>

          {/* Badge et Filter Container */}
          <div className="flex items-center gap-4">
            {/* Badge "Achetez maintenant" */}
            <div className="bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer rounded-full px-6 py-3 text-white font-medium text-lg shadow-md">
              Achetez maintenant
            </div>

            {/* Dropdown Filter */}
            <div className="relative">
              <select className="appearance-none bg-white border-2 border-orange-500 text-orange-500 font-medium rounded-full px-6 py-3 pr-10 cursor-pointer hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">Filtrer</option>
                <option value="fruits">Fruits</option>
                <option value="legumes">Légumes</option>
                <option value="autres">Autres</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <Image
            src="/salade.jpeg"
            alt="image"
            width={350}
            height={350}
            className="rounded-2xl"
          />
        </div>
      </section>
      {/* Products */}
      <ProductsPage />

      {/* Modal du panier existant */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />

      {/* Modal de connexion vendeur */}
      <VendorLoginModal
        isOpen={showVendorLogin}
        onClose={() => setShowVendorLogin(false)}
      />
    </div>
  );
}
