import { useState, useEffect } from "react";
import sipalayalogo from "../assets/sipalayalogo.png";

function AnnouncementHeader() {
  const [activeIndex, setActiveIndex] = useState(0);

  const announcements = [
    "🎉 New Python & Data Science Course Launched!",
    "🔥 Web Development, Graphic Designing OnGoing - Enroll Now!",
    "💼 10% Discount for January Batch!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white py-2 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo with subtle glow */}
        <img
          src={sipalayalogo}
          alt="Logo"
          className="h-14 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:drop-shadow-glow"
        />

        {/* Enhanced Announcements Container */}
        <div className="flex-1 mx-8">
          <div className="relative h-12 overflow-hidden">
            {announcements.map((text, index) => (
              <div
                key={index}
                className={`absolute w-full flex items-center justify-center
                  text-xl font-bold text-white tracking-wide transition-all duration-500
                  ${
                    index === activeIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-6"
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="bg-white/10 backdrop-blur-sm px-6 py-2 text-blue-950 rounded-full">
                    {text}
                  </span>
                  <span className="text-2xl animate-float delay-100">🎓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnouncementHeader;
