import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import { icons } from "@/utils/constants";
import { storeLocalStorageData } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AllSkillTemplateList.scss";

const AllSkillTemplateList = ({
  setAllDeleteYsId,
  allLoading,
  setSearchAllSkill,
  setAllCurrentPage,
  setAllRowsPerPage,
  allCurrentPage,
  allRowsPerPage,
  handleSorting,
  allTotalRows,
  handleCopyAllSkill,
  allSkillList,
  handleExportCsv,
  exportLoading,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};

  const [data, setData] = useState([
    {
      _id: 1,
      name: "New Skill",
      instrument: "Guitar",
      category: "Basic Chords",
      description: "Stars",
      creator: "Charlie Roy",
    },
    {
      _id: 2,
      name: "New Skill",
      instrument: "Guitar",
      category: "Basic Chords",
      description: "Stars",
      creator: "Charlie Roy",
    },
    {
      _id: 3,
      name: "New Skill",
      instrument: "Guitar",
      category: "Basic Chords",
      description: "Stars",
      creator: "Charlie Roy",
    },
    {
      _id: 4,
      name: "New Skill",
      instrument: "Guitar",
      category: "Basic Chords",
      description: "Stars",
      creator: "Charlie Roy",
    },
    {
      _id: 5,
      name: "New Skill",
      instrument: "Guitar",
      category: "Basic Chords",
      description: "Stars",
      creator: "Charlie Roy",
    },
  ]);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const header = [
    {
      title: (
        <div className="f-center mt-4">
          <CheckBox className="" />
        </div>
      ),
      className: "wp-5 justify-content-center",
    },
    {
      title: "Skill name",
      className: "wp-15 justify-content-start",
      isSort: true,
    },
    {
      title: "Instrument",
      className: "wp-15 justify-content-start",
      isSort: true,
    },
    {
      title: "Category",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Description",
      className: "wp-20 justify-content-start",
      isSort: false,
    },
    {
      title: "Creator",
      className: "wp-15 justify-content-start",
      isSort: false,
    },
    {
      title: "Actions",
      className: "wp-10 justify-content-center",
      // isSort: true,
    },
  ];
  const rowData = [];
  allSkillList?.data?.forEach((elem, index) => {
    const {
      creator,
      description,
      category,
      instrument,
      title,
      _id,
      createdBy,
    } = elem;
    const viewDis = profileData?._id === createdBy;
    let obj = [
      {
        value: (
          <div className="f-center mt-4">
            <CheckBox className="" />
          </div>
        ),
        className: "wp-5 justify-content-center ",
      },
      {
        value: `${title || ""}`,
        className: "wp-15 justify-content-start",
      },
      {
        value: `${instrument}`,
        className: "wp-15 justify-content-start",
      },
      {
        value: category,
        className: "wp-20 justify-content-start flex-wrap",
      },
      {
        value: description,
        className: "wp-20 justify-content-start",
      },
      {
        value: creator,
        className: "wp-15 justify-content-start flex-wrap",
      },
      {
        value: (
          <div className="dropdown-container">
            <img
              src={dropdownOpen === index ? icons.sMenu : icons.Actionbtn}
              alt=""
              className="fit-content pointer action-btn"
              onClick={() => {
                setDropdownOpen(dropdownOpen === index ? null : index);
              }}
            />
            {dropdownOpen === index && (
              <div className="dropdown-menus" ref={dropdownRef}>
                {/* <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                  }}
                >
                  Assign
                </div> */}

                <div
                  className={`dropdown-item ${!viewDis ? "disabled" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    storeLocalStorageData({ tabId: "1" });
                    navigate(`/teacher/skills/create-skill`, {
                      state: {
                        id: _id,
                      },
                    });
                  }}
                >
                  View
                </div>

                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdownOpen(null);
                    handleCopyAllSkill(_id,'all');
                  }}
                >
                  Copy
                </div>

                <div
                  className={`dropdown-item deleteText ${
                    !viewDis ? "disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setAllDeleteYsId(_id);
                    setDropdownOpen(null);
                  }}
                >
                  Delete
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="allskilltemplatelist-container">
      <Table
        handleExportCsv={handleExportCsv}
        header={header}
        row={rowData}
        min="1000px"
        isSearchInput
        handleSorting={handleSorting}
        totalRows={allTotalRows}
        rowsPerPage={allRowsPerPage}
        setRowsPerPage={setAllRowsPerPage}
        currentPage={allCurrentPage}
        setCurrentPage={setAllCurrentPage}
        onSearch={setSearchAllSkill}
        searchPlaceholder="Search Students"
        loading={allLoading}
        tableTitle=""
        isExport
        isFilter
        exportLoading={exportLoading}
      />
    </div>
  );
};

export default AllSkillTemplateList;
