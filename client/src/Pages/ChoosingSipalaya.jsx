import { FaAward } from "react-icons/fa";
import homebackground from "../images/homebackground.png";
import secondaryImage from "../images/homebackground.png";

function ChoosingSipalaya() {
  const steps = [
    {
      title: "Students Graduated",
      description:
        "Over 5,000 students have successfully graduated from Sipalaya, marking a significant achievement in education and community development.",
    },
    {
      title: "Industry Mentors",
      description:
        "Sipalaya boasts 30+ industry mentors who provide expert guidance and real-world insights to students.",
    },
    {
      title: "Flexible Time",
      description:
        "Sipalaya offers flexible class timings, allowing students to learn at their own pace and convenience.",
    },
    {
      title: "Hiring Partners",
      description:
        "Sipalaya has partnered with 50+ hiring companies, ensuring excellent job opportunities for its graduates.",
    },
    {
      title: "Coding Questions",
      description:
        "Sipalaya provides access to 500+ interview coding questions to help students excel in technical assessments and job interviews.",
    },
    {
      title: "Career Support",
      description:
        "Sipalaya offers dedicated 1:1 career support to help students achieve their professional goals with personalized guidance.",
    },
    {
      title: "Salary Range",
      description:
        "Graduates from Sipalaya earn competitive salaries ranging from ₹3L to ₹10L per annum, reflecting the high-quality education and industry-relevant skills they acquire.",
    },
    {
      title: "Expert Instructors",
      description:
        "Sipalaya's expert instructors bring industry experience and in-depth knowledge to provide top-quality education.",
    },
  ];

  return (
    <div className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT SIDE - IMAGES */}
        <div className="relative w-full lg:w-1/2 flex justify-center">
          <img
            src={homebackground}
            alt="Sipalaya Classroom"
            className="rounded-xl shadow-2xl w-4/5 transition-transform duration-500 hover:scale-105"
          />
          <img
            src={secondaryImage}
            alt="Students"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl w-2/3 border-4 border-white opacity-90 transition-transform duration-500 hover:scale-110"
          />
        </div>

        {/* RIGHT SIDE - TEXT */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center mb-8">
            <FaAward className="text-yellow-400 text-5xl mr-4 animate-pulse" />
            <div>
              <h2 className="text-5xl font-extrabold text-blue-900 mb-1">#1</h2>
              <p className="text-lg text-gray-700">Professional IT Training Institute in Nepal</p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 group hover:bg-white hover:shadow-lg transition duration-300 p-3 rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold group-hover:bg-blue-700 transition-colors duration-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChoosingSipalaya;
