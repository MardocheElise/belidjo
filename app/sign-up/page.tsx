// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function SignUpPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: ""
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     // Validation côté client
//     if (!formData.name || !formData.email || !formData.phone || !formData.password) {
//       setError("Tous les champs sont requis");
//       setLoading(false);
//       return;
//     }

//     // Vérifier que les mots de passe correspondent
//     if (formData.password !== formData.confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       setLoading(false);
//       return;
//     }

//     // Vérifier la longueur du mot de passe
//     if (formData.password.length < 6) {
//       setError("Le mot de passe doit contenir au moins 6 caractères");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Appel à l'API d'inscription
//       const response = await fetch("/api/vendor", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Erreur lors de l'inscription");
//         setLoading(false);
//         return;
//       }

//       // Succès - Afficher un message et rediriger
//       setSuccess("Inscription réussie ! Redirection...");
      
//       // Attendre 2 secondes puis rediriger vers la page de connexion
//       setTimeout(() => {
//         router.push("/product");
//       }, 2000);

//     } catch (error) {
//       console.error("Erreur:", error);
//       setError("Une erreur s'est produite lors de la connexion au serveur");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-center">
//             Inscription Vendeur
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Champ Nom */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Nom <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Votre nom"
//                 required
//               />
//             </div>

//             {/* Champ Email */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="votre@email.com"
//                 required
//               />
//             </div>

//             {/* Champ Téléphone */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Téléphone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="+225 0000000000"
//                 required
//               />
//             </div>

//             {/* Champ Mot de passe */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Mot de passe <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="••••••••"
//                 required
//                 minLength={6}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Minimum 6 caractères
//               </p>
//             </div>

//             {/* Champ Confirmer le mot de passe */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Confirmer le mot de passe <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     confirmPassword: e.target.value,
//                   })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             {/* Message d'erreur */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Message de succès */}
//             {success && (
//               <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
//                 {success}
//               </div>
//             )}

//             {/* Bouton de soumission */}
//             <Button
//               type="submit"
//               className="w-full bg-blue-500 hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Inscription en cours..." : "S'inscrire"}
//             </Button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Ou</span>
//               </div>
//             </div>

//             {/* Lien vers la connexion */}
//             <div className="text-center text-sm">
//               <Link
//                 href="/sign-in"
//                 className="text-blue-500 hover:underline"
//               >
//                 Déjà un compte ? Se connecter
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }









// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react"; // ✅ AJOUTER CET IMPORT
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function SignUpPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: ""
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     // Validation côté client
//     if (!formData.name || !formData.email || !formData.phone || !formData.password) {
//       setError("Tous les champs sont requis");
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       setLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Le mot de passe doit contenir au moins 6 caractères");
//       setLoading(false);
//       return;
//     }

//     try {
//       // 1️⃣ Appel à l'API d'inscription
//       const response = await fetch("/api/vendor", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Erreur lors de l'inscription");
//         setLoading(false);
//         return;
//       }

//       setSuccess("Inscription réussie ! Création de la session...");

//       // 2️⃣ ✅ CRÉER LA SESSION AUTOMATIQUEMENT
//       const signInResult = await signIn("credentials", {
//         redirect: false,
//         name: formData.name,
//         password: formData.password,
//       });

//       if (signInResult?.error) {
//         console.error("Erreur lors de la création de session:", signInResult.error);
//         setError("Inscription réussie mais erreur de connexion. Veuillez vous reconnecter.");
//         setLoading(false);
//         // Rediriger vers la page de connexion
//         setTimeout(() => {
//           router.push("/sign-in");
//         }, 2000);
//         return;
//       }

//       // 3️⃣ Redirection vers /product avec la session active
//       setTimeout(() => {
//         router.push("/product");
//       }, 1500);

//     } catch (error) {
//       console.error("Erreur:", error);
//       setError("Une erreur s'est produite lors de la connexion au serveur");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <h2 className="text-2xl font-bold text-center">
//             Inscription Vendeur
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Champ Nom */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Nom <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Votre nom"
//                 required
//               />
//             </div>

//             {/* Champ Email */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="votre@email.com"
//                 required
//               />
//             </div>

//             {/* Champ Téléphone */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Téléphone <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="+225 0000000000"
//                 required
//               />
//             </div>

//             {/* Champ Mot de passe */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Mot de passe <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="••••••••"
//                 required
//                 minLength={6}
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Minimum 6 caractères
//               </p>
//             </div>

//             {/* Champ Confirmer le mot de passe */}
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Confirmer le mot de passe <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     confirmPassword: e.target.value,
//                   })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             {/* Message d'erreur */}
//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             {/* Message de succès */}
//             {success && (
//               <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
//                 {success}
//               </div>
//             )}

//             {/* Bouton de soumission */}
//             <Button
//               type="submit"
//               className="w-full bg-blue-500 hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Inscription en cours..." : "S'inscrire"}
//             </Button>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Ou</span>
//               </div>
//             </div>

//             {/* Lien vers la connexion */}
//             <div className="text-center text-sm">
//               <Link
//                 href="/sign-in"
//                 className="text-blue-500 hover:underline"
//               >
//                 Déjà un compte ? Se connecter
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
















"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // ✅ AJOUTER CET IMPORT
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation côté client
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Tous les champs sont requis");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Appel à l'API d'inscription
      const response = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }

      setSuccess("Inscription réussie !");

      //  CRÉER LA SESSION AUTOMATIQUEMENT
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,   
        password: formData.password,
      });

      if (signInResult?.error) {
        console.error("Erreur lors de la création de session:", signInResult.error);
        setError("Inscription réussie mais erreur de connexion. Veuillez vous reconnecter.");
        setLoading(false);
        // Rediriger vers la page de connexion
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
        return;
      }

      // Redirection vers product avec la session active
      setTimeout(() => {
        router.push("/product");
      }, 1500);

    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur s'est produite lors de la connexion au serveur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Inscription Vendeur
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Nom */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom"
                required
              />
            </div>

            {/* Champ Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>

            {/* Champ Téléphone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+225 0000000000"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 caractères
              </p>
            </div>

            {/* Champ Confirmer le mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmer le mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Message de succès */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            {/* Lien vers la connexion */}
            <div className="text-center text-sm">
              <Link
                href="/sign-in"
                className="text-blue-500 hover:underline"
              >
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}