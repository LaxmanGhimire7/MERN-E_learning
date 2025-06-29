import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

function ManageTestimonials() {
  const { state } = useContext(AuthContext);
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(
        "http://localhost:9000/api/testimonial/getAllTestimonials",
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials);
        // ✅ Log student name for debugging
        data.testimonials.forEach((t) => {
          console.log("Student Name:", t.student?.name || "Unknown");
        });
      } else {
        toast.error(data.msg || "Error fetching testimonials");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/testimonial/approveTestimonial/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Testimonial approved");
        fetchTestimonials();
      } else toast.error(data.msg);
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/testimonial/deleteTestimonial/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      } else toast.error(data.msg);
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Testimonials</h2>
      {testimonials.length === 0 ? (
        <p>No testimonials yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center gap-4 mb-2 sm:mb-0">
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
              <div className="mt-2 sm:mt-0 sm:ml-4 flex-1">
                <p className="text-gray-700 mb-2">{t.message}</p>
                <div>
                  {!t.isApproved && (
                    <button
                      onClick={() => handleApprove(t._id)}
                      className="text-white bg-green-500 px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-white bg-red-500 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageTestimonials;
