import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { dropDowns, links } from "../../constants/links";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const MySidebar = () => {
  const [menu, setMenu] = useState<string>("Main");
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <aside className="h-screen bg-senary asideM col-span-2 rounded-r-3xl">
      <nav className="w-full h-full flex flex-col items-start gap-20 pt-10 overflow-y-auto mysidebar">
        <img
          src="/logo.svg"
          alt="logo"
          draggable={false}
          className="w-32 h-32 mx-auto"
        />
        <div className="flex flex-col w-full text-slate-100 py-10">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenu(link.name)}
              className={cn(
                "px-4 py-3 w-full text-lg font-medium flex items-center gap-2 transition-colors hover:bg-stone-200/20",
                pathname.split("/")[2] === link.name.toLowerCase() && "bg-stone-200/20"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          <Accordion type="single" collapsible className="w-full">
            {dropDowns.map((dropdown) => (
              <AccordionItem
                key={dropdown.name}
                value={dropdown.name}
                className="border-none"
              >
                <AccordionTrigger className="px-4 py-3 w-full text-lg font-medium gap-2 flex items-center hover:underline-none transition-colors hover:bg-stone-200/20 border-none [&[data-state=open]>svg]:rotate-0">
                  {dropdown.icon}
                  {dropdown.name}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="">
                    {dropdown.links.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setMenu(link.name)}
                        className={cn(
                          "flex w-full items-center p-2 hover:bg-stone-200/20",
                          pathname.split("/")[2] === link.name.toLowerCase() &&
                            "bg-stone-200/20"
                        )}
                      >
                        <span className="ml-2">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </nav>
    </aside>
  );
};
export default MySidebar;
