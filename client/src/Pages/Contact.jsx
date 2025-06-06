

import contact from "../images/contact.png";
import Footer from "./Footer";

function Contact() {
  return (
    <>
      <div className="bg-white">
        <h1 className="text-4xl text-blue-900 text-center font-bold py-10">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 -mt-6 mb-10">
          We'd love to hear from you! Please get in touch with us.
        </p>

        {/* Banner */}
       <div className="bg-[linear-gradient(135deg,_#2f3493_70%,_white_50%,_#ffc107_80%)] h-52 w-full text-white mt-24 relative">
          <img
            className="absolute left-[990px] -top-20 h-72 w-96"
            src={contact}
            alt=""
          />

          <div className="absolute top-2 font-serif text-2xl ml-10 p-5">
            <p className="relative top-10">
              Please feel free to leave us a message regarding any inquiries.{" "}
              <br />
              Our team will get in touch with you as soon as possible.
            </p>
          </div>
        </div> 

        {/* Main Section: Map + Form */}
        <div className="flex flex-col lg:flex-row justify-center gap-10 px-6 py-28 lg:px-20 mb-20">
          {/* Map */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3358.647360962505!2d85.34317037525248!3d27.67152297620314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190536c1caa7%3A0xf92fcf603dac3960!2sSipalaya%20Info%20Tech%20Pvt.%20Ltd.!5e1!3m2!1sen!2snp!4v1749235048476!5m2!1sen!2snp"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Contact Form */}
          <div className="flex-1 bg-gray-50 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-900">
              Get In Touch
            </h2>
            <p className="text-gray-600 mb-6">
              We look forward to hearing from you and helping you succeed in
              your career.
            </p>

            <form className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-700">
                  Full Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-medium text-gray-700">
                  Email<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="course" className="block font-medium text-gray-700">
                  Course<span className="text-red-600">*</span>
                </label>
                <select
                  id="course"
                  required
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  <option value="web">Web Development</option>
                  <option value="ai">AI & Machine Learning</option>
                  <option value="cloud">Cloud Computing</option>
                  <option value="graphic">Graphic Design</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  placeholder="Write your message here..."
                  className="w-full border border-gray-300 rounded-md p-3 mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-4 bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Contact;


