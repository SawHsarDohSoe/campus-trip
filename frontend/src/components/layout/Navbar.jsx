import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

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
          to={isAuthenticated ? "/dashboard" : "/"}
          replace={isAuthenticated}
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <BrandLogo size="md" showTagline />
        </Link>

        {/* Center Menu */}
        <div className="hidden lg:flex items-center gap-8">

          <button
            onClick={() => scrollToSection("team")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition cursor-pointer"
          >
            Team
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition cursor-pointer"
          >
            How It Works
          </button>

          <button
            onClick={() => scrollToSection("features")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition cursor-pointer"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="font-medium text-gray-600 hover:text-[#1E3A8A] transition cursor-pointer"
          >
            About
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
