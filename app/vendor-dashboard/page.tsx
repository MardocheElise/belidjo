//  "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
 
// import { Label } from "@/components/ui/label";
// import { Loader2, ArrowLeftCircle, PlusCircle } from "lucide-react";

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
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-400 to-orange-300">
//         <p className="text-white text-lg animate-pulse">Chargement...</p>
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
//     setTimeout(() => {
//     router.push("/product");
//   }, 3000);

//     if (!formData.name || !formData.desc || !formData.price || !formData.img || !formData.category) {
//       setError("Les champs obligatoires doivent être remplis");
//       setLoading(false);
//       return;
//     }

//     const priceNumber = parseFloat(formData.price);
//     if (isNaN(priceNumber) || priceNumber < 0) {
//       setError("Le prix doit être un nombre valide");
//       setLoading(false);
//       return;
//     }

//     const stockNumber = formData.stock ? parseInt(formData.stock) : 0;
//     if (isNaN(stockNumber) || stockNumber < 0) {
//       setError("Le stock doit être un nombre valide");
//       setLoading(false);
//       return;
//     }

//     try {
//       const nutritionalInfoArray = formData.nutritionalInfo
//         ? formData.nutritionalInfo.split(",").map((item) => item.trim())
//         : [];

//       const response = await fetch("/api/product", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           priceNumber,
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

//       setSuccess("✅ Produit ajouté avec succès !");
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
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-400 to-orange-300 flex items-center justify-center py-10 px-4">
//       <div className="w-full max-w-3xl">
//         <Card className="shadow-2xl border-0 rounded-2xl backdrop-blur-lg bg-white/80">
//           <CardHeader className="text-center space-y-2">
//             <CardTitle className="text-3xl font-bold text-orange-600">
//               Dashboard Vendeur
//             </CardTitle>
//             <p className="text-gray-700">
//               Bienvenue, <span className="font-semibold">{session?.user?.name || "Vendeur"}</span>
//             </p>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Nom */}
//               <div>
//                 <Label>Nom du produit *</Label>
//                 <Input
//                   placeholder="Ex: Tomates fraîches"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <Label>Description *</Label>
//                 <textarea
//                   rows={3}
//                   placeholder="Description détaillée du produit"
//                   value={formData.desc}
//                   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//                   onChange={(e: { target: { value: any; }; }) => setFormData({ ...formData, desc: e.target.value })}
//                   required
//                 > </textarea>
//               </div>

//               {/* Prix / Stock */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label>Prix (FCFA) *</Label>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     placeholder="1000"
//                     value={formData.price}
//                     onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Stock *</Label>
//                   <Input
//                     type="number"
//                     placeholder="50"
//                     value={formData.stock}
//                     onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Image */}
//               <div>
//                 <Label>URL de l’image *</Label>
//                 <Input
//                   type="url"
//                   placeholder="https://exemple.com/image.jpg"
//                   value={formData.img}
//                   onChange={(e) => setFormData({ ...formData, img: e.target.value })}
//                   required
//                 />
//               </div>

//               {/* Catégorie */}
//               <div>
//                 <Label>Catégorie *</Label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500"
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

//               {/* Autres champs */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label>Origine</Label>
//                   <Input
//                     placeholder="Ex: Côte d'Ivoire"
//                     value={formData.origin}
//                     onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label>Fraîcheur</Label>
//                   <Input
//                     placeholder="Ex: Frais du jour"
//                     value={formData.freshness}
//                     onChange={(e) => setFormData({ ...formData, freshness: e.target.value })}
//                   />
//                 </div>
//               </div>

//               {/* Nutrition */}
//               <div>
//                 <Label>Informations nutritionnelles</Label>
//                 <Input
//                   placeholder="Vitamine C, Fibres, Calcium..."
//                   value={formData.nutritionalInfo}
//                   onChange={(e) => setFormData({ ...formData, nutritionalInfo: e.target.value })}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Séparez par des virgules</p>
//               </div>

//               {/* Messages */}
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
//               <div className="flex gap-3 pt-2">
//                 <Button
//                   type="submit"
//                   className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
//                   disabled={loading}
//                   // onClick={()=>router.push("/product")}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Ajout en cours...
//                     </>
//                   ) : (
//                     <>
//                       <PlusCircle className="w-4 h-4 mr-2" /> Ajouter le produit
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/product")}
//                 >
//                   <ArrowLeftCircle className="w-4 h-4 mr-2" /> Retour
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
import { Loader2, ArrowLeftCircle, PlusCircle, Upload, X } from "lucide-react";
import Image from "next/image";

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validation du type de fichier
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Format d'image invalide. Utilisez JPG, PNG, WebP ou GIF");
      return;
    }

    // Validation de la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setImageFile(file);
    setError("");

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, img: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.name || !formData.desc || !formData.price || !formData.category) {
      setError("Les champs obligatoires doivent être remplis");
      setLoading(false);
      return;
    }

    if (!imageFile && !formData.img) {
      setError("Vous devez importer une image ou fournir une URL");
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
      let imageUrl = formData.img;

      // Si une image est sélectionnée, l'uploader d'abord
      if (imageFile) {
        const formDataFile = new FormData();
        formDataFile.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          setError(uploadData.message || "Erreur lors de l'upload de l'image");
          setLoading(false);
          return;
        }

        imageUrl = uploadData.url;
      }

      // Ensuite créer le produit
      const nutritionalInfoArray = formData.nutritionalInfo
        ? formData.nutritionalInfo.split(",").map((item) => item.trim())
        : [];

      const response = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          img: imageUrl,
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
      removeImage();

      setTimeout(() => {
        router.push("/product");
      }, 3000);
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
              Ajouter un Produit
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
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
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

              {/* Image Upload */}
              <div>
                <Label>Image du produit *</Label>
                {imagePreview ? (
                  <div className="relative inline-block w-full">
                    <Image
                      width={90}
                      height={100}
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-64 object-cover rounded-lg mb-3 border-2 border-orange-300"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" /> Supprimer
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-500 transition">
                    <Upload className="w-12 h-12 mx-auto text-orange-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-orange-600 font-semibold">Cliquez pour importer</span>
                      <span className="text-gray-600"> ou glissez une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!formData.img}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP ou GIF (max 5MB)</p>
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  Ou entrez une URL d&apos;image :
                </p>
                <Input
                  type="url"
                  placeholder="https://exemple.com/image.jpg"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  className="mt-1"
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