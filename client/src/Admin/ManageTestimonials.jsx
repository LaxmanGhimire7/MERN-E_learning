import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

import { FiRefreshCw } from "react-icons/fi";
import { HiCheck, HiTrash } from "react-icons/hi";
import { IoChevronDown, IoChatbubblesOutline } from "react-icons/io5";

function ManageTestimonials() {
  const { state } = useContext(AuthContext);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
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
      } else {
        toast.error(data.msg || "Error fetching testimonials");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
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
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "approved") return t.isApproved;
    if (filter === "pending") return !t.isApproved;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
          <p className="text-gray-600 mt-2">Review, approve, and manage student testimonials</p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Testimonials</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IoChevronDown className="h-4 w-4" />
            </div>
          </div>
          <button
            onClick={fetchTestimonials}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center hover:bg-gray-50 transition-colors"
            title="Refresh testimonials"
          >
            <FiRefreshCw className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <IoChatbubblesOutline className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No testimonials found</h3>
          <p className="mt-2 text-gray-500">
            {filter === "approved"
              ? "There are no approved testimonials."
              : filter === "pending"
              ? "All testimonials are approved. Great work!"
              : "No testimonials have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map((t) => (
            <div
              key={t._id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                expandedId === t._id ? "ring-2 ring-blue-500" : "hover:shadow-md"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={`http://localhost:9000/image/${t.image}`}
                      alt="Student"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                      }}
                    />
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t.student?.firstName
                            ? `${t.student.firstName} ${t.student.lastName}`
                            : t.student?.userName || "Anonymous"}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">{t.course?.name}</p>
                      </div>

                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          t.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {t.isApproved ? "Approved" : "Pending"}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className={`text-gray-700 ${expandedId === t._id ? "" : "line-clamp-3"}`}>
                        {t.message}
                      </div>

                      <button
                        onClick={() => toggleExpand(t._id)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedId === t._id ? "Show less" : "Read more"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end space-x-3">
                  {!t.isApproved && (
                    <button
                      onClick={() => handleApprove(t._id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <HiCheck className="-ml-1 mr-2 h-4 w-4" />
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <HiTrash className="-ml-1 mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 flex items-center justify-between">
                <div>
                  Submitted on:{" "}
                  {new Date(t.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div>ID: {t._id}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredTestimonials.length} of {testimonials.length} testimonials
        </div>
        {filteredTestimonials.length > 0 && (
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageTestimonials;
