import { ArrowRight } from "lucide-react";

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6">

      {/* Icon */}
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-105 group-hover:bg-blue-100 sm:h-12 sm:w-12">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-900 sm:text-lg">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

      {/* Learn More */}
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>Learn More</span>
        <ArrowRight size={18} />
      </div>

    </div>
  );
}

export default FeatureCard;
