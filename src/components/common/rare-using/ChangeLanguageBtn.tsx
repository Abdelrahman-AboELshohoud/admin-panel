import { useState } from "react";
import i18n from "../../../translation/i18n";

export default function ChangeLanguageBtn() {
  const [showLanguage, setShowLanguage] = useState(false);

  const chooseLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="relative w-full">
      <img
        src={`/${showLanguage ? "world-colored" : "world"}.svg`}
        alt="bg-milly-taxi"
        className="w-8 absolute top-0 left-0 z-10 cursor-pointer"
        onClick={() => setShowLanguage(!showLanguage)}
      />
      <ul
        className="menu dropdown-content bg-base-100 absolute bottom-0 left-10 bg-quinary border-slate-900 border-opacity-5 text-slate-300 shadow-sm z-[1] rounded-lg  px-4  w-24 py-2"
        style={{ display: showLanguage ? "block" : "none" }}
      >
        {[
          { name: "English", code: "en" },
          { name: "Russian", code: "ru" },
        ].map((language) => (
          <li
            key={language.code}
            className="text-sm py-0.5 hover:cursor-pointer"
            onClick={() => {
              chooseLanguage(language.code);
              setShowLanguage(false);
            }}
          >
            {language.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
