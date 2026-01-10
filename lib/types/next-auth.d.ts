// {/* Hero Section */}
// <section
//   id="hero"
//   className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8"
// >
//   <div className="flex flex-col justify-center">
//     <h2 className="text-4xl font-bold text-gray-800 mb-4">
//       Votre marché universitaire
//     </h2>
//     <p className="text-gray-600 mb-6">
//       Découvrez une sélection exclusive de fruits, légumes, tubercules et
//       céréales frais soigneusement cueillis et livrés en un temps record
//       sur le campus.
//     </p>
    
//     {/* Badge et Filter Container */}
//     <div className="flex items-center gap-4">
//       {/* Badge "Achetez maintenant" */}
//       <div className="bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer rounded-full px-6 py-3 text-white font-medium text-lg shadow-md">
//         Achetez maintenant
//       </div>
      
//       {/* Dropdown Filter */}
//       <div className="relative">
//         <select className="appearance-none bg-white border-2 border-orange-500 text-orange-500 font-medium rounded-full px-6 py-3 pr-10 cursor-pointer hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400">
//           <option value="">Filtrer</option>
//           <option value="fruits">Fruits</option>
//           <option value="legumes">Légumes</option>
//           <option value="autres">Autres</option>
//         </select>
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//           <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <div className="relative flex justify-center items-center">
//     <Image
//       src="/salade.jpeg"
//       alt="image"
//       width={350}
//       height={350}
//       className="rounded-2xl"
//     />
//   </div>
// </section>