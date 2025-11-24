import { decryptData } from "../../utilities/utils";
import AdminMenu from "../admin-menu";
import CapoflottaMenu from "../capoflotta-menu";
import DittaIndividualeMenu from "../ditta-individuale-menu";
import SuperAdminMenu from "../superadmin-menu";

const DynamicMenu = () => {
  const user = decryptData("nccUser");

  if (!user) {
    return null;
  }

  if (user.superAdmin === true) {
    return <SuperAdminMenu />;
  }

  if (user.userType === "capoflotta") {
    return <CapoflottaMenu />;
  }

  if (user.userType === "ditta_individuale") {
    return <DittaIndividualeMenu />;
  }

  return <AdminMenu />;
};

export default DynamicMenu;

