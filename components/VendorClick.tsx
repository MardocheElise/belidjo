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
// import { ChevronDown, LogOut, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

// export default function VendorMenu() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     await signOut({ redirect: false });
//     setIsOpen(false);
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

//       <DropdownMenuContent align="end" className="w-48">
//         {session ? (
//           <>
//             <DropdownMenuLabel className="text-sm">
//               {session.user?.email || 'Vendeur'}
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
            
//             <DropdownMenuItem onClick={() => handleNavigate('/vendor-dashboard')}>
//               <LayoutDashboard className="mr-2 h-4 w-4" />
//               Ajouter un produit
//             </DropdownMenuItem>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//               <LogOut className="mr-2 h-4 w-4" />
//               Déconnexion
//             </DropdownMenuItem>
//           </>
//         ) : (
//           <>
//             <DropdownMenuItem onClick={() => handleNavigate('/sign-in')}>
//               <LogIn className="mr-2 h-4 w-4" />
//               Se connecter
//             </DropdownMenuItem>

//             <DropdownMenuItem onClick={() => handleNavigate('/sign-up')}>
//               <UserPlus className="mr-2 h-4 w-4" />
//               S&apos;inscrire
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  LogOut, 
  LogIn, 
  UserPlus, 
  PlusCircle, 
  Package,
  // LayoutDashboard 
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
        >
          Vendeur
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {session ? (
          <>
            <DropdownMenuLabel className="text-sm">
              <div className="flex flex-col space-y-1">
                <p className="font-semibold">{session.user?.name || 'Vendeur'}</p>
                <p className="text-xs text-gray-500 font-normal">
                  {session.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            {/* Dashboard principal */}
            {/* <DropdownMenuItem onClick={() => handleNavigate('/vendor-dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </DropdownMenuItem> */}

            {/* Ajouter un produit */}
            <DropdownMenuItem onClick={() => handleNavigate('/vendor-dashboard')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Ajouter un produit</span>
            </DropdownMenuItem>

            {/* ✅ NOUVEAU : Gérer mes produits */}
            <DropdownMenuItem 
              onClick={() => handleNavigate('/vendors/products')}
              className="font-medium"
            >
              <Package className="mr-2 h-4 w-4" />
              <span>Gérer mes produits</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Déconnexion */}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleNavigate('/sign-in')}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Se connecter</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleNavigate('/sign-up')}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>S&apos;inscrire</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}