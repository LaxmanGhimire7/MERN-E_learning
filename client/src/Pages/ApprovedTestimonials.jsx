import { useEffect, useState } from "react";

function ApprovedTestimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/testimonial/getApprovedTestimonials");
        const data = await res.json();
        if (res.ok) setTestimonials(data.testimonials);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      }
    };
    fetchApprovedTestimonials();
  }, []);

  if (testimonials.length === 0) {
    return <p>No testimonials available yet.</p>;
  }

  return (
    <div className="space-y-6">
      {testimonials.map((t) => (
        <div key={t._id} className="p-4 bg-white rounded shadow">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={`http://localhost:9000/image/${t.image}`}
              alt="Student"
              className="w-12 h-12 rounded-full border"
            />
            <div>
              <p className="font-semibold">
                {t.student?.firstName
                  ? `${t.student.firstName} ${t.student.lastName}`
                  : t.student?.userName || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">{t.course?.name}</p>
            </div>
          </div>
          <p className="text-gray-700">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

export default ApprovedTestimonials;
