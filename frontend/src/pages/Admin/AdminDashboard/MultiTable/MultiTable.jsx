import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import React, { useState } from "react";
import "./MultiTable.scss"
const MultiTable = () => {
  //const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const header = [
    {
      title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>(Location) Instructor</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Time</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>First Name</div> ,
      className: "wp-30 justify-content-start ",
      isSort: false,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Phone</div> ,
      className: "wp-30 justify-content-start ",
      isSort: false,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Email</div> ,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Type</div> ,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
  ];

  const data = [
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
    {
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Multiple Alerts",
      InitialComment: "example@gmail.com",
    },
  ];

  const rowData = [];
  data?.forEach((elem) => {
    const { Instructor, Time, FName, Phone, Email, Type, InitialComment } =
      elem;
    let obj = [
      {
        value: <div className="ps-20" style={{fontFamily : "GilroyMedium"}}>{Instructor}</div>,
        className: "wp-30 justify-content-start  ",
      },
      {
        value: Time,
        className: "wp-30 justify-content-start ",
      },
      {
        value: FName,
        className: "wp-30 justify-content-start ",
      },
      {
        value: Phone,
        className: "wp-30 justify-content-start ",
      },
      {
        value: Email,
        className: "wp-30 justify-content-start ",
      },
      {
        value: Type,
        className: "wp-30 justify-content-start ",
      },
      {
        value: InitialComment,
        className: "wp-30 justify-content-start ",
      },
    ];
    rowData.push({ data: obj });
  });

  const tabledata = [
    { location: 'Virtual', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'Virtual', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'Virtual', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'NJ/Q', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'NJ/Q', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'Devid', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
    { location: 'Devid', plans: 'Basic', price: '$1,860.00', savings: '$1,860.00', monthly: '$1,860.00' },
  ];

  const groupData = (data) => {
    return data.reduce((acc, curr) => {
      const lastGroup = acc[acc.length - 1];
      if (!lastGroup || lastGroup.location !== curr.location) {
        acc.push({ location: curr.location, rows: [] });
      }
      acc[acc.length - 1].rows.push(curr);
      return acc;
    }, []);
  };

  const groupedData = groupData(tabledata);

  const totalRows = rowData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);
  return (
    <>
    <div className="multi-cardtable brave-scroll ">
      <table className="desc  brave-scroll">
        <thead>
          <tr>
            <th>Location</th>
            <th>Plans</th>
            <th>Price</th>
            <th>Savings</th>
            <th>Monthly</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((group, index) => (
            <React.Fragment key={index}>
              {group.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{row.location}</td>
                  <td>{row.plans}</td>
                  <td>{row.price}</td>
                  <td>{row.savings}</td>
                  <td>{row.monthly}</td>
                </tr>
              ))}
             
              <tr>
                <td colSpan="5"></td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>


      <div className="wp-100 multi-table">
        <Table
          header={header}
        
          min="1600px"
          isSearchInput
          row={currentRows} 
                totalRows={totalRows} 
                rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          tableTitle="Multi-Month Packages"
          isFilter={true}
          searchPlaceholder = "Search"
           headerTitleClass = "headerTitleClass"
        />
      </div>
    </>
  );
};

export default MultiTable;
