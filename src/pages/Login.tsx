import { useEffect, useState } from "react";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginGQL } from "../graphql/requests";
import useLogin from "../hooks/useLogin";
import ChangeLanguageBtn from "../components/common/rare-using/ChangeLanguageBtn";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useLogin();

  const inputs = [
    {
      type: "text",
      placeholder: t("login.email"),
      input: email,
      setInput: setEmail,
    },
    {
      type: "password",
      placeholder: t("login.password"),
      input: password,
      setInput: setPassword,
    },
  ];

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      return setError(t("login.emptyInputs"));
    }

    const res: any = await LoginGQL({
      username: email.trim(),
      password: password.trim(),
    });
    console.log(res.status);
    if (res.status) {
      const token = res.data.login.token;
      localStorage.setItem("token", token);
      setError("");
      navigate("/control-panel/main", { replace: true });
    } else {
      setError(t("login.invalidCredentials"));
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/control-panel/main", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <section className="flex flex-row items-center justify-start relative">
      <div className="flex flex-col items-center justify-around h-screen min-w-[25%] max-w-[25%] px-6 bg-tertiary shadow-lg rounded-r-2xl">
        <img src="/logo.svg" alt="logo" className="w-32" />
        <form className="flex flex-col items-center justify-center w-full gap-4">
          {inputs.map((input) => (
            <label
              className="flex flex-col items-center justify-center input-login font-medium text-lg px-4 w-full"
              key={input.placeholder}
            >
              <input
                type={input.type}
                placeholder={input.placeholder}
                className="w-full border-b border-b-quaternary py-2 input-login font-medium text-lg text-slate-200"
                value={input.input}
                onChange={(e) => input.setInput(e.target.value)}
              />
            </label>
          ))}
          <div className="flex flex-row justify-between w-full px-3">
            <div className="flex flex-row items-center gap-2 text-slate-300 text-sm">
              <button
                type="button"
                className="flex flex-row items-center justify-center p-1 bg-black bg-opacity-50 rounded-full focus:outline-none text-slate-200"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 border-2 border-opacity-5 border-primary ${
                    rememberMe ? "bg-primary" : "bg-quaternary"
                  }`}
                />
              </button>
              {t("login.rememberMe")}
            </div>
            <Link to="/forgot-password" className="text-primary text-sm">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <button
            onClick={handleClick}
            className="w-full bg-primary text-tertiary font-semibold py-3 text-lg mt-4 rounded-full"
          >
            {t("login.login")}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <ChangeLanguageBtn />
      </div>
      <img
        src="/bg-milly-taxi.png"
        alt="bg-milly-taxi"
        className="flex flex-col items-center justify-center absolute right-0 top-0 h-screen w-[80%] -z-10"
      />
    </section>
  );
}
