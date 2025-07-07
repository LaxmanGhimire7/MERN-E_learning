import { NavLink } from "react-router-dom";
import aboutbackground from "../images/aboutbackground.png";
import ceoImage from "../images/ceoImage.jpg"; 
import instructorImage from "../images/instructorImage.jpg"; 
import teamImage from "../images/teamImage.jpg";

function AboutUs() {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div
        className="relative p-20 flex flex-col justify-center"
        style={{
          backgroundImage: `url(${aboutbackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-6">
          <h1 className="text-4xl font-extrabold tracking-wide">Our Story</h1>
          <p className="text-xl sm:text-2xl font-light leading-relaxed">
            Make learning and teaching more effective through active{" "}
            <br className="hidden sm:block" />
            participation and student collaboration!
          </p>
          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-full font-semibold shadow-lg transition duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Background Section */}
      <div className="p-12 max-w-5xl mx-auto space-y-10">
        <section>
          <h2 className="text-3xl text-blue-900 font-bold border-b-4 border-orange-500 inline-block pb-2">
            Background
          </h2>
          <p className="text-lg font-serif leading-relaxed text-gray-700 mt-4">
            Sipalaya InfoTech is a leading IT Learning Academy in Nepal,
            passionately committed to equipping individuals with in-demand
            skills to thrive in today's digital age. Since our inception, we’ve
            bridged the gap between traditional education and the evolving needs
            of the IT industry through immersive, practical training led by
            industry professionals.
          </p>
        </section>

        {/* Vision & Mission */}
        <section>
          <h2 className="text-3xl font-bold text-blue-900 mb-4 border-b-4 border-orange-500 inline-block pb-2">
            Our Vision
          </h2>
          <p className="text-lg text-gray-700">
            To be a premier IT Learning Academy, driving digital transformation
            through education and innovation, and empowering individuals and
            businesses to achieve their full potential in the digital world.
          </p>

          <h2 className="text-3xl font-bold text-blue-900 mt-10 mb-4 border-b-4 border-orange-500 inline-block pb-2">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700">
            To empower individuals and elevate Nepal as a global digital leader
            by delivering exceptional IT education and knowledge. We provide
            comprehensive, industry-relevant training programs that equip
            learners with cutting-edge skills and real-world experiences.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-bold text-blue-900 mb-6 border-b-4 border-orange-500 inline-block pb-2">
            Our Core Values
          </h2>
          <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
            <li>
              <strong>Student Success:</strong> Our North Star. We celebrate our
              students’ achievements as our own.
            </li>
            <li>
              <strong>Practical Experience:</strong> True mastery through
              real-world, hands-on learning.
            </li>
            <li>
              <strong>Continuous Learning:</strong> We never stop evolving —
              neither should our students.
            </li>
            <li>
              <strong>Integrity & Transparency:</strong> We operate with
              fairness and honesty in all our actions.
            </li>
            <li>
              <strong>Quality & Relevance:</strong> Curriculum aligned with the
              latest industry demands.
            </li>
            <li>
              <strong>Industry Collaboration:</strong> Bridging the academic and
              professional world.
            </li>
            <li>
              <strong>Inclusivity & Accessibility:</strong> Opportunities for
              learners of all backgrounds.
            </li>
            <li>
              <strong>Innovation & Research:</strong> Staying ahead of emerging
              technologies to lead, not follow.
            </li>
          </ul>
        </section>

        {/* Highlights */}
        <section>
          <h2 className="text-3xl font-bold text-blue-900 mb-4 border-b-4 border-orange-500 inline-block pb-2">
            Why Choose Sipalaya InfoTech?
          </h2>
          <ul className="list-none space-y-4 text-gray-700 text-lg font-light">
            {[
              "Tailored training programs designed for professionals and students",
              "Expert instructors with real-world industry experience",
              "Interactive, hands-on courses focusing on latest technologies",
              "Personalized mentorship and career support",
              "A growing community of tech learners and professionals",
              "Hybrid learning (Physical, Remote & Blended Modes)",
              "Modern infrastructures mirroring real-world IT environments",
              "Job placement assistance and strong industry connections",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-orange-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Team Images */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10 text-center">
          <div>
            <img
              src={ceoImage}
              alt="CEO"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <h3 className="mt-4 font-semibold text-blue-900 text-lg">
              CEO - Sipalaya InfoTech
            </h3>
          </div>
          <div>
            <img
              src={instructorImage}
              alt="Instructors"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <h3 className="mt-4 font-semibold text-blue-900 text-lg">
              Our Expert Instructors
            </h3>
          </div>
          <div>
            <img
              src={teamImage}
              alt="Our Team"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <h3 className="mt-4 font-semibold text-blue-900 text-lg">
              Meet the Team
            </h3>
          </div>
        </section>

     
        <div className="text-center mt-16">
          <NavLink to="/allCourses" className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-4 rounded-lg shadow-lg font-semibold text-lg transition duration-300">
            Join Our Courses Today
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
