import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";

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
      section3Title: "",
      section3Points: [""],
      section4Title: "",
      section4Points: [""],
    },
    language: "",
    period: "",
    categories: "",
    tagline: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    section1: true,
    section2: true,
    section3: false,
    section4: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("whatYouWillLearn.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        whatYouWillLearn: {
          ...prev.whatYouWillLearn,
          [key]: value,
        },
      }));
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

    // Prepare FormData for submission, stringify arrays/objects as needed
    const finalData = new FormData();

    for (const key in formData) {
      if (key === "requirement" || key === "whatYouWillLearn") {
        finalData.append(key, JSON.stringify(formData[key]));
      } else {
        finalData.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(
        `http://localhost:9000/api/course/editCourseDetails/${courseId}`,
        {
          method: "PUT",
          body: finalData,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Course details updated successfully!");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error while submitting");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6 mt-10 mb-12"
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Add / Edit Extra Details for Course ID: {courseId}
      </h2>

      {/* Tagline */}
      <input
        type="text"
        name="tagline"
        value={formData.tagline}
        onChange={handleChange}
        placeholder="Course Tagline"
        className="w-full px-4 py-2 border rounded"
      />

      {/* Overview */}
      <textarea
        name="overview"
        value={formData.overview}
        onChange={handleChange}
        placeholder="Course Overview"
        className="w-full px-4 py-2 border rounded"
      />

      {/* Demands & Scopes */}
      <textarea
        name="demandsAndScopes"
        value={formData.demandsAndScopes}
        onChange={handleChange}
        placeholder="Industry Demands & Scope"
        className="w-full px-4 py-2 border rounded"
      />

      {/* Opportunities */}
      <textarea
        name="opportunities"
        value={formData.opportunities}
        onChange={handleChange}
        placeholder="Career Opportunities"
        className="w-full px-4 py-2 border rounded"
      />

      {/* Requirements */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
        {formData.requirement.map((item, idx) => (
          <input
            key={idx}
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(e, idx, "requirement")}
            className="w-full px-4 py-2 border rounded mb-2"
            placeholder={`Requirement ${idx + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={() => handleAddInput("requirement")}
          className="text-blue-600 text-sm font-medium flex items-center gap-1"
        >
          <FaPlus /> Add More
        </button>
      </div>

      {/* What You Will Learn Sections */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-blue-700 mb-4">What You Will Learn</h3>

        {["section1", "section2", "section3", "section4"].map((sectionKey, idx) => (
          <div key={sectionKey} className="border rounded mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-2 font-semibold bg-gray-100"
              onClick={() => toggleSection(sectionKey)}
            >
              {formData.whatYouWillLearn[`${sectionKey}Title`] || `Section ${idx + 1}`}
              {expandedSections[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {expandedSections[sectionKey] && (
              <div className="p-4 space-y-2">
                <input
                  type="text"
                  name={`whatYouWillLearn.${sectionKey}Title`}
                  value={formData.whatYouWillLearn[`${sectionKey}Title`]}
                  onChange={handleChange}
                  placeholder={`Section ${idx + 1} Title`}
                  className="w-full px-4 py-2 border rounded"
                />
                {formData.whatYouWillLearn[`${sectionKey}Points`].map((point, idx2) => (
                  <input
                    key={idx2}
                    type="text"
                    value={point}
                    onChange={(e) =>
                      handleSectionPointsChange(e, idx2, `${sectionKey}Points`)
                    }
                    className="w-full px-4 py-2 border rounded"
                    placeholder={`Point ${idx2 + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleAddPoint(`${sectionKey}Points`)}
                  className="text-blue-600 text-sm font-medium flex items-center gap-1"
                >
                  <FaPlus /> Add Point
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Language */}
      <select
        name="language"
        value={formData.language}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">Select Language</option>
        <option value="English">English</option>
        <option value="Nepali">Nepali</option>
     
        {/* add more languages if needed */}
      </select>

      {/* Period */}
      <select
        name="period"
        value={formData.period}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">Select Period</option>
        <option value="Short-term">Short-term</option>
        <option value="Long-term">Long-term</option>
      </select>

      {/* Categories */}
      <select
        name="categories"
        value={formData.categories}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">Select Category</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Advanced">All Level</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
      >
        Submit Course Details
      </button>
    </form>
  );
}

export default AddCourseDetails;
