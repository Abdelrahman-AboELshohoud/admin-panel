import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HiMiniUserCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const MyHeader = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full h-20 pt-6 flex items-center justify-end gap-6 headerM px-8 mb-4">
      <ul
        className="menu dropdown-content bg-base-100  bg-quinary border-slate-900 border-opacity-5 text-slate-300 shadow-sm z-[1] rounded-lg  px-5 w-fit py-3"
        style={{ display: openMenu ? "block" : "none" }}
      >
        <li className="text-lg font-semibold py-0.5 text-nowrap">
          {t("header.personalAccount")}
        </li>
        <li className=" py-0.5">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full h-full text-start"
          >
            {t("header.logout")}
          </button>
        </li>
      </ul>
      <button
        type="button"
        className=" h-full flex items-center justify-end"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <HiMiniUserCircle size={40} className="text-quaternary" />
      </button>
    </header>
  );
};

export default MyHeader;
