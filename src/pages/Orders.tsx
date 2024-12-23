import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosAddCircleOutline, IoIosArrowDown } from "react-icons/io";
import {  useState } from "react";
import { useTranslation } from "react-i18next";
export default function Orders() {
  const [value, setValue] = useState("All");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const inputs = [
    { name: "orders.inputs.orderNumber", value: "" },
    { name: "orders.inputs.address", value: "" },
    { name: "orders.inputs.client", value: "" },
    { name: "orders.inputs.executor", value: "" },
    { name: "orders.inputs.comment", value: "" },
  ];
  console.log(inputs, inputs.length);

  return (
    <div className="h-full overflow-hidden flex flex-col gap-2">
      <div className="w-full flex flex-row justify-center">
        <h2 className="text-5xl p-3 font-medium underline max-h-[50px]">
          {t("orders.orderHeader")}
        </h2>
        <div className="flex flex-row items-end justify-between gap-5 py-5 px-8 rounded-2xl">
          <div className="w-full flex flex-col items-center justify-start gap-5 bg-tertiary py-5 px-8 rounded-2xl">
            <h3 className="text-xl font-semibold text-quaternary">
              16 {t("orders.carSummary")}
            </h3>
            <div className="flex flex-row items-center justify-start gap-5">
              <div className="p-4 bg-green-500 rounded-full" />
              <div className="font-semibold text-5xl">10</div>
              <div className="p-4 bg-red-500 rounded-full" />
              <div className="font-semibold text-5xl">6</div>
            </div>
          </div>
          <button
            className="w-fit py-2 pl-3 pr-10 flex flex-row items-center gap-2 border-2 font-semibold border-quaternary rounded-lg transition hover:bg-quaternary/80 hover:text-secondary"
            type="button"
          >
            <FaMapLocationDot size={24} />
            {t("orders.mapButton")}
          </button>
          <button
            className="w-fit py-2 px-3 flex flex-row items-center gap-2 text-nowrap border-2 border-quaternary rounded-lg transition hover:bg-quaternary/80 hover:text-secondary"
            type="button"
          >
            <IoIosAddCircleOutline size={24} />
            {t("orders.newOrderButton")}
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full items-stretch">
        {inputs.map((item: any) => (
          <div
            key={item.name}
            className=" flex flex-row w-1/6 items-center justify-between gap-5 border-b-2  border-quaternary/90"
          >
            <input
              className="text-xl pb-2 text-nowrap bg-transparent min-w-full font-semibold text-quaternary/90"
              type="text"
              value={item.value}
              placeholder={t(item.name)}
            />
          </div>
        ))}
        <div className="w-1/6 relative">
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="w-full py-3 px-4 bg-[#101010] hover:bg-[#101010]/80 hover:cursor-pointer text-slate-100 rounded-full flex flex-row items-center justify-between"
          >
            {value}
            <IoIosArrowDown size={24} />
          </button>
          <ul
            className="w-full overflow-hidden bg-[#101010] hover:cursor-pointer text-slate-100 rounded-lg absolute top-16 z-10 right-0 "
            style={{ display: open ? "block" : "none" }}
          >
            <li
              onClick={() => {
                setValue("All");
                setOpen(false);
              }}
              value="all"
              className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
            >
              {t("orders.statusFilter.all")}
            </li>
            <li
              onClick={() => {
                setValue("In progress");
                setOpen(false);
              }}
              value="in progress"
              className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
            >
              {t("orders.statusFilter.inProgress")}
            </li>
            <li
              onClick={() => {
                setValue("Completed");
                setOpen(false);
              }}
              value="completed"
              className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
            >
              {t("orders.statusFilter.completed")}
            </li>
            <li
              onClick={() => {
                setValue("Cancelled");
                setOpen(false);
              }}
              value="cancelled"
              className="text-quaternary py-2 hover:bg-quaternary/80 px-4 hover:text-secondary"
            >
              {t("orders.statusFilter.cancelled")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
