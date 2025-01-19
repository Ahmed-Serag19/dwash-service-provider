import { Plus, Clock, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center px-5">
      <Link to="/services?add=true">
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 h-10 w-52 flex items-center justify-center">
          <Plus className="mr-2 h-4 w-4" />
          <span className="translate-y-[3px]">{t("addService")}</span>
        </button>
      </Link>
      <Link to="/time-slots?add=true">
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 h-10 w-52 flex items-center justify-center">
          <Clock className="mr-2 h-4 w-4" />
          <span className="translate-y-[3px]">{t("addSlot")}</span>
        </button>
      </Link>
      <Link to="/wallet">
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 h-10 w-52 flex items-center justify-center">
          <DollarSign className="mr-2 h-4 w-4" />
          <span className="translate-y-[3px]">{t("viewEarnings")}</span>
        </button>
      </Link>
    </div>
  );
}
