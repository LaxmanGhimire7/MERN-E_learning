import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function AddCourseDetails() {
  const { courseId } = useParams();

  const [formData, setFormData] = useState({
    overview: "",
    demandsAndScopes: "",
    opportunities: "",
    requirement: [""],
    whatYouWillLearn: {
      section1Title: "",
      section1Points: [""],
      section2Title: "",
      section2Points: [""],
    },
  });

  const [expandedSections, setExpandedSections] = useState({
    section1: true,
    section2: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("whatYouWillLearn.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        whatYouWillLearn: {
          ...prev.whatYouWillLearn,
          [key]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, index, field) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleSectionPointsChange = (e, index, section) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = [...prev.whatYouWillLearn[section]];
      updated[index] = value;
      return {
        ...prev,
        whatYouWillLearn: {
          ...prev.whatYouWillLearn,
          [section]: updated,
        },
      };
    });
  };

  const handleAddInput = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleAddPoint = (section) => {
    setFormData((prev) => ({
      ...prev,
      whatYouWillLearn: {
        ...prev.whatYouWillLearn,
        [section]: [...prev.whatYouWillLearn[section], ""],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = new FormData();
    for (const key in formData) {
      if (key === "requirement" || key === "whatYouWillLearn") {
        finalData.append(key, JSON.stringify(formData[key]));
      } else {
        finalData.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(`http://localhost:9000/api/course/editCourseDetails/${courseId}`, {
        method: "PUT",
        body: finalData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Course details added successfully!");
      } else {
        toast.error(data.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error while submitting");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6 mt-8 mb-12"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Add Details for Course ID: {courseId}
      </h2>

      {/* Overview, Demands, Opportunities */}
      <textarea
        name="overview"
        value={formData.overview}
        onChange={handleChange}
        placeholder="Course Overview"
        className="w-full px-4 py-2 border rounded mb-3"
      />
      <textarea
        name="demandsAndScopes"
        value={formData.demandsAndScopes}
        onChange={handleChange}
        placeholder="Demands & Scopes"
        className="w-full px-4 py-2 border rounded mb-3"
      />
      <textarea
        name="opportunities"
        value={formData.opportunities}
        onChange={handleChange}
        placeholder="Opportunities"
        className="w-full px-4 py-2 border rounded mb-3"
      />

      {/* Requirements */}
      <h3 className="text-lg font-semibold">Requirements</h3>
      {formData.requirement.map((item, idx) => (
        <input
          key={idx}
          type="text"
          value={item}
          onChange={(e) => handleArrayChange(e, idx, "requirement")}
          className="w-full px-4 py-2 border rounded mb-2"
        />
      ))}
      <button
        type="button"
        onClick={() => handleAddInput("requirement")}
        className="text-sm text-blue-600 mb-3 underline"
      >
        + Add Requirement
      </button>

      {/* What You Will Learn Accordion */}
      <h3 className="text-xl font-bold mt-6 mb-2 text-blue-700">What You Will Learn</h3>

      {/* Section 1 */}
      <div className="border rounded mb-4">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200"
          onClick={() => toggleSection("section1")}
        >
          {formData.whatYouWillLearn.section1Title || "Section 1"}
          {expandedSections.section1 ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.section1 && (
          <div className="p-4 space-y-2">
            <input
              type="text"
              name="whatYouWillLearn.section1Title"
              value={formData.whatYouWillLearn.section1Title}
              onChange={handleChange}
              placeholder="Section 1 Title"
              className="w-full px-4 py-2 border rounded"
            />
            {formData.whatYouWillLearn.section1Points.map((point, idx) => (
              <input
                key={idx}
                type="text"
                value={point}
                onChange={(e) =>
                  handleSectionPointsChange(e, idx, "section1Points")
                }
                className="w-full px-4 py-2 border rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddPoint("section1Points")}
              className="text-sm text-blue-600 underline"
            >
              + Add Point
            </button>
          </div>
        )}
      </div>

      {/* Section 2 */}
      <div className="border rounded mb-4">
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-2 font-semibold bg-gray-100 hover:bg-gray-200"
          onClick={() => toggleSection("section2")}
        >
          {formData.whatYouWillLearn.section2Title || "Section 2"}
          {expandedSections.section2 ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {expandedSections.section2 && (
          <div className="p-4 space-y-2">
            <input
              type="text"
              name="whatYouWillLearn.section2Title"
              value={formData.whatYouWillLearn.section2Title}
              onChange={handleChange}
              placeholder="Section 2 Title"
              className="w-full px-4 py-2 border rounded"
            />
            {formData.whatYouWillLearn.section2Points.map((point, idx) => (
              <input
                key={idx}
                type="text"
                value={point}
                onChange={(e) =>
                  handleSectionPointsChange(e, idx, "section2Points")
                }
                className="w-full px-4 py-2 border rounded"
              />
            ))}
            <button
              type="button"
              onClick={() => handleAddPoint("section2Points")}
              className="text-sm text-blue-600 underline"
            >
              + Add Point
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit Course Description
      </button>
    </form>
  );
}

export default AddCourseDetails;
