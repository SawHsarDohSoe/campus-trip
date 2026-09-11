function InfoCard({ icon, title, description }) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

      {/* Icon */}
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-105 group-hover:bg-blue-100 sm:h-12 sm:w-12">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-6 text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default InfoCard;
