import aboutbackground from "../images/aboutbackground.png";

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
      <div className="p-12 max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl text-blue-900 font-bold border-b-4 border-orange-500 inline-block pb-2">
          Background
        </h2>
        <p className="text-lg font-serif leading-relaxed text-gray-700">
          Sipalaya Info Tech empowers professionals and students in the tech
          industry with tailored, top-notch training programs. Our expert
          instructors, with extensive industry experience, provide personalized
          support. We offer interactive, hands-on courses covering the latest
          technologies. We've helped countless individuals elevate their
          careers. Join us to achieve your goals confidently.
        </p>

        {/* Highlights */}
        <ul className="list-none space-y-4 text-gray-700 text-lg font-light">
          {[
            "Tailored training programs designed for professionals and students",
            "Expert instructors with real-world industry experience",
            "Interactive, hands-on courses focusing on latest technologies",
            "Personalized mentorship and career support",
            "A growing community of tech learners and professionals",
          ].map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-orange-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3. org/2000/svg"
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

        {/* Call to Action */}
        <div className="text-center mt-10">
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg shadow-lg font-semibold transition duration-300">
            Join Our Courses Today
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
