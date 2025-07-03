import Table from "@/components/layouts/Table";
import "./HistoryTable.scss";
import { useEffect, useState } from "react";
import { handelGetHistory } from "@/store/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { omit } from "lodash";
import useDebounce from "@/hook/useDebounce";
import moment from "moment";

const HistoryTable = () => {
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};

  const dispatch = useDispatch();

  const [data, setData] = useState([
    {
      discription: "Completed a task “Introduction”",
      date: "2022-01-01",
      student: "John Doe",
      status: "Completed",
    },
    {
      discription: "Completed a task “Introduction”",
      date: "2022-01-01",
      student: "John Doe",
      status: "In progress",
    },
    {
      discription: "Completed a task “Introduction”",
      date: "2022-01-01",
      student: "John Doe",
      status: "Completed",
    },
    {
      discription: "Completed a task “Introduction”",
      date: "2022-01-01",
      student: "John Doe",
      status: "Completed",
    },
  ]);
  const [dataList, setDataList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortOrder: 1,
    sortKey: "",
  });
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, 300);

  const header = [
    {
      title: "Description",
      className: "wp-35 justify-content-start ms-20",
      isSort: true,
    },
    {
      title: "Date",
      className: "wp-25 justify-content-start",
      isSort: true,
    },
    {
      title: "Student",
      className: "wp-25 justify-content-start",
      isSort: true,
    },
    {
      title: "Status",
      className: "wp-15 justify-content-start",
      isSort: true,
    },
  ];
  const rowData = [];

  dataList?.data?.forEach((elem) => {
    const {createdAt,studentName ,status,title} = elem;
  const statusPending =  status ==='submitted'?'in progress':status
    let obj = [
      {
        value: `${statusPending.charAt(0).toUpperCase() + statusPending.slice(1)} a task “${title}”`,
        className: "wp-35 justify-content-start ms-20",
      },
      {
        value: `${moment(createdAt).format("MM-DD-YYYY")}`,
        className: "wp-25 justify-content-start",
      },
      {
        value: `${studentName} `,
        className: "wp-25 justify-content-start",
      },
      {
        value: (
          <div
            className={` br-40 ps-10 pe-10 pt-2 pb-2 text-12-400 font-gilroy-m ${
              statusPending === "completed"
                ? "bg-a12a color-ffff"
                :  statusPending === "pending" ? "bg-f293 color-ffff": "bg-1a1f color-971a"
            }`}
          >
            {statusPending}
          </div>
        ),
        className: "wp-15 justify-content-start",
      },
    ];
    rowData.push({ data: obj });
  });

  const fetchHistory = async (page = 1, obj) => {
    if (!profileData?._id) return;
    setloading(true);
    const offset = (page - 1) * rowsPerPage;
    const removeData = omit(obj, ["data", "total"]);
    const payload = {
      teacherId: profileData?._id,
      limit: rowsPerPage,
      offset,
      search: removeData?.search,
      sortOrder: removeData?.sortOrder,
      sortKey: removeData?.sortKey,
    };
    const res = await dispatch(handelGetHistory(payload));

    if (res?.status === 200) {
      setTotalRows(res?.data?.response[0]?.totalCount);
      setDataList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setloading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [profileData]);

  const handleSorting = (val) => {
   const value = val==='Description'?'title':val==='Date'?'createdAt':val==='Student'?'studentName':val==='Status'?'status':''
    const columnName = value;
    const { sortOrder } = dataList;
    const newData = {
      ...dataList,
      sortOrder: sortOrder === 1 ? -1 : 1,
      sortKey: columnName,
    };
    setDataList(newData);
    fetchHistory(currentPage, newData);
  };

  useEffect(() => {
    fetchHistory(currentPage, dataList);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    let newData = {
      ...dataList,
      search: debouncedValue,
    };
    setDataList(newData);
    fetchHistory(currentPage, newData);
  }, [debouncedValue]);


  return (
    <div id="historytable-container">
      <div className="cardBlock">
        <Table
        handleSorting={handleSorting}
          header={header}
          row={rowData}
          min="1000px"
          isSearchInput
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          searchPlaceholder="Search History"
          loading={loading}
          tableTitle="History"
          isFilter
        />
      </div>
    </div>
  );
};

export default HistoryTable;
