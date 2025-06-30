import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

function ApprovedTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  console.log(testimonials)
  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:9000/api/testimonial/getApprovedTestimonials");
        const data = await res.json();
        if (res.ok) setTestimonials(data.testimonials);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovedTestimonials();
  },[]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <FaQuoteLeft className="text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No testimonials yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Our students haven't shared their experiences yet. Be the first to share your success story!
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-blue-600">Students Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our successful students about their learning experiences
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-24 bg-blue-500 rounded-full"></div>
          </div>
        </div>

        <div className="relative">
          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t, index) => (
              <div 
                key={t._id} 
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform ${
                  activeIndex === index 
                    ? "scale-105 shadow-xl ring-2 ring-blue-200" 
                    : "scale-95 opacity-90"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full mr-4">
                        <div className="mt-6 flex justify-center">
                    <div className="relative">
                      <img
                        src={`http://localhost:9000/image/${t.image}`}
                        alt="Student"
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                  </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                           {t.student?.firstName
                            ? `${t.student.firstName} ${t.student.lastName}`
                            : t.student?.userName || "Anonymous"}
                        </h4>
                        <p className="text-sm text-blue-600 font-medium">{t.course?.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 italic relative pl-8">
                    <FaQuoteLeft className="text-blue-200 text-4xl absolute -left-2 -top-3" />
                    {t.message}
                  </p>
                  
                 
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index 
                    ? "bg-blue-600 w-6" 
                    : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}

export default ApprovedTestimonials;