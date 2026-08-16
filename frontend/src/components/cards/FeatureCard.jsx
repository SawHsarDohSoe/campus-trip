import { ArrowRight } from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 cursor-pointer">

      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-6 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[#1E3A8A]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-gray-600 leading-7">
        {description}
      </p>

      {/* Learn More */}
      <div className="mt-8 flex items-center gap-2 text-[#1E3A8A] font-semibold opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <span>Learn More</span>
        <ArrowRight size={18} />
      </div>

    </div>
  );
}

export default FeatureCard;