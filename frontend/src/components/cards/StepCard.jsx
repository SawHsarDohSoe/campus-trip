function StepCard({ number, title, description }) {
  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200">

      {/* Step Number */}
      <div className="w-16 h-16 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold shadow-lg transition duration-300 group-hover:scale-110">
        {number}
      </div>

      {/* Content */}
      <div className="pt-8">
        <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">
          {title}
        </h3>

        <p className="text-gray-600 leading-7">
          {description}
        </p>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#1E3A8A] rounded-b-3xl transition-all duration-300 group-hover:w-full"></div>

    </div>
  );
}

export default StepCard;