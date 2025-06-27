import React, { useState } from "react";

function Partnership() {

  const images = [
    "https://edigitalnepal.com/ca/files/school-logos/1688282175475_81fb8a78-16a6-4b61-8c8e-d8bcb31f5367.png",
    "https://blog.daraz.com.np/wp-content/uploads/2019/02/Daraz-Logo_colorful.png",
    "https://imegroup.com.np/wp-content/uploads/2023/01/logo.svg",
    "https://eaccount.gibl.com.np/static/media/gibl_logo.eb3e1394.png",
    "https://pngimg.com/d/google_PNG19644.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    "https://play-lh.googleusercontent.com/XgPMfb6xTqe-4lpJd_XikSM061A8mCG0VIJZdlHKrwI35h4-RnHbF844nDiqXW1VYkw=w600-h300-pc0xffffff-pd",
    "https://ismt.edu.np/Frontend/assets/images/logos/logo-sunderland.png",
    "https://images.seeklogo.com/logo-png/16/2/microsoft-logo-png_seeklogo-168319.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png",
    "https://cdn.uconnectlabs.com/wp-content/uploads/sites/46/2022/08/Linkedin-Logo-e1660320077673.png",
    "https://www.nepalminute.com/uploads/posts/Nabil%20Logo%201619X145%20logo-21670222542.png"   
  ];

  const imagesPerSlide = 4;
  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);

  const visibleImages = images.slice(
    currentSlide * imagesPerSlide,
    currentSlide * imagesPerSlide + imagesPerSlide
  );

  return (
    <div className="max-w-5xl mx-auto p-4">

        <h1 className="text-xl text-blue-900">We've been trusted by more than 200+ corporate clients such as:</h1>
  
      <div className="flex space-x-9 mt-5  ">
        {visibleImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="images"
            className="w-60 h-32 object-contain border-2 mt-6 border-gray-50 rounded-2xl "
          />
        ))}
      </div>


      <div className="flex justify-center mt-8 space-x-3 ">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-4 h-4 rounded-full cursor-pointer ${
              currentSlide === idx ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Partnership;
