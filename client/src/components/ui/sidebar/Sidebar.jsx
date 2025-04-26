"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Users,
  HelpCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Sidebar = ({ children, menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [flyoutStyle, setFlyoutStyle] = useState({});
  const menuRefs = useRef([]);
  const flyoutRef = useRef(null);

  // Default menu items if none provided
  const defaultMenuItems = [
    {
      icon: <Home />,
      title: "Dashboard",
      path: "/",
    },
    {
      icon: <BarChart2 />,
      title: "Analytics",
      path: "#",
      subItems: [
        { title: "Performance", path: "/analytics/performance" },
        { title: "Reports", path: "/analytics/reports" },
        { title: "Statistics", path: "/analytics/statistics" },
      ],
    },
    {
      icon: <Users />,
      title: "Users",
      path: "#",
      subItems: [
        { title: "Team", path: "/users/team" },
        { title: "Clients", path: "/users/clients" },
        { title: "Admins", path: "/users/admins" },
      ],
    },
    {
      icon: <Settings />,
      title: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle />,
      title: "Help",
      path: "/help",
    },
    {
      icon: <Home />,
      title: "Dashboard",
      path: "/",
    },
    {
      icon: <BarChart2 />,
      title: "Analytics",
      path: "#",
      subItems: [
        { title: "Performance", path: "/analytics/performance" },
        { title: "Reports", path: "/analytics/reports" },
        { title: "Statistics", path: "/analytics/statistics" },
      ],
    },
    {
      icon: <Users />,
      title: "Users",
      path: "#",
      subItems: [
        { title: "Team", path: "/users/team" },
        { title: "Clients", path: "/users/clients" },
        { title: "Admins", path: "/users/admins" },
      ],
    },
    {
      icon: <Settings />,
      title: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle />,
      title: "Help",
      path: "/help",
    },
    {
      icon: <Home />,
      title: "Dashboard",
      path: "/",
    },
    {
      icon: <BarChart2 />,
      title: "Analytics",
      path: "#",
      subItems: [
        { title: "Performance", path: "/analytics/performance" },
        { title: "Reports", path: "/analytics/reports" },
        { title: "Statistics", path: "/analytics/statistics" },
      ],
    },
    {
      icon: <Users />,
      title: "Users",
      path: "#",
      subItems: [
        { title: "Team", path: "/users/team" },
        { title: "Clients", path: "/users/clients" },
        { title: "Admins", path: "/users/admins" },
      ],
    },
    {
      icon: <Settings />,
      title: "Settings",
      path: "/settings",
    },
    {
      icon: <HelpCircle />,
      title: "Help",
      path: "/help",
    },
  ];

  const finalMenuItems = menuItems || defaultMenuItems;

  useEffect(() => {
    menuRefs.current = menuRefs.current.slice(0, finalMenuItems.length);

    // Add click event listener to handle closing dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(event.target) &&
        menuRefs.current.every((ref) => ref && !ref.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [finalMenuItems]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    if (collapsed) {
      const element = menuRefs.current[index];
      if (element) {
        const rect = element.getBoundingClientRect();
        setFlyoutStyle({
          top: `${rect.top}px`,
          left: `${rect.width}px`,
        });
      }
      setOpenDropdown(openDropdown === index ? null : index);
    } else {
      setOpenDropdown(openDropdown === index ? null : index);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } h-screen relative flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          {!collapsed && <h2 className="text-xl font-bold">My App</h2>}
          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-lg bg-gray-700 hover:bg-gray-600 ${
              collapsed ? "mx-auto" : ""
            }`}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto">
          <ul className="mt-6">
            {finalMenuItems.map((item, index) => (
              <li
                key={index}
                className="relative"
                ref={(el) => (menuRefs.current[index] = el)}
              >
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`w-full flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                        collapsed ? "justify-center" : "justify-between"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-gray-300">{item.icon}</span>
                        {!collapsed && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <span className="text-gray-400">
                          {openDropdown === index ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Dropdown for expanded mode */}
                    {!collapsed && openDropdown === index && (
                      <ul className="bg-gray-700 py-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={subItem.path}
                              className="flex pl-12 py-2 hover:bg-gray-600 transition-colors"
                            >
                              {subItem.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.path}
                    className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                      collapsed ? "justify-center" : ""
                    }`}
                  >
                    <span className="text-gray-300">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800">
          <div
            className={`flex items-center ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              U
            </div>
            {!collapsed && <span className="ml-3">User Name</span>}
          </div>
        </div>

        {/* Flyout menus in collapsed mode - now triggered by click instead of hover */}
        {collapsed && openDropdown !== null && (
          <div className="fixed z-50" style={flyoutStyle} ref={flyoutRef}>
            {finalMenuItems[openDropdown].subItems ? (
              <div className="bg-gray-800 rounded shadow-lg w-48">
                <div className="py-2 px-4 border-b border-gray-700 font-medium">
                  {finalMenuItems[openDropdown].title}
                </div>
                <ul className="py-2">
                  {finalMenuItems[openDropdown].subItems.map(
                    (subItem, subIndex) => (
                      <li key={subIndex}>
                        <a
                          href={subItem.path}
                          className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                        >
                          {subItem.title}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <div className="bg-gray-800 px-4 py-2 rounded shadow-lg whitespace-nowrap">
                {finalMenuItems[openDropdown].title}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">{children}</div>
    </div>
  );
};

export default Sidebar;
