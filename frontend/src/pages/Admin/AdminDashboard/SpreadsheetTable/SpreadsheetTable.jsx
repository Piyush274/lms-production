import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import { useState } from "react";
import "./SpreadsheetTable.scss";
const SpreadsheetTable = () => {
  //const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const header = [
    {
      title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>Destination</div>,
      className: "wp-50 justify-content-start ",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Time</div>,
      className: "wp-50 justify-content-start ",
      isSort: true,
    },
  ];

  const data = [
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
    {
      Instructor: "Subscription Exceptions",
      Time: "6:00 PM",
    },
    {
      Instructor: "QNS Student/Instructor Concert Attendance - Google Sheets",
      Time: "6:00 PM",
    },
  ];

  const rowData = [];
  data?.forEach((elem) => {
    const { Instructor, Time } = elem;
    let obj = [
      {
        value: <div className="ps-20" style={{fontFamily : "GilroyMedium"}}>{Instructor}</div>,
        className: "wp-50 justify-content-start  ",
      },
      {
        value: Time,
        className: "wp-50 justify-content-start ",
      },
    ];
    rowData.push({ data: obj });
  });

  
  const totalRows = rowData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);
  return (
    <>
      <div className="wp-100 spreadsheet-table">
        <Table
          header={header}
       
          //   min="2800px"
          isSearchInput
          row={currentRows} 
          totalRows={totalRows} 
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          tableTitle="Spreadsheet links"
          isFilter={true}
          searchPlaceholder="Search"
           headerTitleClass = "headerTitleClass"
        />
      </div>
    </>
  );
};

export default SpreadsheetTable;
