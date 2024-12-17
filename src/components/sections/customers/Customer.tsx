import { Button } from "../../ui/button";

import Switch from "../../common/Switch";
import BottomCustomerEdit from "./BottomCustomerEdit";
import LeftCustomerEdit from "./LeftCustomerEdit";
import RightCustomerEdit from "./RightCustomerEdit";
import { useState } from "react";
const Customer = () => {
  const [editing, setEditing] = useState(false);
  return (
    <div className="min-h-screen card-shape p-8">
      <div className="text-sm text-gray-400 mb-2">Tariffs for customers</div>
      <h1 className="text-4xl mb-8">BUSINESS Lite</h1>

      <div className="grid grid-cols-2 gap-8">
        <LeftCustomerEdit editing={editing} />
        <RightCustomerEdit editing={editing} />
      </div>

      <BottomCustomerEdit  />
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>Block</span>
          <Switch checked={false} disabled={!editing} />
        </div>
        <Button
          onClick={() => setEditing((prev) => !prev)}
          type="button"
          className={`bg-slate-500 text-black px-8 w-[100px] hover:bg-slate-400 ${
            editing ? "bg-yellow-500 hover:bg-yellow-400" : ""
          }`}
        >
          {editing ? "Save" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default Customer;
