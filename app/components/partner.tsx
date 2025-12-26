'use client'; // Next.js ашиглаж байгаа бол заавал байх ёстой

import React from 'react';

const Partner = () => {
  const logos = [
    { name: 'Logo 1', url: 'https://cdn.brandfetch.io/google.com/fallback/lettermark' },
    { name: 'Logo 2', url: 'https://cdn.brandfetch.io/facebook.com/fallback/lettermark' },
    { name: 'Logo 3', url: 'https://cdn.brandfetch.io/amazon.com/fallback/lettermark' },
    { name: 'Logo 4', url: 'https://cdn.brandfetch.io/apple.com/fallback/lettermark' },
    { name: 'Logo 5', url: 'https://cdn.brandfetch.io/microsoft.com/fallback/lettermark' },
    { name: 'Logo 6', url: 'https://cdn.brandfetch.io/netflix.com/fallback/lettermark' },
  ];

  return (
    <div className="w-full py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h3 className="text-center text-black font-bold text-lg uppercase">
          Хамтран ажиллагч байгууллагууд
        </h3>
      </div>

      {/* Infinite Scroll Container */}
      {/* "group" класс нэмсэн: Энэ нь container дээр hover хийхэд animation ажиллахад тусална */}
      <div className="relative flex overflow-hidden group">
        
        {/* Animation нь зөвхөн group-hover үед ажиллана [animation-play-state:paused] - анхнаасаа зогсолттой байна */}
        <div className="flex animate-scroll [animation-play-state:paused] group-hover:[animation-play-state:running] whitespace-nowrap">
          
          {/* Логонуудыг 2 удаа map хийж тасралтгүй гүйлтийг үүсгэнэ */}
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex items-center justify-center mx-12 w-32 h-16">
              <img
                src={logo.url}
                alt={logo.name}
                className="max-h-full max-w-full object-contain" 
              />
            </div>
          ))}
        </div>

        {/* Custom CSS */}
        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: scroll 20s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Partner;