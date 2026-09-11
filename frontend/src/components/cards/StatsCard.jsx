function StatsCard({ number, label }) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-5">

      {/* Number */}
      <h2 className="text-2xl font-extrabold text-slate-900 transition duration-300 group-hover:scale-105 sm:text-3xl lg:text-4xl">
        {number}
      </h2>

      {/* Divider */}
      <div className="mx-auto my-2 h-1 w-8 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-12"></div>

      {/* Label */}
      <p className="text-xs font-medium text-slate-600 sm:text-sm">
        {label}
      </p>

    </div>
  );
}

export default StatsCard;
