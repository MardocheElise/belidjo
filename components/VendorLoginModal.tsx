 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface VendorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VendorLoginModal({ isOpen, onClose }: VendorLoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Vérifier que les champs ne sont pas vides
    if (email.trim() === "" || password.trim() === "") {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Envoyer les credentials (nom + mot de passe) à NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        setError("Nom ou mot de passe incorrect");
      } else {
        // Connexion réussie
        onClose();
        router.push("/product");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-bold text-center">Connexion Vendeur</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Champ Nom */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre email"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez votre mot de passe"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Message d'erreur */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Bouton de connexion */}
            <Button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            {/* Lien inscription */}
            <div className="text-center text-sm space-y-2">
              <Link
                href="/sign-up"
                className="block text-blue-500 hover:underline"
                onClick={onClose}
              >
                Pas de compte ? Sinscrire
              </Link>
               <Link href={"/product"}>
               
              <Button onClick={onClose} variant="ghost" className="w-full">
               Annuler
              </Button>
               </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}