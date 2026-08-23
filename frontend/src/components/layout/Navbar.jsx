import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(
    localStorage.getItem("campusTripToken")
  );

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("campusTripToken");
    localStorage.removeItem("campusTripCurrentUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#1E3A8A] flex items-center justify-center shadow-md">
            <span className="text-2xl text-white">🧳</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
              CampusTrip
            </h1>

            <p className="hidden sm:block text-xs text-gray-500">
              Plan smarter. Travel together.
            </p>
          </div>
        </Link>

        {/* Center Menu */}
        <div className="hidden lg:flex items-center gap-10">

          <button
            onClick={() => scrollToSection("features")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition"
          >
            About
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition"
          >
            How It Works
          </button>

        </div>

            {/* Right Side */}
      <div className="hidden sm:flex items-center gap-3">
      
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-[#1E3A8A] font-medium hover:bg-blue-50 transition"
            >
              Login
            </Link>
      
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-medium shadow-lg hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl text-[#1E3A8A] font-medium hover:bg-blue-50 transition"
            >
              Dashboard
            </Link>
      
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-[#1E3A8A] text-white font-medium shadow-lg hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        )}
      
      </div>

      </nav>

    </header>
  );
}

export default Navbar;
