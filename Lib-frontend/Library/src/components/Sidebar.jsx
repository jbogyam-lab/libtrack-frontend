import { NavLink } from "react-router-dom";

const Sidebar = ({ role }) => {
  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/books", label: "Books" },
    { path: "/students", label: "Students", adminOnly: true },
    { path: "/borrowed", label: "Borrowed Books" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">📚 LibTrack</div>
      <nav className="flex-1 p-4 space-y-2">
        {links
          .filter(link => !link.adminOnly || role === "admin")
          .map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </nav>
    </div>
  );
};

export default Sidebar;
