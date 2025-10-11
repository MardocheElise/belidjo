// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function VendorDashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     desc: "",
//     price: "",
//     img: "",
//     category: "",
//     details: "",
//     origin: "",
//     freshness: "",
//     nutritionalInfo: "",
//     stock: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Rediriger si non connecté
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Chargement...</p>
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     router.push("/");
//     return null;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     // Validation
//     if (!formData.name || !formData.desc || !formData.price || !formData.img || !formData.category) {
//       setError("Les champs obligatoires doivent être remplis");
//       setLoading(false);
//       return;
//     }

//     // Vérifier que le prix est un nombre valide
//     const priceNumber = parseFloat(formData.price);
//     if (isNaN(priceNumber) || priceNumber < 0) {
//       setError("Le prix doit être un nombre valide");
//       setLoading(false);
//       return;
//     }

//     // Vérifier le stock
//     const stockNumber = formData.stock ? parseInt(formData.stock) : 0;
//     if (isNaN(stockNumber) || stockNumber < 0) {
//       setError("Le stock doit être un nombre valide");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Convertir nutritionalInfo en tableau
//       const nutritionalInfoArray = formData.nutritionalInfo
//         ? formData.nutritionalInfo.split(",").map((item) => item.trim())
//         : [];

//       const response = await fetch("/api/product", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           desc: formData.desc,
//           price: formData.price,
//           priceNumber: priceNumber,
//           img: formData.img,
//           category: formData.category,
//           details: formData.details || undefined,
//           origin: formData.origin || undefined,
//           freshness: formData.freshness || undefined,
//           nutritionalInfo: nutritionalInfoArray.length > 0 ? nutritionalInfoArray : undefined,
//           stock: stockNumber,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Erreur lors de l'ajout du produit");
//         setLoading(false);
//         return;
//       }

//       // Succès
//       setSuccess("Produit ajouté avec succès !");
      
//       // Réinitialiser le formulaire
//       setFormData({
//         name: "",
//         desc: "",
//         price: "",
//         img: "",
//         category: "",
//         details: "",
//         origin: "",
//         freshness: "",
//         nutritionalInfo: "",
//         stock: "",
//       });

//       setLoading(false);
//     } catch (error) {
//       console.error("Erreur:", error);
//       setError("Une erreur s'est produite");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         {/* En-tête */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Dashboard Vendeur</h1>
//           <p className="text-gray-600 mt-2">
//             Bienvenue, {session?.user?.name || "Vendeur"}
//           </p>
//         </div>

//         {/* Formulaire d'ajout de produit */}
//         <Card>
//           <CardHeader>
//             <h2 className="text-2xl font-bold">Ajouter un produit</h2>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Nom du produit */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Nom du produit <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Ex: Tomates fraîches"
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={formData.desc}
//                   onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Description détaillée du produit"
//                   rows={3}
//                   required
//                 />
//               </div>

//               {/* Prix et Stock */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Prix (FCFA) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.price}
//                     onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="1000"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Stock <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     value={formData.stock}
//                     onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="50"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Image URL */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   URL de l&apos;image <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.img}
//                   onChange={(e) => setFormData({ ...formData, img: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="https://exemple.com/image.jpg"
//                   required
//                 />
//               </div>

//               {/* Catégorie */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Catégorie <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   required
//                 >
//                   <option value="">Sélectionnez une catégorie</option>
//                   <option value="Fruits">Fruits</option>
//                   <option value="Légumes">Légumes</option>
//                   <option value="Viandes">Viandes</option>
//                   <option value="Poissons">Poissons</option>
//                   <option value="Produits laitiers">Produits laitiers</option>
//                   <option value="Épices">Épices</option>
//                   <option value="Céréales">Céréales</option>
//                   <option value="Autres">Autres</option>
//                 </select>
//               </div>

//               {/* Détails supplémentaires */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Détails supplémentaires
//                 </label>
//                 <textarea
//                   value={formData.details}
//                   onChange={(e) => setFormData({ ...formData, details: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Informations complémentaires sur le produit"
//                   rows={2}
//                 />
//               </div>

//               {/* Origine et Fraîcheur */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Origine</label>
//                   <input
//                     type="text"
//                     value={formData.origin}
//                     onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Ex: Côte d'Ivoire"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Fraîcheur</label>
//                   <input
//                     type="text"
//                     value={formData.freshness}
//                     onChange={(e) => setFormData({ ...formData, freshness: e.target.value })}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Ex: Frais du jour"
//                   />
//                 </div>
//               </div>

//               {/* Informations nutritionnelles */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Informations nutritionnelles
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.nutritionalInfo}
//                   onChange={(e) => setFormData({ ...formData, nutritionalInfo: e.target.value })}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Séparez par des virgules: Vitamines C, Fibres, Calcium"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Séparez chaque information par une virgule
//                 </p>
//               </div>

//               {/* Messages d'erreur et de succès */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
//                   {error}
//                 </div>
//               )}

//               {success && (
//                 <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
//                   {success}
//                 </div>
//               )}

//               {/* Boutons */}
//               <div className="flex gap-4">
//                 <Button
//                   type="submit"
//                   className="flex-1 bg-blue-500 hover:bg-blue-600"
//                   disabled={loading}
//                 >
//                   {loading ? "Ajout en cours..." : "Ajouter le produit"}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/product")}
//                 >
//                   Retour
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeftCircle, PlusCircle } from "lucide-react";

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    img: "",
    category: "",
    details: "",
    origin: "",
    freshness: "",
    nutritionalInfo: "",
    stock: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Rediriger si non connecté
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-400 to-orange-300">
        <p className="text-white text-lg animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setTimeout(() => {
    router.push("/product");
  }, 3000);

    if (!formData.name || !formData.desc || !formData.price || !formData.img || !formData.category) {
      setError("Les champs obligatoires doivent être remplis");
      setLoading(false);
      return;
    }

    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError("Le prix doit être un nombre valide");
      setLoading(false);
      return;
    }

    const stockNumber = formData.stock ? parseInt(formData.stock) : 0;
    if (isNaN(stockNumber) || stockNumber < 0) {
      setError("Le stock doit être un nombre valide");
      setLoading(false);
      return;
    }

    try {
      const nutritionalInfoArray = formData.nutritionalInfo
        ? formData.nutritionalInfo.split(",").map((item) => item.trim())
        : [];

      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priceNumber,
          nutritionalInfo: nutritionalInfoArray.length > 0 ? nutritionalInfoArray : undefined,
          stock: stockNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Erreur lors de l'ajout du produit");
        setLoading(false);
        return;
      }

      setSuccess("✅ Produit ajouté avec succès !");
      setFormData({
        name: "",
        desc: "",
        price: "",
        img: "",
        category: "",
        details: "",
        origin: "",
        freshness: "",
        nutritionalInfo: "",
        stock: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur s'est produite");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-400 to-orange-300 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <Card className="shadow-2xl border-0 rounded-2xl backdrop-blur-lg bg-white/80">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-orange-600">
              Dashboard Vendeur
            </CardTitle>
            <p className="text-gray-700">
              Bienvenue, <span className="font-semibold">{session?.user?.name || "Vendeur"}</span>
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom */}
              <div>
                <Label>Nom du produit *</Label>
                <Input
                  placeholder="Ex: Tomates fraîches"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description *</Label>
                <textarea
                  rows={3}
                  placeholder="Description détaillée du produit"
                  value={formData.desc}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, desc: e.target.value })}
                  required
                > </textarea>
              </div>

              {/* Prix / Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Prix (FCFA) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Stock *</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <Label>URL de l’image *</Label>
                <Input
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <Label>Catégorie *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Légumes">Légumes</option>
                  <option value="Viandes">Viandes</option>
                  <option value="Poissons">Poissons</option>
                  <option value="Produits laitiers">Produits laitiers</option>
                  <option value="Épices">Épices</option>
                  <option value="Céréales">Céréales</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>

              {/* Autres champs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Origine</Label>
                  <Input
                    placeholder="Ex: Côte d'Ivoire"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Fraîcheur</Label>
                  <Input
                    placeholder="Ex: Frais du jour"
                    value={formData.freshness}
                    onChange={(e) => setFormData({ ...formData, freshness: e.target.value })}
                  />
                </div>
              </div>

              {/* Nutrition */}
              <div>
                <Label>Informations nutritionnelles</Label>
                <Input
                  placeholder="Vitamine C, Fibres, Calcium..."
                  value={formData.nutritionalInfo}
                  onChange={(e) => setFormData({ ...formData, nutritionalInfo: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
              </div>

              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={loading}
                  // onClick={()=>router.push("/product")}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ajout en cours...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" /> Ajouter le produit
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/product")}
                >
                  <ArrowLeftCircle className="w-4 h-4 mr-2" /> Retour
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
