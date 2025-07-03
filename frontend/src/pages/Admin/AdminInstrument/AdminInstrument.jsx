import { Button, DeleteConfirmation, InstrumentForm } from "@/components";
import Table from "@/components/layouts/Table";
import {
	deleteInstrument,
	handleGetInstrument,
	setinstrumentData,
	setshowAddInstument,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AdminInstrument.scss";

const AdminInstrument = ({ show }) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.global);
  const { showAddInstument } = reduxData || {};
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteID, setDeleteID] = useState("");
  const dropdownRef = useRef(null);
  const [loading, setloading] = useState(false);

  const getInstrumentList = async (limit = 10, offset = 0) => {
    setloading(true);
    const res = await dispatch(handleGetInstrument({ limit, offset }));
    if (res?.data?.response?.result) {
      setData(res?.data?.response?.result);
      setTotalRows(res?.data?.response?.totalCount);
    }
    setloading(false);
  };

  const header = [
    {
      title: "Id",
      className: "wp-10 justify-content-center",
      isSort: false,
    },
    {
      title: "Instrument Name",
      className: "wp-25 justify-content-center",
      isSort: false,
    },
    {
      title: "Instrument Image",
      className: "wp-25 justify-content-center",
      isSort: false,
    },
    {
      title: "Date",
      className: "wp-25 justify-content-center",
      isSort: false,
    },
    {
      title: "Actions",
      className: "wp-15 justify-content-center",
      isSort: false,
    },
  ];
  const rowData = data?.map((elem, index) => {
    const { name, instrumentImage, createdAt, _id } = elem;
    return {
      data: [
        {
          value: index + 1 + (currentPage - 1) * rowsPerPage,
          className: "wp-10 justify-content-center",
        },
        {
          value: name,
          className: "wp-25 justify-content-center",
        },
        {
          value: (
            <div className="w-50 h-50">
              <img
                src={instrumentImage}
                alt=""
                className="fit-content w-50 h-50"
              />
            </div>
          ),
          className: "wp-25 justify-content-center",
        },
        {
          value: new Date(createdAt).toLocaleString(),
          className: "wp-25 justify-content-center",
        },
        {
          value: (
            <div className="dropdown-container">
              <img
                src={icons.Actionbtn}
                alt=""
                className="fit-content pointer action-btn"
                onClick={() => {
                  setDropdownOpen(dropdownOpen === index ? null : index);
                }}
              />
              {dropdownOpen === index && (
                <div className="dropdown-menus" ref={dropdownRef}>
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(setinstrumentData(elem));
                      dispatch(setshowAddInstument(true));
                      setDropdownOpen(null);
                    }}
                  >
                    Edit
                  </div>
                  <div
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteID(_id);
                      setDropdownOpen(null);
                    }}
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>
          ),
          className: "wp-15 justify-content-center",
        },
      ],
    };
  });

  const handleDelete = async () => {
    const res = await dispatch(deleteInstrument(deleteID));
    if (res?.status === 200) {
      setCurrentPage(1);
      getInstrumentList(rowsPerPage, 0);
      setDeleteID("");
    }
    getInstrumentList();
  };
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    getInstrumentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getInstrumentList(rowsPerPage, (currentPage - 1) * rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  return (
    <div id="adminInstrument">
      {deleteID && (
        <DeleteConfirmation
          title="Instrument"
          onHide={() => {
            setDeleteID("");
          }}
          onDelete={handleDelete}
        />
      )}
      {showAddInstument && (
        <InstrumentForm
          handleSuccess={() => {
            setCurrentPage(1);
            getInstrumentList(rowsPerPage, 0);
            dispatch(setinstrumentData({}));
            dispatch(setshowAddInstument(false));
          }}
          onHide={() => {
            dispatch(setinstrumentData({}));
            dispatch(setshowAddInstument(false));
          }}
        />
      )}
      <div
        className={
          show
            ? "admin-instrument-container"
            : "admin-instrument-container active"
        }
      >
        <div className="fb-center p-20">
          <div className="text-24-400 font-gilroy-sb color-1a1a">
            Instrument List
          </div>
          <div>
            <Button
              type="button"
              btnText="Add"
              onClick={() => dispatch(setshowAddInstument(true))}
              className="h-40"
            />
          </div>
        </div>
        <div className="wp-100">
          <Table
            header={header}
            row={rowData}
            min="1000px"
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            loading={loading}
            isFilter
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInstrument;
