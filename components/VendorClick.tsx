// "use client";

// import { useState } from 'react';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { 
//   ChevronDown, 
//   LogOut, 
//   LogIn, 
//   UserPlus, 
//   PlusCircle, 
//   Package,
//   // LayoutDashboard 
// } from 'lucide-react';

// export default function VendorMenu() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     await signOut({ redirect: false });
//     setIsOpen(false);
//     router.push('/');
//   };

//   const handleNavigate = (path: string) => {
//     router.push(path);
//     setIsOpen(false);
//   };

//   return (
//     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
//         >
//           Vendeur
//           <ChevronDown className="ml-2 h-4 w-4" />
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="w-56">
//         {session ? (
//           <>
//             <DropdownMenuLabel className="text-sm">
//               <div className="flex flex-col space-y-1">
//                 <p className="font-semibold">{session.user?.name || 'Vendeur'}</p>
//                 <p className="text-xs text-gray-500 font-normal">
//                   {session.user?.email}
//                 </p>
//               </div>
//             </DropdownMenuLabel>
            
//             <DropdownMenuSeparator />
            
//             {/* Dashboard principal */}
//             {/* <DropdownMenuItem onClick={() => handleNavigate('/vendor-dashboard')}>
//               <LayoutDashboard className="mr-2 h-4 w-4" />
//               <span>Tableau de bord</span>
//             </DropdownMenuItem> */}

//             {/* Ajouter un produit */}
//             <DropdownMenuItem onClick={() => handleNavigate('/vendor-dashboard')}>
//               <PlusCircle className="mr-2 h-4 w-4" />
//               <span>Ajouter un produit</span>
//             </DropdownMenuItem>

//             {/* ✅ NOUVEAU : Gérer mes produits */}
//             <DropdownMenuItem 
//               onClick={() => handleNavigate('/vendors/products')}
//               className="font-medium"
//             >
//               <Package className="mr-2 h-4 w-4" />
//               <span>Gérer mes produits</span>
//             </DropdownMenuItem>

//             <DropdownMenuSeparator />

//             {/* Déconnexion */}
//             <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Déconnexion</span>
//             </DropdownMenuItem>
//           </>
//         ) : (
//           <>
//             <DropdownMenuItem onClick={() => handleNavigate('/sign-in')}>
//               <LogIn className="mr-2 h-4 w-4" />
//               <span>Se connecter</span>
//             </DropdownMenuItem>

//             <DropdownMenuItem onClick={() => handleNavigate('/sign-up')}>
//               <UserPlus className="mr-2 h-4 w-4" />
//               <span>S&apos;inscrire</span>
//             </DropdownMenuItem>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }











"use client";

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  PlusCircle, 
  Package,
} from 'lucide-react';

export default function VendorMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsOpen(false);
    router.push('/');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 rounded-md transition-colors text-sm font-medium"
      >
        Vendeur
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <>
          {/* Backdrop invisible pour fermer le menu */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-[9999] border border-gray-200">
            {session ? (
              <div className="py-1">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-sm">{session.user?.name || 'Vendeur'}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>

                {/* Ajouter un produit */}
                <button
                  onClick={() => handleNavigate('/vendor-dashboard')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Ajouter un produit</span>
                </button>

                {/* Gérer mes produits */}
                <button
                  onClick={() => handleNavigate('/vendors/products')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center font-medium transition-colors"
                >
                  <Package className="mr-2 h-4 w-4" />
                  <span>Gérer mes produits</span>
                </button>

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-1" />

                {/* Déconnexion */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center text-red-600 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="py-1">
                {/* Se connecter */}
                <button
                  onClick={() => handleNavigate('/sign-in')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center transition-colors"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Se connecter</span>
                </button>

                {/* S'inscrire */}
                <button
                  onClick={() => handleNavigate('/sign-up')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center transition-colors"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>S'inscrire</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}



































 