import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[80vh]">

      {/* Text Content */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Take Control of Your <span className="text-indigo-600">Expenses</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Our Expense Tracker helps you manage your personal finances effortlessly. Track your spending, visualize your expenses, and stay on top of your budget—anytime, anywhere.
        </p>
        <Link 
          to="/signup" 
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Get Started
        </Link>
      </div>

      {/* Image or Illustration */}
      {/* <div className="flex-1 flex justify-center">
        <img 
          src="frontend\src\assets\teacker.png" 
          alt="Expense Tracker Illustration"
          className="max-w-[400px] w-full"
        />
      </div> */}


    </section>
  );
};

export default Banner;
