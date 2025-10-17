// ✅ Exemple: Page ou composant qui affiche les produits

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔄 Récupération des produits...");

        // ✅ Appeler la route GET /api/product
        const response = await fetch("/api/product", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }

        const data = await response.json();
        console.log("✅ Produits reçus:", data.products);

        setProducts(data.products);
      } catch (err) {
        console.error("❌ Erreur:", err);
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Chargement des produits...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (products.length === 0) return <div>Aucun produit disponible</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Produits disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          // <Card
          //   key={product._id}
          //   className="rounded-xl md:rounded-2xl border-0 hover:shadow-lg transition"
          // >
          //   <Link href={`/product/${product._id}`}>
          //     <CardContent className="flex flex-col items-center md:p-4">
          //       <div className="p-4 mb-2">
          //         <Image
          //           width={90}
          //           height={100}
          //           src={product.img}
          //           alt={product.name}
          //           className="w-full h-48 object-cover rounded mb-2"
          //         />
          //       </div>
          //       <h3 className="font-semibold text-lg text-center">
          //         {product.name}
          //       </h3>
          //       <p className="text-gray-500 text-sm mb-2">{product.desc}</p>
          //       <span className="font-bold text-orange-500">
          //         {product.price}
          //       </span>
          //     </CardContent>
          //   </Link>
          // </Card>
          <div key={product._id} className="border rounded-lg p-4 shadow-md">
            <Image
              width={90}
              height={100}
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.desc}</p>

            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold text-green-600">
                {product.price}
              </span>
              <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                {product.category}
              </span>
            </div>

            <div className="text-sm text-gray-500 mb-3">
              <p>Stock: {product.stock}</p>
              <p>Vendeur: {product.vendorId.name}</p>
            </div>
            <Link href={`/product/${product._id}`}>
              <Button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Ajouter au panier
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
