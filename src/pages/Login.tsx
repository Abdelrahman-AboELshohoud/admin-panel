import { useEffect, useState } from "react";
import "../global.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../graphql/requests";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showLanguage, setShowLanguage] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = useLogin()

  const inputs = [
    {
      type: "text",
      placeholder: "Email",
      input: email,
      setInput: setEmail,
    },
    {
      type: "password",
      placeholder: "Password",
      input: password,
      setInput: setPassword,
    },
  ];

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      return;
    }
    try {
      const res: any = await loginUser(email, password);
      if(res.status) { 
        navigate("/control-panel/main", { replace: true });
      }
      setError(res.message);
    } catch (error: any) {
      console.log(error);
      setError(error.message);

    }
  };


  useEffect(() => {
    if (isLoggedIn) {
      navigate("/control-panel/main", { replace: true });
    }
  }, [isLoggedIn])

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
            <div className="flex flex-row items-center gap-2  text-slate-300 text-sm">
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
              Remember me
            </div>
            <Link to="/forgot-password" className="text-primary text-sm">
              Forgot password?
            </Link>
          </div>
          <button
            onClick={handleClick}
            className="w-full bg-primary text-tertiary font-semibold py-3 text-lg mt-4 rounded-full"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
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
            {["English", "Russian", "French"].map((language) => (
              <li key={language} className="text-sm py-0.5">
                {language}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <img
        src="/bg-milly-taxi.png"
        alt="bg-milly-taxi"
        className="flex flex-col items-center justify-center absolute right-0 top-0 h-screen w-[80%] -z-10"
      />
    </section>
  );
}
