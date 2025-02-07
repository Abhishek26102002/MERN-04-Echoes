
const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-primary/10 ${
                  i % 2 === 0 ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;

// import { useState, useEffect } from "react";

// const AuthImagePattern = ({ title, subtitle }) => {
//   const [images, setImages] = useState([]);
//   const UNSPLASH_ACCESS_KEY = "6zw_HpIphdOSZyZEdmTYET3zDfHzFBYELyGsvDKt_Dg"; 

//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await fetch(
//           `https://api.unsplash.com/search/photos?query=chatting%20apps&per_page=9&client_id=${UNSPLASH_ACCESS_KEY}`
//         );
//         const data = await response.json();
//         setImages(data.results.map((img) => img.urls.small)); // Extract small-sized images
//       } catch (error) {
//         console.error("Error fetching images:", error);
//       }
//     };

//     fetchImages();
//   }, []);

//   return (
//     <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
//       <div className="max-w-md text-center">
//         <div className="grid grid-cols-3 gap-3 mb-8">
//           {images.length > 0
//             ? images.map((url, i) => (
//                 <img
//                   key={i}
//                   src={url}
//                   alt={`Chatting app ${i}`}
//                   className="aspect-square rounded-2xl object-cover"
//                 />
//               ))
//             : [...Array(9)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="aspect-square rounded-2xl bg-primary/10 animate-pulse"
//                 />
//               ))}
//         </div>
//         <h2 className="text-2xl font-bold mb-4">{title}</h2>
//         <p className="text-base-content/60">{subtitle}</p>
//       </div>
//     </div>
//   );
// };

// export default AuthImagePattern;
