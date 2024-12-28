import { useState, useEffect } from "react";
import {
  CreateRoleGQL,
  RoleGQL,
  RolesGQL,
  UpdateRoleGQL,
  OperatorPermission,
  OperatorRole,
} from "../../graphql/requests";
import { Dialog } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import toast from "react-hot-toast";
import Switch from "../../components/common/Switch";
import { t } from "i18next";

export const RolesManagement = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [permissions, setPermissions] = useState<OperatorPermission[]>([]);
  const [roles, setRoles] = useState<OperatorRole[]>([]);

  useEffect(() => {
    RolesGQL({}).then((res) => {
      setRoles(res.data.operatorRoles);
    });
  }, []);

  useEffect(() => {
    if (selectedRole) {
      RoleGQL({ id: selectedRole }).then((res) => {
        const role = res.data.operatorRole;
        setTitle(role.title);
        setPermissions(role.permissions);
      });
    }
  }, [selectedRole]);

  const handleCreateRole = async () => {
    try {
      await CreateRoleGQL({
        input: {
          title,
          permissions: permissions,
        },
      });
      toast.success("Role created successfully");
      setIsCreateDialogOpen(false);
      const res = await RolesGQL({});
      setRoles(res.data.operatorRoles);
    } catch (error) {
      toast.error("Failed to create role");
    }
  };

  const handleUpdateRole = async () => {
    try {
      const res1 = await UpdateRoleGQL({
        id: selectedRole!,
        input: {
          title,
          permissions: permissions,
        },
      });
      console.log(res1);
      toast.success("Role updated successfully");
      setIsUpdateDialogOpen(false);
      const res = await RolesGQL({});
      setRoles(res.data.operatorRoles);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handlePermissionToggle = (permission: OperatorPermission) => {
    setPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      } else {
        return [...prev, permission];
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
        <h3 className="text-lg font-semibold mb-3">{group}</h3>
        <div className="grid grid-cols-2 gap-4">
          {groupPermissions.map((permission) => (
            <div
              key={permission}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span className="text-sm">{t(permission)}</span>
              <Switch
                disabled={false}
                checked={permissions.includes(permission)}
                onChange={() => handlePermissionToggle(permission)}
              />
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        Create New Role
      </Button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-4 border rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => {
              setSelectedRole(role.id);
              setIsUpdateDialogOpen(true);
            }}
          >
            <h3 className="text-lg font-semibold">{role.title}</h3>
          </div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Create New Role</h2>
          <Input
            placeholder="Role Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Permissions</h3>
            {renderPermissionSwitches()}
          </div>
          <Button onClick={handleCreateRole}>Create</Button>
        </div>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Update Role</h2>
          <Input
            placeholder="Role Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Permissions</h3>
            {renderPermissionSwitches()}
          </div>
          <Button onClick={handleUpdateRole}>Update</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default RolesManagement;
