import aboutbackground from "../images/aboutbackground.png";

function AboutUs() {
  return (
    <div>
      <div
        className="p-20 space-y-4"
        style={{
          backgroundImage: ` url(${aboutbackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <h1 className="text-3xl font-semibold text-blue-900">Our Story</h1>
        <p className="font-sans text-2xl">
          Make learning and teaching more effective through active <br />
          participation and student collaboration!
        </p>
      </div>

      {/* Background */}
      <div className="p-20 space-y-3 ">
        <h1 className="text-3xl text-blue-900 font-semibold">Background</h1>
        <p className="text-2xl font-light font-serif">
          Sipalaya Info Tech empowers professionals and students in the tech
          industry with tailored, top-notch training programs. Our expert
          instructors, with extensive industry experience, provide personalized
          support. We offer interactive, hands-on courses covering the latest
          technologies. We've helped countless individuals elevate their
          careers. Join us to achieve your goals confidently.
        </p>
      </div>

      
    </div>
  );
}

export default AboutUs;
