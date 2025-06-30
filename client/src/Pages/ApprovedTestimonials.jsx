import { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";

function ApprovedTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/testimonial/getApprovedTestimonials");
        const data = await res.json();
        if (res.ok) setTestimonials(data.testimonials);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleDotClick = (index) => setActiveIndex(index);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center max-w-3xl mx-auto my-16 shadow-sm border border-blue-100">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <FaQuoteLeft className="text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No testimonials yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our students haven't shared their experiences yet. Be the first to share your success story!
        </p>
      </div>
    );
  }

  const active = testimonials[activeIndex];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-left">GRAB THE BEST OF</h2>
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12 text-left">
          How can Sipalaya transform your <span className="text-blue-600">career?</span>
        </h3>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Text Testimonial */}
          <div className="flex-1 bg-white shadow-lg rounded-2xl p-8 h-80  relative">
            <FaQuoteLeft className="text-blue-400 text-3xl mb-4" />
            <p className="text-gray-700 text-lg mb-6">
              {active.message.length > 250 ? active.message.slice(0, 550) + "..." : active.message}
            </p>
            <div className="flex items-center mt-6">
              <img
                src={`http://localhost:9000/image/${active.image}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
                className="w-12 h-12 rounded-full object-cover mr-4"
                alt="student"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {active.student?.firstName
                    ? `${active.student.firstName} ${active.student.lastName}`
                    : active.student?.userName || "Anonymous"}
                </p>
                <p className="text-gray-500 text-sm">{active.course?.name}</p>
              </div>
            </div>
          </div>

          {/* Placeholder for Video Testimonial UI only */}
          <div className="flex-1 bg-blue-700 text-white rounded-2xl overflow-hidden relative">
            <img
              src="/testimonial-video-preview.jpg"
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <p className="text-2xl font-semibold">{active.student?.firstName || "Student"}</p>
              <p className="text-base mt-1">{active.course?.name}</p>
              <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center mt-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-between items-center mt-10 px-4">
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-3 rounded-full transition-all duration-300 ease-in-out w-3 ${
                  activeIndex === index ? "bg-blue-600 w-5" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="text-blue-600 text-sm space-x-8">
            <button onClick={() => handleDotClick((activeIndex + 1) % testimonials.length)}>read more</button>
            <a href="/testimonials" className="hover:underline">
              view more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApprovedTestimonials;
