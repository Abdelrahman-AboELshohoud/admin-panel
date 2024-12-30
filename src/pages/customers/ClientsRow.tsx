import { TableCell, TableRow } from "../../components/ui/table";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Rider } from "../../graphql/requests";
import { useTranslation } from "react-i18next";

const ClientRow = ({ data, id }: { data: Rider; id: string }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <TableRow
      onClick={() => {
        navigate(`/control-panel/clients/${data.status}/${id}/profile`);
      }}
      key={id}
      className="bg-[#282828] border-none mb-2 hover:bg-[#2F2F2F] hover:cursor-pointer"
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
          alt="client"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <div className="font-medium text-gray-400">{data.firstName}</div>
          <div className="text-sm">{data.lastName}</div>
        </div>
      </TableCell>
      <TableCell>{data.mobileNumber || t("notAssigned")}</TableCell>
      <TableCell>
        {t(
          `clients.client.status.${
            data.status.charAt(0).toLowerCase() + data.status.slice(1)
          }`
        )}
      </TableCell>
      <TableCell>{data?.orders?.totalCount || 0}</TableCell>
    </TableRow>
  );
};

export default ClientRow;
