// ✅ Composant qui affiche les produits avec filtrage par catégorie

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Product {
  _id: string;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
  img: string;
  category: string;
  stock: number;
  vendorId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ProductsPageProps {
  selectedCategory?: string;
}

export default function ProductsPage({ selectedCategory = "" }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      
      try {
        console.log("🔄 Récupération des produits...");
        console.log("📁 Catégorie sélectionnée:", selectedCategory || "Toutes");

        // ✅ Construire l'URL avec le paramètre category si nécessaire
        const url = selectedCategory 
          ? `/api/product?category=${encodeURIComponent(selectedCategory)}`
          : "/api/product";

        console.log("🌐 URL appelée:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }

        const data = await response.json();
        console.log("✅ Produits reçus:", data.products.length);

        setProducts(data.products);
      } catch (err) {
        console.error("❌ Erreur:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // ✅ Re-fetch quand la catégorie change

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 text-lg">
          {selectedCategory 
            ? `Aucun produit trouvé dans la catégorie "${selectedCategory}"`
            : "Aucun produit disponible"}
        </p>
        {selectedCategory && (
          <p className="text-sm text-gray-400 mt-2">
            Essayez de sélectionner une autre catégorie
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-1 w-full max-w-6xl">
      {/* En-tête avec nombre de produits */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          {selectedCategory ? `${selectedCategory}` : "Tous les produits"}
        </h1>
        {/* <p className="text-center text-gray-500 mt-1">
          {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
        </p> */}
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
            <div className="relative group">
              <Image
                width={90}
                height={100}
                src={product.img}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="font-bold text-lg mt-2 truncate" title={product.name}>
              {product.name}
            </h2>

            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-green-600">
                {product.price} FCFA
              </span>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-medium">
                {product.category}
              </span>
            </div>

            <div className="text-sm text-gray-500 mb-3">
              <p className="flex items-center gap-1">
                <span className="font-medium">Stock:</span> 
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock}
                </span>
              </p>
            </div>

            <Link href={`/product/${product._id}`}>
              <Button 
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? "Voir le produit" : "Rupture de stock"}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}



















// // ✅ Exemple: Page ou composant qui affiche les produits

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Button } from "./ui/button";

// interface Product {
//   _id: string;
//   name: string;
//   desc: string;
//   price: string;
//   priceNumber: number;
//   img: string;
//   category: string;
//   stock: number;
//   vendorId: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   createdAt: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         console.log("🔄 Récupération des produits...");

//         // ✅ Appeler la route GET /api/product
//         const response = await fetch("/api/product", {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         if (!response.ok) {
//           throw new Error("Erreur lors de la récupération des produits");
//         }

//         const data = await response.json();
//         console.log("✅ Produits reçus:", data.products);

//         setProducts(data.products);
//       } catch (err) {
//         console.error("❌ Erreur:", err);
//         setError("Impossible de charger les produits");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) return <div>Chargement des produits...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;
//   if (products.length === 0) return <div>Aucun produit disponible</div>;

//   return (
//     <div className="p-1">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         Produits disponibles
//       </h1>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//         {products.map((product) => (
//           <div key={product._id} className="border rounded-lg p-4 shadow-md">
//             <div className="relative group">
//               <Image
//                 width={90}
//                 height={100}
//                 src={product.img}
//                 alt={product.name}
//                 className="w-full h-48 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105"
//               />
//               {/* Description visible au survol avec texte coloré */}
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
//                 {/* <p className="text-blue-500 text-sm font-semibold px-3 text-center drop-shadow-lg">
//                   {product.desc}
//                 </p> */}
//               </div>
//             </div>

//             <h2 className="font-bold text-lg mt-2">{product.name}</h2>

//             <div className="flex justify-between items-center mb-2">
//               <span className="text-lg font-bold text-green-600">
//                 {product.price} FCFA
//               </span>
//               <span className="text-sm bg-blue-100 px-2 py-1 rounded">
//                 {product.category}
//               </span>
//             </div>

//             <div className="text-sm text-gray-500 mb-3">
//               <p>Stock: {product.stock}</p>
//               {/* <p>Vendeur: {product.vendorId.name}</p> */}
//             </div>

//             <Link href={`/product/${product._id}`}>
//               <Button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
//                 Ajouter au panier
//               </Button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
