import { CheckBox } from "@/components";
import Table from "@/components/layouts/Table";
import { icons } from "@/utils/constants";
import { storeLocalStorageData } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MySkillTemplateList.scss";

const MySkillTemplateList = ({
  setCurrentPage,
  setRowsPerPage,
  currentPage,
  rowsPerPage,
  totalRows,
  loading,
  handleSorting,
  setSearchYourSkill,
  skillList,
  setIsDeleteYsId,
  handleCopyYourSkill,
  handleExportCsv,
  exportLoading,
}) => {
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const navigate = useNavigate();

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
    },
  ];
  const rowData = [];
  skillList?.data?.forEach((elem, index) => {
    const { creator, description, category, instrument, title, _id } = elem;
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
                  className="dropdown-item"
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
                    handleCopyYourSkill(_id,'my');
                  }}
                >
                  Copy
                </div>
                <div
                  className="dropdown-item deleteText"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDeleteYsId(_id);
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
    <div id="myskilltemplatelist-container">
      <div className="mt-20">
        <Table
          handleExportCsv={handleExportCsv}
          exportloading={exportLoading}
          header={header}
          row={rowData}
          min="1000px"
          isSearchInput
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearch={setSearchYourSkill}
          handleSorting={handleSorting}
          searchPlaceholder="Search Students"
          loading={loading}
          tableTitle=""
          isExport
          isFilter
        />
      </div>
    </div>
  );
};

export default MySkillTemplateList;
