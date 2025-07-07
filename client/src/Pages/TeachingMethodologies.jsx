import { useState } from "react";

function TeachingMethodologies() {
  const data = [
    {
      id: "01",
      title: "Concept Explanation",
      img: "https://img.freepik.com/free-vector/working-concept-illustration_114360-330.jpg?w=360",
    },
    {
      id: "02",
      title: "Hands-on Practice",
      img: "https://www.elaconnect.in/images/Illustration_02.png",
    },
    {
      id: "03",
      title: "Student Demos And Presentation",
      img: "https://www.ahecounselling.com/assets/uploads/services/04_10_23_06_37_49_pm.jpg",
    },
    {
      id: "04",
      title: "Evaluation",
      img: "https://img.freepik.com/premium-vector/man-getting-car-loan-approved-trending-concept-flat-illustration_720185-927.jpg",
    },
    {
      id: "05",
      title: "Interview And CV Preparation",
      img: "https://media.licdn.com/dms/image/v2/D5612AQFDXKPNCgtF3w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1703068832143?e=2147483647&v=beta&t=A32ssDDYE_xoVnuRCmQZssQVo1OFtY3ypK4Kta8yg8w",
    },
     {
      id: "06",
      title: "Internships and Job Opportunities",
      img: "https://www.yeastar.com/wp-content/uploads/2020/12/call-center-reporting-blog-header.png",
    },
  ];

  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(data.length / cardsPerSlide);
  const [currentSlide, setCurrentSlide] = useState(0);

  const visibleCards = data.slice(
    currentSlide * cardsPerSlide,
    currentSlide * cardsPerSlide + cardsPerSlide
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-[#0A1E3F] mb-10">
        Our Teaching Methodology
      </h2>

      {/* Cards Container */}
      <div className="flex justify-center gap-6 flex-wrap">
        {visibleCards.map((item, index) => (
          <div
            key={index}
            className="border border-blue-300 rounded-lg p-4 w-[390px] h-[390px] flex flex-col justify-between shadow-md hover:shadow-xl transition"
          >
            {/* Step Number + Title */}
            <div className="flex items-center gap-3 text-[#0A1E3F] font-light  text-lg">
              <span className="text-2xl font-light text-blue-700">
                {item.id}
              </span>
              <span>{item.title}</span>
            </div>

            {/* Image */}
            <img
              src={item.img}
              alt={item.title}
              className="h-72 w-fit object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "bg-blue-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default TeachingMethodologies;
