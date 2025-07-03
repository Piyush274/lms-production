import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import { useState } from "react";
import "./TerminationTable.scss"
const Terminations =() =>{

    //const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const header = [
      
        {
          title: <div className="ps-20" style={{fontFamily : "GilroySemibold"}}>Instructor</div>,
          className: "wp-30 justify-content-center ",
          isSort: true,
        },
        {
          title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Time</div>,
          className: "wp-30 justify-content-start ",
          isSort: true,
        },
        {
          title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>First Name</div>,
          className: "wp-30 justify-content-start ",
          isSort: true,
        },
        {
          title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Phone</div>,
          className: "wp-30 justify-content-start ",
          isSort: true,
        },
        {
          title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Email</div>,
          className: "wp-30 justify-content-start ",
          isSort: true,
        },
        {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Type</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title:<div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div> ,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title:<div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div> ,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Initial & Comment</div>,
            className: "wp-30 justify-content-start ",
            isSort: true,
          },
          {
            title: <div className="ms-20" style={{fontFamily : "GilroySemibold"}}>Check if complete</div>,
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
            Email :"example@gmail.com",
            Type :"Multiple Alerts",
            InitialComment1 : "example@gmail.com",
            InitialComment2 : "example@gmail.com",
            InitialComment3 : "example@gmail.com",
            InitialComment4 : "example@gmail.com",
            InitialComment5 : "example@gmail.com",
            InitialComment6 : "example@gmail.com",
            InitialComment7 : "example@gmail.com",
            InitialComment8 : "example@gmail.com",

          
        },
        { 
            Instructor: "Charlie Roy",
            Time: "6:00 PM",
            FName: "Alexander Dave 123456",
            Phone: "1234567890",
            Email :"example@gmail.com",
            Type :"Multiple Alerts",
            InitialComment1 : "example@gmail.com",
            InitialComment2 : "example@gmail.com",
            InitialComment3 : "example@gmail.com",
            InitialComment4 : "example@gmail.com",
            InitialComment5 : "example@gmail.com",
            InitialComment6 : "example@gmail.com",
            InitialComment7 : "example@gmail.com",
            InitialComment8 : "example@gmail.com",

          
        },
        { 
          Instructor: "Charlie Roy",
          Time: "6:00 PM",
          FName: "Alexander Dave 123456",
          Phone: "1234567890",
          Email :"example@gmail.com",
          Type :"Multiple Alerts",
          InitialComment1 : "example@gmail.com",
          InitialComment2 : "example@gmail.com",
          InitialComment3 : "example@gmail.com",
          InitialComment4 : "example@gmail.com",
          InitialComment5 : "example@gmail.com",
          InitialComment6 : "example@gmail.com",
          InitialComment7 : "example@gmail.com",
          InitialComment8 : "example@gmail.com",

        
      },
      { 
          Instructor: "Charlie Roy",
          Time: "6:00 PM",
          FName: "Alexander Dave 123456",
          Phone: "1234567890",
          Email :"example@gmail.com",
          Type :"Multiple Alerts",
          InitialComment1 : "example@gmail.com",
          InitialComment2 : "example@gmail.com",
          InitialComment3 : "example@gmail.com",
          InitialComment4 : "example@gmail.com",
          InitialComment5 : "example@gmail.com",
          InitialComment6 : "example@gmail.com",
          InitialComment7 : "example@gmail.com",
          InitialComment8 : "example@gmail.com",

        
      },
      { 
        Instructor: "Charlie Roy",
        Time: "6:00 PM",
        FName: "Alexander Dave 123456",
        Phone: "1234567890",
        Email :"example@gmail.com",
        Type :"Multiple Alerts",
        InitialComment1 : "example@gmail.com",
        InitialComment2 : "example@gmail.com",
        InitialComment3 : "example@gmail.com",
        InitialComment4 : "example@gmail.com",
        InitialComment5 : "example@gmail.com",
        InitialComment6 : "example@gmail.com",
        InitialComment7 : "example@gmail.com",
        InitialComment8 : "example@gmail.com",

      
    },
    { 
        Instructor: "Charlie Roy",
        Time: "6:00 PM",
        FName: "Alexander Dave 123456",
        Phone: "1234567890",
        Email :"example@gmail.com",
        Type :"Multiple Alerts",
        InitialComment1 : "example@gmail.com",
        InitialComment2 : "example@gmail.com",
        InitialComment3 : "example@gmail.com",
        InitialComment4 : "example@gmail.com",
        InitialComment5 : "example@gmail.com",
        InitialComment6 : "example@gmail.com",
        InitialComment7 : "example@gmail.com",
        InitialComment8 : "example@gmail.com",

      
    },
    { 
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email :"example@gmail.com",
      Type :"Multiple Alerts",
      InitialComment1 : "example@gmail.com",
      InitialComment2 : "example@gmail.com",
      InitialComment3 : "example@gmail.com",
      InitialComment4 : "example@gmail.com",
      InitialComment5 : "example@gmail.com",
      InitialComment6 : "example@gmail.com",
      InitialComment7 : "example@gmail.com",
      InitialComment8 : "example@gmail.com",

    
  },
  { 
      Instructor: "Charlie Roy",
      Time: "6:00 PM",
      FName: "Alexander Dave 123456",
      Phone: "1234567890",
      Email :"example@gmail.com",
      Type :"Multiple Alerts",
      InitialComment1 : "example@gmail.com",
      InitialComment2 : "example@gmail.com",
      InitialComment3 : "example@gmail.com",
      InitialComment4 : "example@gmail.com",
      InitialComment5 : "example@gmail.com",
      InitialComment6 : "example@gmail.com",
      InitialComment7 : "example@gmail.com",
      InitialComment8 : "example@gmail.com",

    
  },
  { 
    Instructor: "Charlie Roy",
    Time: "6:00 PM",
    FName: "Alexander Dave 123456",
    Phone: "1234567890",
    Email :"example@gmail.com",
    Type :"Multiple Alerts",
    InitialComment1 : "example@gmail.com",
    InitialComment2 : "example@gmail.com",
    InitialComment3 : "example@gmail.com",
    InitialComment4 : "example@gmail.com",
    InitialComment5 : "example@gmail.com",
    InitialComment6 : "example@gmail.com",
    InitialComment7 : "example@gmail.com",
    InitialComment8 : "example@gmail.com",

  
},
{ 
    Instructor: "Charlie Roy",
    Time: "6:00 PM",
    FName: "Alexander Dave 123456",
    Phone: "1234567890",
    Email :"example@gmail.com",
    Type :"Multiple Alerts",
    InitialComment1 : "example@gmail.com",
    InitialComment2 : "example@gmail.com",
    InitialComment3 : "example@gmail.com",
    InitialComment4 : "example@gmail.com",
    InitialComment5 : "example@gmail.com",
    InitialComment6 : "example@gmail.com",
    InitialComment7 : "example@gmail.com",
    InitialComment8 : "example@gmail.com",

  
},
{ 
  Instructor: "Charlie Roy",
  Time: "6:00 PM",
  FName: "Alexander Dave 123456",
  Phone: "1234567890",
  Email :"example@gmail.com",
  Type :"Multiple Alerts",
  InitialComment1 : "example@gmail.com",
  InitialComment2 : "example@gmail.com",
  InitialComment3 : "example@gmail.com",
  InitialComment4 : "example@gmail.com",
  InitialComment5 : "example@gmail.com",
  InitialComment6 : "example@gmail.com",
  InitialComment7 : "example@gmail.com",
  InitialComment8 : "example@gmail.com",


},
{ 
  Instructor: "Charlie Roy",
  Time: "6:00 PM",
  FName: "Alexander Dave 123456",
  Phone: "1234567890",
  Email :"example@gmail.com",
  Type :"Multiple Alerts",
  InitialComment1 : "example@gmail.com",
  InitialComment2 : "example@gmail.com",
  InitialComment3 : "example@gmail.com",
  InitialComment4 : "example@gmail.com",
  InitialComment5 : "example@gmail.com",
  InitialComment6 : "example@gmail.com",
  InitialComment7 : "example@gmail.com",
  InitialComment8 : "example@gmail.com",


},
{ 
  Instructor: "Charlie Roy",
  Time: "6:00 PM",
  FName: "Alexander Dave 123456",
  Phone: "1234567890",
  Email :"example@gmail.com",
  Type :"Multiple Alerts",
  InitialComment1 : "example@gmail.com",
  InitialComment2 : "example@gmail.com",
  InitialComment3 : "example@gmail.com",
  InitialComment4 : "example@gmail.com",
  InitialComment5 : "example@gmail.com",
  InitialComment6 : "example@gmail.com",
  InitialComment7 : "example@gmail.com",
  InitialComment8 : "example@gmail.com",


},
{ 
  Instructor: "Charlie Roy",
  Time: "6:00 PM",
  FName: "Alexander Dave 123456",
  Phone: "1234567890",
  Email :"example@gmail.com",
  Type :"Multiple Alerts",
  InitialComment1 : "example@gmail.com",
  InitialComment2 : "example@gmail.com",
  InitialComment3 : "example@gmail.com",
  InitialComment4 : "example@gmail.com",
  InitialComment5 : "example@gmail.com",
  InitialComment6 : "example@gmail.com",
  InitialComment7 : "example@gmail.com",
  InitialComment8 : "example@gmail.com",


},
      ];

      const rowData = [];
      data?.forEach((elem) => {
        const { Instructor, Time, FName, Phone ,Email , Type ,InitialComment1 , InitialComment2,InitialComment3,InitialComment4,InitialComment5,InitialComment6,InitialComment7,InitialComment8} = elem;
        let obj = [
         
          {
            value: Instructor,
            className: "wp-30 justify-content-center  ",
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
            value: InitialComment1,
            className: "wp-30 justify-content-start ",
          },
       
          {
            value: InitialComment2,
            className: "wp-30 justify-content-start ",
          },
          {
            value: InitialComment3,
            className: "wp-30 justify-content-start ",
          },
          {
            value: InitialComment4,
            className: "wp-30 justify-content-start ",
          },
          {
            value: InitialComment5,
            className: "wp-30 justify-content-start ",
          },
          {
            value: InitialComment6,
            className: "wp-30 justify-content-start",
          },
          {
            value: InitialComment7,
            className: "wp-30 justify-content-start ",
          },
          {
            value: InitialComment8,
            className: "wp-30 justify-content-start ",
          },
          {
            value: (
              <div className="f-center mt-4">
                <CheckBox className="" />
              </div>
            ),
            className: "wp-30 justify-content-center ",
          },

        ];
        rowData.push({ data: obj });
      });
      const totalRows = rowData.length;
      const startIndex = (currentPage - 1) * rowsPerPage;
      const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);
    return (
        <>
              <div className="wp-100 terminal-table">
          <Table
            header={header}
           
            min="2800px"
            isSearchInput
           row={currentRows} 
                totalRows={totalRows} 
                rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onSearch={setSearchTerm}
            tableTitle = "Terminations"
            isFilter={true}
            searchPlaceholder = "Search"
             headerTitleClass = "headerTitleClass"
          />
        </div>
        </>
    )
}

export default Terminations;