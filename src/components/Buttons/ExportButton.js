import React from "react";
import { CSVLink } from "react-csv"

import { useLanguage } from "../../context/LanguageContext";
import "./ExportButton.css";

const ExportButton = (props) => {
  const { t } = useLanguage();
  return <div className="csv-button">
    <CSVLink className="csv-link" data={props.data} filename={"year-report.csv"}>{t("downloadYearReport")}</CSVLink>
  </div>
};

export default ExportButton;
