import CommonWrapper from "@/common/CommonWrapper";
import DynamicTableExample from "@/common/DynamicTable/TableExampleAndGuide/DynamicTableExamples";
const Home = () => {
  return (
    <CommonWrapper>
      <div className="w-full py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Elevate Your Kitchen Experience
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                Premium cookware crafted with precision, durability, and
                timeless design—so you can cook with confidence and joy.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => {
                    const section = document.getElementById("products");
                    if (section) section.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <img
                  src="https://res.cloudinary.com/dgehg6ds1/image/upload/v1762495171/WhatsApp_Image_2025-11-07_at_11.55.25_AM_1_2_eu8flv.webp"
                  alt="Premium kitchen cookware set on wooden countertop"
                  className="rounded-2xl shadow-xl object-cover w-full h-auto"
                  loading="lazy"
                />
                {/* Optional decorative accent */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-400 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DynamicTableExample />
    </CommonWrapper>
  );
};

export default Home;
