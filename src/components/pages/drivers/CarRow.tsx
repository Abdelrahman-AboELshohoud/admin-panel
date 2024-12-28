import { t } from "i18next";
import { TableRow, TableCell } from "../../ui/table";
import { useNavigate } from "react-router-dom";

export default function CarRow({ car }: { car: any }) {
  console.log(car);
  const navigate = useNavigate();
  return (
    <TableRow
      onClick={() => navigate(`/control-panel/cars/active/${car.id}/car`)}
      key={car.id}
      className="bg-transparent border-none mb-2 hover:bg-[#262626] hover:cursor-pointer"
    >
      <TableCell>
        <img src={car.carPlate} alt="car" className="w-14 h-14 rounded-md " />
      </TableCell>
      <TableCell className="flex gap-2 items-center pt-4">
        <div>{car.firstName}</div>
        <div>{car.lastName}</div>
      </TableCell>
      <TableCell>{car.productionYear || t("common.notAssigned")}</TableCell>
    </TableRow>
  );
}
