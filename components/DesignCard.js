// 'use client'
// import Link from "next/link";
// import Image from "next/image"; // Uncomment if you use Image

// interface DesignCardProps {
//   title: string;
//   description: string;
//   link: string;
//   logo?: string; // Optional logo property
//   [key: string]: any; // Allow for any additional props
// }

// const DesignCard = ({ title, description, link, logo, ...rest }) => {
//   return (
//     <Link href={link} {...rest}>
//       <div className="border shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] rounded p-4 w-full">
//         {logo && (
//           <div className="mb-2">
//             {/* If you're using Next.js Image component, uncomment the line below */}
//             {/* <Image src={logo} alt={`${title} logo`} width={50} height={50} /> */}
//             {/* Otherwise, if it's a URL or path, use an <img> tag */}
//             <img src={logo} alt={`${title} logo`} className="w-12 h-12" />
//           </div>
//         )}
//         <h3 className="text-lg font-bold text-left mt-2 text-gray-900 dark:text-gray-100">
//           {title}
//         </h3>
//         <p className="mt-1 text-gray-700 dark:text-gray-400">{description}</p>
//       </div>
//     </Link>
//   );
// };

// export default DesignCard;
