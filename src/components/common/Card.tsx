import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Card() {
  const navigate = useNavigate();
  return (
    <div className="card-shape text-white p-6 w-[300px] flex flex-col justify-between gap-3">
      <div className="flex justify-between items-start ">
        <h2 className="text-2xl ">BUSINESS Light</h2>
        <Button
          variant="ghost"
          onClick={() => navigate("/control-panel/customers/active/2")}
          className="bg-white rounded-full border-none w-10 h-10 text-slate-900 text-2xl cursor-pointer transition hover:scale-110 duration-150"
        >
          <FaArrowRightLong />
        </Button>
      </div>
      <div className="flex-grow flex flex-col gap-3">
        <div className="flex justify-between space-x-2  ">
          <span className="font-semibold">Class:</span>
          <span className="text-gray-400 ">Business</span>
        </div>
        <div className="flex justify-between space-x-2  ">
          <span className="font-semibold">City:</span>
          <span className="text-gray-400">Kazan</span>
        </div>
        <div className="flex justify-between space-x-2  ">
          <span className="font-semibold ">Type of calculation:</span>
          <span className="text-gray-400 text-sm">Along the route</span>
        </div>
        <div className="flex justify-between space-x-2  ">
          <span className="font-semibold">Sorting:</span>
          <span className="text-gray-400 text-sm">3</span>
        </div>
      </div>
    </div>
  );
}
