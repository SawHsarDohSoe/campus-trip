function StatsCard({ number, label }) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200">

      {/* Number */}
      <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] transition duration-300 group-hover:scale-110">
        {number}
      </h2>

      {/* Divider */}
      <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mt-4 mb-4 transition-all duration-300 group-hover:w-20"></div>

      {/* Label */}
      <p className="text-gray-600 font-medium text-lg">
        {label}
      </p>

    </div>
  );
}

export default StatsCard;