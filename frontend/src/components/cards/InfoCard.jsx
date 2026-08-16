function InfoCard({ icon, title, description }) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 cursor-pointer">

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-6 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-7">
        {description}
      </p>

    </div>
  );
}

export default InfoCard;