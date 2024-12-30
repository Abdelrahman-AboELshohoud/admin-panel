import { TableCell, TableRow } from "../../ui/table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Driver } from "../../../graphql/requests";
import { useTranslation } from "react-i18next";

const DriverRow = ({ data, id }: { data: Driver; id: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <TableRow
      onClick={() => {
        navigate(`/control-panel/drivers/${data.status}/${id}/profile`);
      }}
      key={id}
      className="bg-transparent border-none mb-2 hover:bg-[#262626] hover:cursor-pointer"
    >
      <TableCell className="text-sm">
        {moment(data.registrationTimestamp).format("DD.MM.YYYY")}
        <br />
        {moment(data.registrationTimestamp).format("HH:mm A")}
      </TableCell>
      <TableCell>
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={data.media?.address || "/placeholder-image.jpg"}
          alt="driver"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <div className="font-medium text-gray-400">{data.firstName}</div>
          <div className="text-sm">{data.lastName}</div>
        </div>
      </TableCell>
      <TableCell>{data.mobileNumber || t("notAssigned")}</TableCell>
      <TableCell>{data.rating || 0}</TableCell>

      <TableCell>
        {t(
          `drivers.driver.status.${
            data.status.charAt(0).toLowerCase() + data.status.slice(1)
          }`
        )}
      </TableCell>
    </TableRow>
  );
};

export default DriverRow;
