import { Button } from "../../ui/button";
import { FaPlus } from "react-icons/fa";

export default function BottomCustomerEdit() {
  return (
    <div className="mt-8">
      <h3 className="text-xl mb-4 font-bold">Calculation of delivery</h3>
      <div className="space-y-4">
        <h4 className="text-lg font-bold">Basic options</h4>
        <div className="grid grid-cols-5 gap-4">
          {[
            {
              label: "Working hours",
              value: "All the time, except for exceptions",
            },
            {
              label: "Type of calculation (City)",
              value: "For distance and time",
            },
            {
              label: "Type of calculation (Out of town)",
              value: "For distance and time",
            },
            { label: "An airport", value: "-" },
            { label: "railway", value: "No" },
          ].map(({ label, value }) => (
            <div key={label}>
              <label className="block text-sm mb-1">{label}</label>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Exceptions */}
      <div className="mt-6">
        <h4 className="mb-4 text-lg font-bold">Exceptions</h4>
        <Button className="bg-black text-white">
          <FaPlus className="mr-2" />
          Add an exception
        </Button>
      </div>
    </div>
  );
}
