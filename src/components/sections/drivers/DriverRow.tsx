import { TableCell, TableRow } from "../../ui/table";
import { useNavigate } from "react-router-dom";

const DriverRow = (performer: any) => {
  const navigate = useNavigate();
  return (
    <TableRow
      onClick={() => {
        navigate(`/control-panel/drivers/${performer.status}/${performer.id}/profile`);
      }}
      key={performer.id}
      className="bg-[#282828] border-none mb-2 hover:bg-[#2F2F2F] hover:cursor-pointer"
    >
      <TableCell className="text-sm">{performer.registrationDate}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <img
            src={performer.avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-medium">{performer.name}</div>
            <div className="text-sm text-gray-400">{performer.fullName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{performer.callSign}</TableCell>
      <TableCell>{performer.profession}</TableCell>
      <TableCell>{performer.balance}</TableCell>
      <TableCell>
        <div>
          <div>{performer.car.model}</div>
          <div className="text-sm text-gray-400">{performer.car.number}</div>
        </div>
      </TableCell>
      <TableCell>{performer.partner}</TableCell>
      <TableCell>{performer.changeDate}</TableCell>
      <TableCell>{performer.changedBy}</TableCell>
    </TableRow>
  );
};

export default DriverRow;
