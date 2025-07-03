import Table from "@/components/layouts/Table";
import "./ParentHistroyTable.scss";
import { useEffect, useState } from "react";
import { icons } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { getparentdashboard } from "@/store/globalSlice";
import moment from "moment";
import useDebounce from "@/hook/useDebounce";

const ParentHistroyTable = () => {
 
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [totalRows, setTotalRows] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setloading] = useState(false);
  // const reduxData = useSelector((state) => state.global);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState(1);

  useEffect(()=>{
    getUserData();
  },[])


    const getUserData = async (page = 1, search = "" ,value="" ,newOrder = "") => {

      setloading(true);
      const offset = (page - 1) * rowsPerPage;
      const payload = {
        limit: rowsPerPage,
        offset,
        search,
        sortKey: value,
        sortOrder: newOrder
   
      };

      const res = await dispatch(getparentdashboard(payload));
  
      if (res?.status === 200) {
        setData(res?.data?.response?.history[0]?.data);
        setTotalRows(res?.data?.response?.history[0]?.totalCount);
        setloading(false);
      }
      setloading(false);
    };

    const handleSorting = (val) => {
      const value = val==='Description'?'title':val==='Date'?'createdAt':val==='Child'?'studentName':val==='Status'?'status':''
 
      const newOrder =  order === 1 ? -1 : 1;
      setSortBy(value);
      setOrder(newOrder);
      const search ="";
       getUserData(currentPage,search  ,value, newOrder);
    };

    useEffect(() => {
      getUserData(currentPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
   
      getUserData(currentPage, debouncedSearch);
    }, [debouncedSearch]);

  
  const header = [
    {
      title: "Description",
      className: "wp-35 justify-content-start ms-20 ",
      isSort: true,
    },
    {
      title:  "Date" ,
      className: "wp-25 justify-content-start",
      isSort: true,
    },
    {
      title:  "Child" ,
      className: "wp-25 justify-content-start",
      isSort: true,
    },
    {
      title:  "Status" ,
      className: "wp-15 justify-content-start",
      isSort: true,
    },
    {
        title:  "Action",
        className: "wp-15 justify-content-center",
        isSort: false,
      },
  ];
  const rowData = [];
  data?.forEach((elem) => {
    const { createdAt, studentName, status,title } = elem;
    const formattedDate = moment(createdAt).format('YYYY-MM-DD');

  const statusPending =  status ==='submitted'?'in progress':status

    let obj = [
      {
        value: `${statusPending.charAt(0).toUpperCase() + statusPending.slice(1)} a task  “${title}”`,
        className: "wp-35 justify-content-start ms-20",
      },
      {
        value: `${formattedDate}`,
        className: "wp-25 justify-content-start",
      },
      {
        value: `${studentName}`,
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
{
    value: (
        <>
        
            <img src={icons.Actionbtn} alt="right" className="img-fluid" />
     
        </>
      ),
      className: "wp-15 justify-content-center",
}
     
    ];
    rowData.push({ data: obj });
  });

  return (
    <div id="parenthistorytable-container">
      <div className="cardBlock">
        <Table
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
          searchPlaceholder="Search Student"
          loading={loading}
          tableTitle="History"
          isFilter
          handleSorting={handleSorting}
        />
      </div>
    </div>
  );
};

export default ParentHistroyTable;
