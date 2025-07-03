import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import { useState } from "react";
import "./LogTable.scss";
const LogTable = () => {
  //const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const header = [
    {
      title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>Start Time</div>,
      className: "wp-40 justify-content-start ",
      isSort: true,
    },
    {
      title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>End Time</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title:  <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
  ];

  const data = [
    {
      Instructor: "May 6, 2024 11:00 AM",
      Time: "6:00 PM",
      FName: "Alexander",
    },
    {
      Instructor: "May 6, 2024 11:00 AM",
      Time: "6:00 PM",
      FName: "Alexander",
    },
    {
      Instructor: "May 6, 2024 11:00 AM",
      Time: "6:00 PM",
      FName: "Alexander",
    },
    {
      Instructor: "May 6, 2024 11:00 AM",
      Time: "6:00 PM",
      FName: "Alexander",
    },
  ];

  const rowData = [];
  data?.forEach((elem) => {
    const { Instructor, Time, FName } = elem;
    let obj = [
      {
        value: <div className="ps-20" style={{fontFamily : "GilroyMedium"}}>{Instructor}</div>,
        className: "wp-40 justify-content-start  ",
      },
      {
        value: Time,
        className: "wp-30 justify-content-start ",
      },
      {
        value: FName,
        className: "wp-30 justify-content-start ",
      },
    ];
    rowData.push({ data: obj });
  });
  return (
    <>
      <div>
        <div className="row">
          <div className="col-xxl-6 col-12">
            <div className="wp-100 table-log log1-table">
              <Table
                header={header}
                row={rowData}
                //   min="2800px"
                isSearchInput
                // totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onSearch={setSearchTerm}
                tableTitle="PracticePad Interface"
                searchPlaceholder="Search"
                 headerTitleClass = "headerTitleClass"
              />
            </div>
          </div>
          <div className="col-xxl-6 col-12">
            <div className="wp-100 table-log log1-table">
              <Table
                header={header}
                row={rowData}
                //   min="2800px"
                isSearchInput
                // totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onSearch={setSearchTerm}
                tableTitle="Acuity Scheduler"
                searchPlaceholder="Search"
                 headerTitleClass = "headerTitleClass"
              />
            </div>
          </div>
          <div className="col-xxl-6 col-12">
            <div className="wp-100 table-log log1-table">
              <Table
                header={header}
                row={rowData}
                //   min="2800px"
                isSearchInput
                // totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onSearch={setSearchTerm}
                tableTitle="User Management"
                searchPlaceholder="Search"
                 headerTitleClass = "headerTitleClass"
              />
            </div>
          </div>
          <div className="col-xxl-6 col-12">
            <div className="wp-100 table-log log1-table">
              <Table
                header={header}
                row={rowData}
                //   min="2800px"
                isSearchInput
                // totalRows={totalRows}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onSearch={setSearchTerm}
                tableTitle="Billing"
                searchPlaceholder="Search"
                 headerTitleClass = "headerTitleClass"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogTable;
