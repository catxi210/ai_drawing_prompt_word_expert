import { useTranslations } from "next-intl";
import React from "react";
import History from "../../components/history";

const GenStyleImageBottom = () => {
  const t = useTranslations();
  return (
    <div className="@container">
      <div className="flex">
        <div className="flex flex-1 justify-center">
          <h2 className="text-xl font-bold">{t("switch.history")}</h2>
        </div>
      </div>
      <History type="style" />
    </div>
  );
};

export default GenStyleImageBottom;
