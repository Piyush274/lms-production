import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";

import { useState } from "react";
import "./VibecheckTable.scss";
const VibecheckTable = () => {
  //const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const header = [
    {
      title: <div className="ps-20"  style={{fontFamily : "GilroySemibold"}}>Start Time</div>,
      className: "wp-20 justify-content-center ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>End Time</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
   {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>First Name</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}> Last Name</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Phone</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Email</div>,
      className: "wp-20 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Type</div>,
      className: "wp-30 justify-content-start ",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}> Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div className="ms-20"  style={{fontFamily : "GilroySemibold"}}>Calendar</div>,
      className: "wp-20 justify-content-start",
      isSort: true,
    },
  ];

  const data = [
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
    {
      StartTime: "Charlie Roy",
      EndTime: "6:00 PM",
      FName: "Alexander Dave ",
      LName: "Alexander Dave",
      Phone: "1234567890",
      Email: "example@gmail.com",
      Type: "Make Up Drum Lesson -",
      Calendar1: "(NJ) Kevin Bagar",
      Calendar2: "(NJ) Kevin Bagar",
      Calendar3: "(NJ) Kevin Bagar",
      Calendar4: "(NJ) Kevin Bagar",
      Calendar5: "(NJ) Kevin Bagar",
      Calendar6: "(NJ) Kevin Bagar",
      Calendar7: "(NJ) Kevin Bagar",
      Calendar8: "(NJ) Kevin Bagar",
      Calendar9: "(NJ) Kevin Bagar",
      Calendar10: "(NJ) Kevin Bagar",
    },
  ];

  const rowData = [];
  data?.forEach((elem) => {
    const {
      StartTime,
      EndTime,
      FName,
      LName,
      Phone,
      Email,
      Type,
      Calendar1,
      Calendar2,
      Calendar3,
      Calendar4,
      Calendar5,
      Calendar6,
      Calendar7,
      Calendar8,
      Calendar9,
      Calendar10,
    } = elem;
    let obj = [
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{StartTime}</div> ,
        className: "wp-20 justify-content-center  ",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{EndTime}</div> ,
        className: "wp-20 justify-content-start ",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{FName}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{LName}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value:<div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Phone}</div>  ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Email}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Type}</div> ,
        className: "wp-30 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar1}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar2}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar3}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value:<div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar4}</div>  ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar5}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar6}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar7}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar8}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar9}</div> ,
        className: "wp-20 justify-content-start",
      },
      {
        value: <div className="ms-20" style={{fontFamily : "GilroyMedium"}}>{Calendar10}</div> ,
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
      <div className="" id="card-table">
        <div className="d-flex gap-4 flex-wrap">
          <div className="table-1 border">
            <div className="titile-card">
              <h1 className="cardtable-title">Untitled</h1>
            </div>
            <div>
              <li>1. Review SAG tab</li>
              <li>1. Review SAG tab</li>
              <li>1. Review SAG tab</li>
            </div>
          </div>
          <div className="table-2 border">
            <div className="titile-card">
              <h1 className="cardtable-title">End of Day Agenda</h1>
            </div>
            <div>
              <li>1. Review free trials booked (CC on file?)</li>
              <li>1. Review free trials booked (CC on file?)</li>
              <li>1. Review free trials booked (CC on file?)</li>
              <li>1. Review free trials booked (CC on file?)</li>
              <li>1. Review free trials booked (CC on file?)</li>
            
            </div>
          </div>
          <div className="Scrolltable brave-scroll">
            <div className="table-3  ">
              <div className="titile-card">
                <h1 className="cardtable-title">Reminders</h1>
              </div>
              <div>
                <div className="d-flex justify-content-between desc">
                  <span>1. Review free trials booked (CC on file?)</span>
                  <span>20</span>
                </div>
                <div className="titile-card">
                <h1 className="cardtable-title">Concert Registration Deadlines</h1>
              </div>
              <div className="d-flex justify-content-around desc">
                  <span>NJ</span>
                  <span>NJ</span>
                  <span>NJ</span>
                </div>
                <div className="d-flex justify-content-around desc">
                  <span>5/14/24</span>
                  <span>5/14/24</span>
                  <span>5/14/24</span>
                </div>
                <div className="d-flex justify-content-around desc">
                  <span>-140 days left</span>
                  <span>-140 days left</span>
                  <span>-140 days left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wp-100 vibe-table" style={{marginTop : "36px"}}>
        <Table
          header={header}
        
          min="3200px"
          isSearchInput
          row={currentRows} 
          totalRows={totalRows} 
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          tableTitle="Vibe Check"
          isFilter={true}
          searchPlaceholder = "Search"
           headerTitleClass = "headerTitleClass"
        />
      </div>
    </>
  );
};

export default VibecheckTable;
