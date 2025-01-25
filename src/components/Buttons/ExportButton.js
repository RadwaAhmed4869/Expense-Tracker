import React from "react";
import { CSVLink } from "react-csv"

import "./ExportButton.css";

const ExportButton = (props) => {
  return <div className="csv-button">
    <CSVLink className="csv-link" data={props.data} filename={"year-report.csv"}>Download Year Report</CSVLink>
  </div>
};

export default ExportButton;
