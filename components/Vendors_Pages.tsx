"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  Package,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNumber: number;
  img: string;
  category: string;
  vendorId: string;
  details?: string;
  origin?: string;
  freshness?: string;
  stock: number;
  unit?: string;
  isActive: boolean;
  createdAt?: string;
}

export default function VendorProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  // Redirection si non connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
    }
  }, [status, router]);

  // Récupération des produits du vendeur
  useEffect(() => {
    async function fetchVendorProducts() {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/product');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }

        const data = await response.json();
        const allProducts = data.products || [];
        
        // ✅ Filtrer pour n'afficher que les produits du vendeur connecté
        const myProducts = allProducts.filter(
          (product: Product) => product.vendorId === session?.user?.id
        );

        console.log(`✅ ${myProducts.length} produit(s) trouvé(s) pour ce vendeur`);
        setProducts(myProducts);
      } catch (err) {
        console.error('❌ Erreur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchVendorProducts();
    }
  }, [session, status]);

  // ✅ Upload d'image
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      console.log('✅ Image uploadée:', data.url);

      // Mettre à jour le formulaire et la prévisualisation
      setEditForm(prev => ({ ...prev, img: data.url }));
      setNewImagePreview(data.url);

      return data.url;
    } catch (err) {
      console.error('❌ Erreur upload:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Commencer l'édition
  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      desc: product.desc,
      price: product.price,
      priceNumber: product.priceNumber,
      stock: product.stock,
      unit: product.unit || 'unité',
      origin: product.origin,
      freshness: product.freshness,
      details: product.details,
      category: product.category,
      img: product.img,
      isActive: product.isActive,
    });
    setNewImagePreview(null);
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setNewImagePreview(null);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async (productId: string) => {
    try {
      setIsSaving(true);

      // Validation
      if (!editForm.name?.trim()) {
        alert('Le nom du produit est requis');
        return;
      }

      if (editForm.priceNumber !== undefined) {
        const priceNum = typeof editForm.priceNumber === 'string' 
          ? parseFloat(editForm.priceNumber as string)
          : editForm.priceNumber;
        
        if (isNaN(priceNum) || priceNum < 0) {
          alert('Le prix doit être un nombre positif');
          return;
        }
        editForm.priceNumber = priceNum;
        editForm.price = `${priceNum}`;
      }

      if (editForm.stock !== undefined) {
        const stockNum = typeof editForm.stock === 'string'
          ? parseInt(editForm.stock as string)
          : editForm.stock;
        
        if (isNaN(stockNum) || stockNum < 0) {
          alert('Le stock doit être un nombre positif');
          return;
        }
        editForm.stock = stockNum;
      }

      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      console.log('✅ Produit mis à jour:', data);

      // Mettre à jour localement
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
            ? { ...p, ...editForm } as Product
            : p
        )
      );

      setEditingId(null);
      setEditForm({});
      setNewImagePreview(null);
      alert('Produit mis à jour avec succès !');
    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  // Supprimer un produit
  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?\nCette action est irréversible.`)) {
      return;
    }

    try {
      setDeletingId(productId);

      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      console.log('✅ Produit supprimé:', data);

      // Retirer localement
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Produit supprimé avec succès !');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  // Activer/Désactiver un produit
  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, isActive: !currentActive } : p
        )
      );
    } catch (err) {
      console.error('❌ Erreur:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // États de chargement
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-center text-red-800 font-semibold mb-2">Erreur</p>
            <p className="text-center text-red-600 text-sm">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes Produits
            </h1>
            <p className="text-gray-600">
              Gérez vos produits : modifier, désactiver ou supprimer
            </p>
          </div>
          <Button
            onClick={() => router.push('/vendor-dashboard')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            + Ajouter un produit
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total produits</p>
                  <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <Package className="h-10 w-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-3xl font-bold text-green-600">
                    {products.filter(p => p.isActive).length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Désactivés</p>
                  <p className="text-3xl font-bold text-gray-400">
                    {products.filter(p => !p.isActive).length}
                  </p>
                </div>
                <EyeOff className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des produits */}
        {products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Vous n&apos;avez pas encore de produits</p>
              <Button 
                onClick={() => router.push('/vendor-dashboard')}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const isEditing = editingId === product.id;
              const isDeleting = deletingId === product.id;
              const displayImage = newImagePreview || editForm.img || product.img;

              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          product.isActive 
                            ? 'bg-green-500' 
                            : 'bg-gray-500'
                        }`}
                      >
                        {product.isActive ? 'Actif' : 'Désactivé'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    {isEditing ? (
                      // Mode édition
                      <div className="space-y-3">
                        {/* Upload image */}
                        <div>
                          <Label>Image du produit</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file);
                              }}
                              disabled={uploadingImage}
                              className="flex-1"
                            />
                            {uploadingImage && (
                              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, WEBP (max 5MB)
                          </p>
                        </div>

                        <div>
                          <Label>Nom</Label>
                          <Input
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={editForm.desc || ''}
                            onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Prix (FCFA)</Label>
                            <Input
                              type="number"
                              value={editForm.priceNumber || ''}
                              onChange={(e) => setEditForm({ ...editForm, priceNumber: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              value={editForm.stock || ''}
                              onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Unité</Label>
                            <Input
                              value={editForm.unit || ''}
                              onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                              placeholder="kg, unité, botte..."
                            />
                          </div>
                          <div>
                            <Label>Origine</Label>
                            <Input
                              value={editForm.origin || ''}
                              onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                              placeholder="Ex: Yamoussoukro"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => handleSaveEdit(product.id)}
                            disabled={isSaving || uploadingImage}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            variant="outline"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Mode affichage
                      <div>
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.desc}
                        </p>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-bold text-orange-500">
                            {product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock} {product.unit || ''}
                          </span>
                        </div>

                        {product.origin && (
                          <p className="text-xs text-gray-500 mb-3">
                            📍 {product.origin}
                          </p>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            {product.isActive ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Activer
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => handleStartEdit(product)}
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={isDeleting}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}