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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "./products";
import { useCart } from "./CartContext";
import { useState } from "react";
import CartModal from "@/components/CartModal";
import VendorLoginModal from "@/components/VendorLoginModal";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Composant Principal GroceryPage
export default function GroceryPage() {
  const { getTotalItems } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showVendorLogin, setShowVendorLogin] = useState(false);
  const cartItemsCount = getTotalItems();
  const router = useRouter();
  const { data: session } = useSession();
  const handleVendorClick = () => {
    if (session) {
      router.push("/vendor-dashboard");
    } else {
      setShowVendorLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10 px-4">
      {/* Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <Link href={"/"}>Bélidjo.</Link>
        </h1>

        {/* Navigation  */}
        <div className="flex items-center gap-3">
          {/* Bouton Admin Vendeur */}
          <Button
            variant="outline"
            onClick={handleVendorClick}
            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
          >
            Vendeur
          </Button>

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
            céréales frais soignesement cueillis et livrés en un temps record
            sur le campus.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 w-fit px-6 py-4 text-lg">
            Achetez maintenant
          </Button>
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
      <section className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {products.map((product, index) => (
          <Card
            key={index}
            className="rounded-xl md:rounded-2xl border-0 hover:shadow-lg transition"
          >
            <Link href={`/product/${product.id}`}>
              <CardContent className="flex flex-col items-center md:p-4">
                <div className="p-4 mb-2">
                  <Image
                    src={product.img}
                    alt={product.name}
                    width={90}
                    height={100}
                  />
                </div>
                <h3 className="font-semibold text-lg text-center">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{product.desc}</p>
                <span className="font-bold text-orange-500">
                  {product.price}
                </span>
              </CardContent>
            </Link>
          </Card>
        ))}
      </section>

      {/* Modal du panier existant */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
      />

      {/* Modal de connexion vendeur - NOUVEAU */}
      <VendorLoginModal
        isOpen={showVendorLogin}
        onClose={() => setShowVendorLogin(false)}
      />
    </div>
  );
}
