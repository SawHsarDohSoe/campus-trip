function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-[#1E3A8A]">
            CampusTrip
          </h2>

          <p className="text-gray-500 mt-2">
            Plan smarter. Travel together.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          © 2026 CampusTrip. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;