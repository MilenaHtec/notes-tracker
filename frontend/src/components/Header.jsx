/**
 * Header Component
 * Application header with title
 */
function Header() {
  return (
    <header
      className="w-full h-16 bg-gray-800 flex items-center justify-between px-4 md:px-6 border-b border-gray-700 shadow-sm"
      role="banner"
    >
      <h1 className="text-lg md:text-xl font-semibold text-gray-100">
        Notes Tracker
      </h1>
    </header>
  );
}

export default Header;

