import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  CreateZonePriceGQL,
  UpdateZonePriceGQL,
  ZonePricesListGQL,
  DeleteZonePriceGQL,
  //   SetZonePriceRelationsGQL,
  // ZonePriceInput,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";

import { toast } from "react-hot-toast";
import { MyDialog } from "../../components/common/MyDialog";

import DeletionDialog from "../../components/common/DeletionDialog";
import ZonePriceForm from "./ZonePriceForm";

interface Point {
  lat: number;
  lng: number;
}

interface TimeMultiplier {
  startTime: string;
  endTime: string;
  multiply: number;
}

interface ZonePrice {
  id: string;
  name: string;
  from: Point[];
  to: Point[];
  cost: number;
  timeMultipliers?: TimeMultiplier[];
}

interface ZonePriceFormData extends ZonePrice {
  name: string;
  cost: number;
  from: Point[];
  to: Point[];
  timeMultipliers: TimeMultiplier[];
}

export default function ZonesPrices() {
  const { t } = useTranslation();
  const [zones, setZones] = useState<ZonePrice[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZonePrice | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ZonePricesListGQL({});
      if (response.data?.zonePrices) {
        setZones(response.data.zonePrices);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching zones:", error);
      toast.error(t("directories.zonePrices.messages.error.fetch"));
    }
  }, [t]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleCreateZone = async (zoneData: ZonePriceFormData) => {
    try {
      setLoading(true);
      const response = await CreateZonePriceGQL({
        input: {
          name: zoneData.name,
          cost: zoneData.cost,
          from: [zoneData.from],
          to: [zoneData.to],
          timeMultipliers: zoneData.timeMultipliers,
        },
      });

      if (response.data?.createZonePrice) {
        setZones((prev) => [...prev, response.data.createZonePrice]);
        toast.success(t("directories.zonePrices.messages.createSuccess"));
        setShowDialog(false);
      }
      setShowDialog(false);
    } catch (error) {
      console.error("Error creating zone:", error);
      toast.error(t("directories.zonePrices.messages.error.create"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async (zoneData: ZonePriceFormData) => {
    if (!selectedZone) return;

    try {
      setLoading(true);
      const response = await UpdateZonePriceGQL({
        id: selectedZone.id,
        update: {
          name: zoneData.name,
          cost: zoneData.cost,
          from: [zoneData.from],
          to: [zoneData.to],
          timeMultipliers: zoneData.timeMultipliers,
        },
      });
      if (response.data?.updateZonePrice) {
        setZones((prev) =>
          prev.map((zone) =>
            zone.id === selectedZone.id
              ? { ...zoneData, id: selectedZone.id }
              : zone
          )
        );
        toast.success(t("directories.zonePrices.messages.updateSuccess"));
        setShowDialog(false);
      }
    } catch (error) {
      console.error("Error updating zone:", error);
      toast.error(t("directories.zonePrices.messages.error.update"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = async () => {
    if (!selectedZone) return;

    try {
      setLoading(true);
      await DeleteZonePriceGQL({ id: selectedZone.id });
      setZones((prev) => prev.filter((zone) => zone.id !== selectedZone.id));
      toast.success(t("directories.zonePrices.messages.deleteSuccess"));
      setShowDeleteDialog(false);
      setSelectedZone(null);
    } catch (error) {
      console.error("Error deleting zone:", error);
      toast.error(t("directories.zonePrices.messages.error.delete"));
    } finally {
      setLoading(false);
    }
  };

  const filteredZones = zones.filter((zone) => {
    const matchesSearch = zone.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {t("directories.zonePrices.title")}
        </h1>
        <Button
          onClick={() => {
            setSelectedZone(null);
            setIsEditing(true);
            setShowDialog(true);
          }}
        >
          {t("directories.zonePrices.create")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Input
          placeholder={t("directories.zonePrices.filters.search")}
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
      </div>

      <div className="card-shape">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>{t("directories.zonePrices.fields.name")}</TableHead>
              <TableHead>{t("directories.zonePrices.fields.cost")}</TableHead>

              <TableHead>{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-14">
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            ) : filteredZones && filteredZones.length > 0 ? (
              filteredZones.map((zone) => (
                <TableRow
                  key={zone.id}
                  className="hover:bg-[#282828] border-none"
                >
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.cost}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedZone(zone);
                          setIsEditing(true);
                          setShowDialog(true);
                        }}
                      >
                        {t("common.edit")}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedZone(zone);
                          setShowDeleteDialog(true);
                        }}
                      >
                        {t("common.delete")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {t("directories.zonePrices.noZones")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <MyDialog
        title={
          isEditing
            ? selectedZone
              ? t("directories.zonePrices.edit")
              : t("directories.zonePrices.create")
            : t("directories.zonePrices.view")
        }
        isOpen={showDialog}
        showCloseButton={false}
        onOpenChange={setShowDialog}
        className="min-w-[800px] max-h-[600px] overflow-x-hidden overflow-y-auto custom-scrollbar"
      >
        <ZonePriceForm
          zone={selectedZone}
          onSubmit={selectedZone ? handleUpdateZone : handleCreateZone}
          onCancel={() => setShowDialog(false)}
          isEditing={isEditing}
        />
      </MyDialog>

      <DeletionDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteZone}
        title={t("directories.zonePrices.deleteConfirm.title")}
        description={t("directories.zonePrices.deleteConfirm.message")}
      />
    </div>
  );
}