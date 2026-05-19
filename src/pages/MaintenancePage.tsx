import { Navigate } from "react-router-dom";
import MaintenanceView from "../components/maintenance/MaintenanceView";
import { useTracking } from "../context/TrackingContext";
import type { CatalogKind } from "../interfaces/catalog";

type EditableUserKey = "role" | "status";

export default function MaintenancePage() {
  const {
    authUser,
    catalogs,
    newCatalogItems,
    setAuthUser,
    setCatalogs,
    setNewCatalogItems,
    setUsers,
    userCanMaintain,
    users,
  } = useTracking();

  function updateUser(userId: string, key: EditableUserKey, value: string) {
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, [key]: value } : user)),
    );
    if (authUser?.id === userId) {
      setAuthUser((current) => (current ? { ...current, [key]: value } : current));
    }
  }

  function removeUser(userId: string) {
    setUsers((current) => current.filter((user) => user.id !== userId));
  }

  function addCatalogItem(kind: CatalogKind) {
    const value = newCatalogItems[kind].trim();
    if (!value) return;

    setCatalogs((current) => {
      if (current[kind].some((item) => item.toLowerCase() === value.toLowerCase())) {
        return current;
      }
      return {
        ...current,
        [kind]: [...current[kind], value].sort(),
      };
    });
    setNewCatalogItems((current) => ({ ...current, [kind]: "" }));
  }

  function removeCatalogItem(kind: CatalogKind, value: string) {
    setCatalogs((current) => ({
      ...current,
      [kind]: current[kind].filter((item) => item !== value),
    }));
  }

  function updateCatalogDraft(kind: CatalogKind, value: string) {
    setNewCatalogItems((current) => ({ ...current, [kind]: value }));
  }

  if (!authUser || !userCanMaintain) {
    return <Navigate replace to="/orders" />;
  }

  return (
    <MaintenanceView
      catalogs={catalogs}
      currentUser={authUser}
      newCatalogItems={newCatalogItems}
      users={users}
      onAddCatalogItem={addCatalogItem}
      onCatalogDraftChange={updateCatalogDraft}
      onRemoveCatalogItem={removeCatalogItem}
      onRemoveUser={removeUser}
      onUpdateUser={updateUser}
    />
  );
}
