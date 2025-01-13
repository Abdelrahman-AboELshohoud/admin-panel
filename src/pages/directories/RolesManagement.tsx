import { useState, useEffect } from "react";
import {
  CreateRoleGQL,
  RoleGQL,
  RolesGQL,
  UpdateRoleGQL,
  OperatorPermission,
  OperatorRole,
} from "../../graphql/requests";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import toast from "react-hot-toast";
import { t } from "i18next";
import { MyDialog } from "../../components/common/MyDialog";

export const RolesManagement = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [permissions, setPermissions] = useState<OperatorPermission[]>([]);
  const [roles, setRoles] = useState<OperatorRole[]>([]);
  const [hasAccess, setHasAccess] = useState(true);

  const getRoles = async () => {
    try {
      const roles = await RolesGQL({});
      if (roles?.data?.operatorRoles) {
        setRoles(roles?.data?.operatorRoles);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      setHasAccess(false);
      toast.error(t("common.error"));
    }
  };

  const getRole = async (id: string) => {
    try {
      const res = await RoleGQL({ id });
      if (res?.data?.operatorRole) {
        setTitle(res?.data?.operatorRole?.title);
        setPermissions(res?.data?.operatorRole?.permissions || []);
      } else {
        toast.error(t("common.error"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      getRole(selectedRole);
    }
  }, [selectedRole]);

  const handleCreateRole = async () => {
    if (title.trim().length === 0) {
      toast.error(t("common.nameRequired"));
      return;
    }
    try {
      const res = await CreateRoleGQL({
        input: {
          title,
          permissions,
        },
      });
      if (res?.data?.createOneOperatorRole) {
        toast.success(t("common.created"));
        setIsCreateDialogOpen(false);
        setRoles((prev) => [...prev, res?.data?.createOneOperatorRole]);
        setTitle("");
        setPermissions([]);
      } else {
        toast.error(t("common.error"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleUpdateRole = async (id: string) => {
    if (title.trim().length === 0) {
      toast.error(t("common.nameRequired"));
      return;
    }
    try {
      const res = await UpdateRoleGQL({
        id,
        input: {
          title,
          permissions,
        },
      });
      console.log(res);
      if (res?.data?.updateOneOperatorRole) {
        toast.success(t("common.updated"));
        setIsUpdateDialogOpen(false);
        // Update the roles list with the updated role
        setRoles((prev) =>
          prev.map((role) =>
            role.id === id
              ? {
                  ...role,
                  title,
                  permissions,
                }
              : role
          )
        );
        setTitle("");
        setPermissions([]);
        setSelectedRole("");
      } else {
        toast.error(t("common.error"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handlePermissionToggle = (permission: OperatorPermission) => {
    setPermissions((prev) => {
      if (prev?.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...(prev || []), permission];
      }
    });
  };

  const renderPermissionSwitches = () => {
    const permissionGroups = Object.values(OperatorPermission).reduce(
      (acc, permission) => {
        const group = permission.split("_")[0];
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
      },
      {} as Record<string, OperatorPermission[]>
    );

    return Object.entries(permissionGroups).map(([group, groupPermissions]) => (
      <div key={group} className="mb-6">
        <h6 className="mb-3">{t(`permissions.${group.toLowerCase()}`)}</h6>
        <div className="flex flex-wrap -mx-2">
          {groupPermissions.map((permission) => (
            <div className="w-1/2 px-2 mb-4" key={permission}>
              <Card className="p-2 flex items-center justify-between">
                <span>{t(`permissions.${permission}`)}</span>
                <Switch
                  checked={permissions?.includes(permission) || false}
                  onCheckedChange={() => handlePermissionToggle(permission)}
                />
              </Card>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const handleOpenCreateDialog = () => {
    setTitle("");
    setPermissions([]);
    setIsCreateDialogOpen(true);
  };

  const handleOpenUpdateDialog = (role: OperatorRole) => {
    setSelectedRole(role.id);
    setTitle(role.title);
    setPermissions(role.permissions || []);
    setIsUpdateDialogOpen(true);
  };

  if (!hasAccess) {
    return (
      <div className="flex-1 p-6 flex flex-col h-[80vh] justify-center items-center">
        <div className="text-center text-zinc-100 text-4xl font-bold">
          {t("errors.noAccess")}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold mb-4">{t("roles.title")}</h3>
        <Button onClick={handleOpenCreateDialog} className="add-button">
          {t("employees.addNew")}
        </Button>
      </div>

      <div className="flex flex-wrap mt-4 -mx-2">
        {roles.map((role) => (
          <div className="w-1/3 px-2 mb-4" key={role.id}>
            <Card
              className="p-4 cursor-pointer hover:shadow-lg"
              onClick={() => handleOpenUpdateDialog(role)}
            >
              <CardHeader>
                <CardTitle>{role.title}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>

      <MyDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title={t("roles.create")}
        showCloseButton={false}
        className=" min-w-[50vw]"
      >
        <div
          className="p-6 w-full custom-scrollbar"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <Input
            placeholder={t("common.name")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <h6 className="mb-3">{t("permissions.title")}</h6>
            {renderPermissionSwitches()}
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreateRole}>{t("common.create")}</Button>
        </div>
      </MyDialog>

      <MyDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={t("roles.update")}
        showCloseButton={false}
        className=" min-w-[50vw]"
      >
        <div
          className="p-6 w-full custom-scrollbar"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <Input
            placeholder={t("common.name")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <h6 className="mb-3">{t("permissions.title")}</h6>
            {renderPermissionSwitches()}
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setIsUpdateDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={() => handleUpdateRole(selectedRole)}>
            {t("common.update")}
          </Button>
        </div>
      </MyDialog>
    </div>
  );
};

export default RolesManagement;
