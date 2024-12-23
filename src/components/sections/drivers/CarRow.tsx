import { TableRow, TableCell } from "../../ui/table";
import { useNavigate } from "react-router-dom";

export default function CarRow({
  carModel,
  carColor,
}: {
  carModel: any;
  carColor: any;
}) {
  console.log(carModel);
  console.log(carColor);
  const navigate = useNavigate();
  return (
    <TableRow
      onClick={() => navigate(`/control-panel/cars/active/${carModel.id}/car`)}
      key={carModel.id}
      className="bg-[#282828] border-none mb-2 hover:bg-[#2F2F2F] hover:cursor-pointer"
    >
      {/* <TableCell>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1E1E1E] flex items-center justify-center rounded ">
              <span className="text-2xl">🖼️</span>
            </div>
            <div>
              <div className="font-medium">{car.model}</div>
              <div className="text-sm text-gray-400">{car.number}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <div className="font-medium">{car.executor.name}</div>
            <div className="text-sm text-gray-400">
              {car.executor.details}
            </div>
          </div>
        </TableCell> */}
      <TableCell>{carModel?.name}</TableCell>
      <TableCell>{carColor?.name || "Unknown"}</TableCell>
    </TableRow>
  );
}
