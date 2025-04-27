"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiSettings,
  FiUsers,
  FiHelpCircle,
  FiBarChart2,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiBell,
  FiSearch,
} from "react-icons/fi";

const Sidebar = ({ children, menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [flyoutStyle, setFlyoutStyle] = useState({});
  const menuRefs = useRef([]);
  const flyoutRef = useRef(null);

  // Default menu items if none provided
  const defaultMenuItems = [
    {
      icon: <FiHome size={20} />,
      title: "Dashboard",
      path: "/",
      badge: null,
    },
    {
      icon: <FiBarChart2 size={20} />,
      title: "Analytics",
      path: "#",
      badge: "New",
      subItems: [
        { title: "Performance", path: "/analytics/performance" },
        { title: "Reports", path: "/analytics/reports" },
        { title: "Statistics", path: "/analytics/statistics" },
      ],
    },
    {
      icon: <FiUsers size={20} />,
      title: "Users",
      path: "#",
      badge: "5",
      subItems: [
        { title: "Team", path: "/users/team" },
        { title: "Clients", path: "/users/clients" },
        { title: "Admins", path: "/users/admins" },
      ],
    },
    {
      icon: <FiBell size={20} />,
      title: "Notifications",
      path: "/notifications",
      badge: "3",
    },
    {
      icon: <FiSettings size={20} />,
      title: "Settings",
      path: "/settings",
    },
    {
      icon: <FiHelpCircle size={20} />,
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
          left: `${rect.width + 4}px`,
        });
      }
      setOpenDropdown(openDropdown === index ? null : index);
    } else {
      setOpenDropdown(openDropdown === index ? null : index);
    }
  };

  // Group menu items into sections
  const mainMenuItems = finalMenuItems.slice(0, 4);
  const systemMenuItems = finalMenuItems.slice(4);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        {/* Sidebar Container */}
        <div
          className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
            collapsed ? "w-20" : "w-64"
          } h-screen relative flex flex-col`}
        >
          {/* Logo - No toggle button here anymore */}
          <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              {!collapsed && (
                <h2 className="text-lg font-bold ml-3 text-gray-800 dark:text-white">
                  AppName
                </h2>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pt-4 pb-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md py-2 pl-10 ${
                  collapsed ? "w-12 px-0" : "w-full pr-4"
                } outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-all`}
                placeholder={collapsed ? "" : "Search..."}
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow overflow-y-auto pt-2 px-2">
            {/* Main Menu */}
            <div className="mb-6">
              {!collapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Main Menu
                </h3>
              )}
              <ul>
                {mainMenuItems.map((item, index) => (
                  <li
                    key={index}
                    className="relative mb-1"
                    ref={(el) => (menuRefs.current[index] = el)}
                  >
                    {item.subItems ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(index)}
                          className={`w-full flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            openDropdown === index
                              ? "bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                              : "text-gray-700 dark:text-gray-300"
                          } ${
                            collapsed ? "justify-center" : "justify-between"
                          }`}
                        >
                          <div className="flex items-center">
                            <span
                              className={`${openDropdown === index ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                            >
                              {item.icon}
                            </span>
                            {!collapsed && (
                              <span className="ml-3 font-medium">
                                {item.title}
                              </span>
                            )}
                          </div>
                          {!collapsed && (
                            <div className="flex items-center">
                              {item.badge && (
                                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                                  {item.badge}
                                </span>
                              )}
                              <span className="text-gray-400">
                                {openDropdown === index ? (
                                  <FiChevronUp size={16} />
                                ) : (
                                  <FiChevronDown size={16} />
                                )}
                              </span>
                            </div>
                          )}
                        </button>

                        {/* Dropdown for expanded mode */}
                        {!collapsed && openDropdown === index && (
                          <ul className="bg-gray-50 dark:bg-gray-750 rounded-md mt-1 py-1 mb-1">
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <a
                                  href={subItem.path}
                                  className="flex pl-12 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-md"
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
                        className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 ${
                          collapsed ? "justify-center" : "justify-between"
                        }`}
                      >
                        <div className="flex items-center">
                          <span>{item.icon}</span>
                          {!collapsed && (
                            <span className="ml-3 font-medium">
                              {item.title}
                            </span>
                          )}
                        </div>
                        {!collapsed && item.badge && (
                          <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* System Menu */}
            <div>
              {!collapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  System
                </h3>
              )}
              <ul>
                {systemMenuItems.map((item, index) => (
                  <li
                    key={index + mainMenuItems.length}
                    className="relative mb-1"
                    ref={(el) =>
                      (menuRefs.current[index + mainMenuItems.length] = el)
                    }
                  >
                    <a
                      href={item.path}
                      className={`flex items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 ${
                        collapsed ? "justify-center" : ""
                      }`}
                    >
                      <span>{item.icon}</span>
                      {!collapsed && (
                        <span className="ml-3 font-medium">{item.title}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
            <div
              className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                {!collapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Admin
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && (
                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <FiLogOut size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Flyout menus in collapsed mode */}
          {collapsed && openDropdown !== null && (
            <div
              className="fixed z-50 shadow-lg"
              style={flyoutStyle}
              ref={flyoutRef}
            >
              {finalMenuItems[openDropdown].subItems ? (
                <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg w-48 border border-gray-100 dark:border-gray-700">
                  <div className="py-2 px-4 border-b border-gray-100 dark:border-gray-700 font-medium text-gray-800 dark:text-white">
                    {finalMenuItems[openDropdown].title}
                  </div>
                  <ul className="py-2">
                    {finalMenuItems[openDropdown].subItems.map(
                      (subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.path}
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            {subItem.title}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-lg whitespace-nowrap border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
                  {finalMenuItems[openDropdown].title}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Toggle Button - positioned absolutely to appear on the right */}
        <button
          onClick={toggleSidebar}
          className="absolute flex items-center justify-center h-12 w-12 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-lg z-20 top-8 -right-6 transition-all duration-200 border-2 border-white dark:border-gray-800"
        >
          {collapsed ? (
            <FiChevronRight size={24} />
          ) : (
            <FiChevronLeft size={24} />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          {children || (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to your dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select an option from the sidebar to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
