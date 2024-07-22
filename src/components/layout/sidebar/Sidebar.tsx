import { useState, FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";
import HamburgerButton from "../../common/hamburgerMenu/HamburgerButton";
import {
  HiOutlineServer,
  HiOutlineMicrophone,
  HiOutlineCollection,
  HiOutlineNewspaper,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Profile from "../../profile/Profile";
import { IoGameControllerOutline } from "react-icons/io5";
import { CiDollar } from "react-icons/ci";

interface MenuItem {
  title: string;
  path?: string;
  src?: JSX.Element;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  icon?: JSX.Element;
  dropdown?: MenuItem[];
}

const Sidebar: FC = () => {
  const [open, setOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const Menus: MenuItem[] = [
    { title: "Servers", path: "/servers", src: <HiOutlineServer /> },
    { title: "TeamSpeak", path: "/team-speak", src: <HiOutlineMicrophone /> },
    { title: "Category", path: "/category", src: <HiOutlineCollection /> },
    { title: "News", path: "/news", src: <HiOutlineNewspaper /> },
    { title: "Games", path: "/games", src: <IoGameControllerOutline /> },
    { title: "Pricing", path: "/pricing", src: <CiDollar /> }, // New Pricing page entry
  ];

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <>
      <div
        className={`${
          open ? "w-60" : "w-fit"
        } hidden sm:block relative min-h-screen duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
      >
        <BsArrowLeftCircle
          className={`${
            !open && "rotate-180"
          } absolute text-3xl bg-white fill-slate-800 rounded-full cursor-pointer bottom-32 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
        <Link to="/">
          <div className={`flex ${open && "gap-x-4"} items-center`}>
            {open && (
              <span className="text-xl font-medium whitespace-nowrap dark:text-white">
                {t("sidebar.admin")}
              </span>
            )}
          </div>
        </Link>

        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <div key={index}>
              {menu.dropdown ? (
                <li
                  className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mt-2`}
                  onClick={handleSettingsClick}
                >
                  <span className="text-2xl">{menu.startIcon}</span>
                  <span
                    className={`${
                      !open && "hidden"
                    } origin-left duration-300 hover:block`}
                  >
                    {t(menu.title)}
                  </span>
                  <span
                    className={`${
                      !open && "hidden"
                    } origin-left duration-300 hover:block`}
                  >
                    {menu.endIcon}
                  </span>
                </li>
              ) : (
                menu.path && ( // Check if menu.path is defined
                  <Link to={menu.path} key={index}>
                    <li
                      className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mt-2 ${
                        location.pathname === menu.path &&
                        "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span className="text-2xl">{menu.src}</span>
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-300 hover:block`}
                      >
                        {t(menu.title)}
                      </span>
                    </li>
                  </Link>
                )
              )}

              {menu.dropdown && settingsOpen && (
                <ul className="ml-2">
                  {menu.dropdown.map(
                    (dropdownItem, dropdownIndex) =>
                      dropdownItem.path && ( // Check if dropdownItem.path is defined
                        <Link to={dropdownItem.path} key={dropdownIndex}>
                          <li
                            className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mt-2`}
                          >
                            {dropdownItem.icon && (
                              <span className="text-2xl">
                                {dropdownItem.icon}
                              </span>
                            )}
                            <span
                              className={`${
                                !open && "hidden"
                              } origin-left duration-300 hover:block`}
                            >
                              {dropdownItem.title}
                            </span>
                          </li>
                        </Link>
                      )
                  )}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      <div>
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? "flex" : "hidden"
          } absolute z-50 flex-col items-start pl-10 self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map(
            (menu, index) =>
              menu.path && ( // Check if menu.path is defined
                <Link
                  to={menu.path}
                  key={index}
                  onClick={() => setMobileMenu(false)}
                >
                  <span
                    className={`${
                      location.pathname === menu.path &&
                      "bg-gray-200 dark:bg-gray-700"
                    } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
                  >
                    {t(menu.title)}
                  </span>
                </Link>
              )
          )}
          <Profile />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
