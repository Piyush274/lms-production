import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import { useState } from "react";
import "./ContactlogTable.scss";
const ContactlogTable = () => {
  //const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const header = [
    {
      title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>Location</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Receiving Agent</div> ,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Date Created</div> ,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Type</div> ,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Contact /Student Name</div> ,
      className: "wp-20 justify-content-start ",
      isSort: false,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Email</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Phone Number</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Details</div>,
      className: "wp-60 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Due Date</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Contact Attempts (Comment)</div> ,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title:<div  style={{fontFamily : "GilroySemibold"}}>Check if complete</div> ,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div  style={{fontFamily : "GilroySemibold"}}>Active?</div> ,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
  ];

  const data = [
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
    {
      Location: "May 6, 2024 11:00 AM",
      ReceivingAgent: "##############",
      DateCreated: "Alexander ",
      Type: "Dave 123456",
      ContacStudent: "1234567890",
      email: "example@gmail.com",
      Phone: "1234567890",
      Details:
        "Manoshi Stoker 2017887420 - 9 year old son takes guitar lessons at YMCA, but his teacher will be unavailable during the summer, and is interested in getting on board with some instruction here. 7/8/22 lvm",
      DueDate: "(NJ) Kevin Bagar",
      ContactAttempts: "(NJ) Kevin Bagar",

      Active: "(NJ) Kevin Bagar",
    },
  ];

  const rowData = [];
  data?.forEach((elem) => {
    const {
      Location,
      ReceivingAgent,
      DateCreated,
      Type,
      ContacStudent,
      email,
      Phone,
      Details,
      DueDate,
      ContactAttempts,
      Active,
    } = elem;
    let obj = [
      {
        value: <div className="ps-20" style={{fontFamily : "GilroyMedium"}}>{Location}</div>,
        className: "wp-20 justify-content-start  ",
      },
      {
        value: ReceivingAgent,
        className: "wp-20 justify-content-start ",
      },
      {
        value: DateCreated,
        className: "wp-20 justify-content-start",
      },
      {
        value: Type,
        className: "wp-20 justify-content-start",
      },
      {
        value: ContacStudent,
        className: "wp-20 justify-content-start",
      },
      {
        value: email,
        className: "wp-20 justify-content-start",
      },
      {
        value: Phone,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20">{Details}</div>,
        className: "wp-60 justify-content-start",
      },
      {
        value: <div className="ms-20">{DueDate}</div>,
        className: "wp-20 justify-content-start",
      },
      {
        value: ContactAttempts,
        className: "wp-20 justify-content-start",
      },
      {
        value: (
          <div className="f-center mt-4">
            <CheckBox className="" />
          </div>
        ),
        className: "wp-20 justify-content-center ",
      },
      {
        value: Active,
        className: "wp-20 justify-content-start",
      },
    ];
    rowData.push({ data: obj });
  });

  const totalRows = rowData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);
  return (
    <>
      <div className="wp-100 contact-table">
        <Table
          header={header}
          min="2900px"
          isSearchInput
          row={currentRows} 
          totalRows={totalRows} 
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          tableTitle="Contact Logs"
          isFilter={true}
          headerTitleClass="headerTitleClass"
        />
      </div>
    </>
  );
};

export default ContactlogTable;
