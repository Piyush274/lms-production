import { useEffect, useState } from "react";
import axios from "axios";
import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import "./StudentrepoTable.scss";

const StudentrepoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/dashboard`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const header = [
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Student Name</div>,
      className: "wp-10 ps-20 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Length of Stay</div>,
      className: "wp-8 justify-content-start",
      isSort: true,
    },
    {
      title: (
        <div style={{ fontFamily: "GilroySemibold" }}>Account Balance</div>
      ),
      className: "wp-8 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>No Shows</div>,
      className: "wp-6 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>LCXL</div>,
      className: "wp-7 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>ECXL</div>,
      className: "wp-7 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Performance</div>,
      className: "wp-12 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Last Login</div>,
      className: "wp-10 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Action Taken</div>,
      className: "wp-10 justify-content-start",
      isSort: true,
    },
    {
      title: <div style={{ fontFamily: "GilroySemibold" }}>Outreach</div>,
      className: "wp-8 justify-content-start",
      isSort: true,
    },
    {
      title: (
        <div style={{ fontFamily: "GilroySemibold" }}>
          Instructor Assessment
        </div>
      ),
      className: "wp-12 justify-content-start",
      isSort: true,
    },
     {
      title: (
        <div style={{ fontFamily: "GilroySemibold" }}>
          Cumulative
        </div>
      ),
      className: "wp-12 justify-content-start",
      isSort: true,
    },
     {
      title: (
        <div style={{ fontFamily: "GilroySemibold" }}>
          Overall Health
        </div>
      ),
      className: "wp-12 justify-content-start",
      isSort: true,
    },
     {
      title: (
        <div style={{ fontFamily: "GilroySemibold" }}>
          Flight Risk
        </div>
      ),
      className: "wp-12 justify-content-start",
      isSort: true,
    },
  ];

  const rowData = [];
  console.log(data)
  data.response?.forEach((elem) => {
    const {
      studentInfo,
      lengthOfStay,
      accBalance,
      noShows,
      lcxl,
      ecxl,
      performance,
      lastLogin,
      actionTaken,
      outReach,
      instructorAccessment,
      cumulative,
      overallhealth,
      flight_risk
    } = elem;

    let obj = [
      {
        value: (
          <div className="ps-20" style={{ fontFamily: "GilroyMedium" }}>
            {studentInfo?.firstName} {studentInfo?.lastName}
          </div>
        ),
        className: "wp-10 justify-content-start",
      },
      {
        value: lengthOfStay,
        className: "wp-8 justify-content-start",
      },
      {
        value: accBalance,
        className: "wp-8 justify-content-start",
      },
      {
        value: noShows,
        className: "wp-6 justify-content-start",
      },
      {
        value: lcxl,
        className: "wp-7 justify-content-start",
      },
      {
        value: ecxl,
        className: "wp-7 justify-content-start",
      },
      {
        value: performance,
        className: "wp-12 justify-content-start",
      },
      {
        value: lastLogin,
        className: "wp-10 justify-content-start",
      },
      {
        value: actionTaken,
        className: "wp-10 justify-content-start",
      },
      {
        value: outReach,
        className: "wp-8 justify-content-start",
      },
      {
        value: instructorAccessment,
        className: "wp-12 justify-content-start",
      },
      {
        value: cumulative,
        className: "wp-12 justify-content-start",
      },
      {
        value: overallhealth,
        className: "wp-12 justify-content-start",
      },
      {
        value: flight_risk,
        className: "wp-12 justify-content-start",
      },
    ];
    rowData.push({ data: obj });
  });

  const totalRows = rowData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = rowData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <>
      <div className="wp-100 student-repo">
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
          tableTitle="Student Report"
          isFilter={true}
          searchPlaceholder="Search"
          headerTitleClass="headerTitleClass"
          headerfont="headerfont"
        />
      </div>
    </>
  );
};

export default StudentrepoTable;
