import "./AdminMasterForm.scss";
import Table from "@/components/layouts/Table";
import {
  deleteInstrument,
  handleGetLocation,
  handleLocationDelete,
  setEditList,
  setIsLocation,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LocationEditForm from "./LocationEditForm";
import LocationDeleteConfirmation from "@/components/layouts/LocationDeleteConfirmation";
import { DeleteConfirmation } from "@/components";

const AdminMasterForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoding] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [removeID, setRemoveID] = useState("");

  const reduxData = useSelector((state) => state.global);
  const { locationList, IsLocation } = reduxData || {};
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const header = [
    {
      title: "Location",
      className: " ps-20 wp-80 justify-content-start",
    },
    {
      title: "Actions",
      className: "wp-10 justify-content-center",
      // isSort: true,
    },
  ];

  const filteredLocationList = locationList?.filter(
    (location) => location.name.toLowerCase().includes(searchTerm.toLowerCase()) // case-insensitive match
  );

  const rowData = [];
  filteredLocationList?.forEach((elem, index) => {
    const { _id, name } = elem;
    let obj = [
      {
        value: (
          <div className="ps-20" style={{ fontFamily: "GilroyMedium" }}>
            {name}
          </div>
        ),
        className: "wp-80 justify-content-start ",
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
                    dispatch(setIsLocation(true));
                    dispatch(setEditList(elem));
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
                    setRemoveID(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Delete
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
                  Delete And Transfer
                </div>
              </div>
            )}
          </div>
        ),
        className: "wp-10 justify-content-center",
      },
    ];
    rowData.push({ data: obj });
  });

  const fetchLocation = async () => {
    await dispatch(handleGetLocation({}));
    setIsLoding(false);
  };

  const handleDelete = async () => {
    const res = await dispatch(handleLocationDelete({ locationId: removeID }));
    if (res?.status === 200) {
      fetchLocation();
      setRemoveID("");
    }
  };

  useEffect(() => {
    setIsLoding(true);
    fetchLocation();
  }, []);

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

  return (
    <div className="admin-master-container">
      <div className="wp-100 admin-master-table">
        {removeID && (
          <DeleteConfirmation
            title="Location"
            onHide={() => {
              setRemoveID("");
            }}
            onDelete={handleDelete}
          />
        )}
        {IsLocation && (
          <LocationEditForm
            fetchLocation={fetchLocation}
            onHide={() => {
              dispatch(setIsLocation(false));
              dispatch(setEditList([]));
            }}
          />
        )}
        {deleteID && (
          <LocationDeleteConfirmation
            title="Location"
            onHide={() => {
              setDeleteID("");
            }}
            location={locationList}
            locationToDelete={deleteID}
            onDelete={() => {
              setIsLoding(true);
              fetchLocation();
            }}
          />
        )}
        <Table
          loading={isLoading}
          header={header}
          row={rowData}
          isSearchInput
          setCurrentPage={setCurrentPage}
          onSearch={setSearchTerm}
          searchPlaceholder="Search student"
          isAdd
          handleAdd={() => {
            dispatch(setIsLocation(true));
          }}
        />
      </div>
    </div>
  );
};

export default AdminMasterForm;
