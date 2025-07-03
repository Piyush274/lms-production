import Button from "@/components/inputs/Button";
import SearchInput from "@/components/inputs/SearchInput";
import { icons } from "@/utils/constants";
import { trimLeftSpace } from "@/utils/helpers";
import { debounce } from "lodash";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { GrNext, GrPrevious } from "react-icons/gr";
import Roundedloader from "../Roundedloader";
import "./Table.scss";

const Table = ({
  header,
  row,
  min,
  totalRows,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  isSearchInput,
  onSearch,
  searchPlaceholder,
  loading,
  handleSorting,
  tableTitle,
  isExport,
  isFilter,
  renderMonthHeader,
  showTotal,
  totalOwed,
  headerTitleClass,
  searchVal,
  handleExportCsv,
  exportloading,
  isAdd,
  handleAdd,
  //   onSearchChnage
}) => {
  const handleSearch = debounce((e) => {
    onSearch(trimLeftSpace(e.target.value));
    setCurrentPage(1);
  }, 300);

  const [isOpen, setIsOpen] = useState(false);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const startRow = startIndex + 1;
  const endRow = Math.min(startIndex + rowsPerPage, totalRows);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const generateRowOptions = () => {
    const options = [];
    const maxRowsPerPage = Math.min(totalRows, 100);

    for (let i = 5; i <= maxRowsPerPage; i += 5) {
      options.push(i);
    }

    return options;
  };

  const handleOptionClick = (option) => {
    handleRowsPerPageChange({ target: { value: option } });
    setIsOpen(false);
  };

  const rowOptions = generateRowOptions();

  return (
    <div id="table-container">
      {isSearchInput && (
        <Row className="row-gap-3 p-20">
          <Col md={6}>
            <div className="fa-center gap-4">
              {tableTitle && (
                <div
                  className={` ${
                    headerTitleClass || "text-18-400 color-1a1a font-gilroy-sb"
                  }`}
                >
                  {tableTitle}
                </div>
              )}
              <div className="flex-grow-1">
                <SearchInput
                  value={searchVal}
                  className="mw-372"
                  placeholder={searchPlaceholder}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="fa-center justify-content-end gap-3 flex-nowrap">
              {isExport && (
                <Button
                  btnText="Export"
                  btnStyle="PDO"
                  className="h-43 bx-shadow"
                  rightIcon={icons.downloade}
                  rightIconClass="w-18 h-18"
                  textClass="text-17-400 font-gilroy-m"
                  onClick={handleExportCsv}
                  loading={exportloading}
                  disabled={exportloading}
                />
              )}
              {isFilter && (
                <Button
                  btnText="Filter"
                  btnStyle="PDDD"
                  className="h-43 bx-shadow"
                  rightIcon={icons.filterhorizontal}
                  rightIconClass="w-18 h-18"
                  textClass="color-5151 text-17-400 font-gilroy-m"
                />
              )}
              {isAdd && (
                <Button
                  btnText="Add"
                  btnStyle="PDO"
                  className="h-43 bx-shadow"
                  rightIconClass="w-18 h-18"
                  textClass="text-17-400 font-gilroy-m"
                  onClick={handleAdd}
                />
              )}
            </div>
          </Col>
        </Row>
      )}
      <div className="table-body brave-scroll">
        <div className="header-row" style={{ minWidth: min || "500px" }}>
          {header?.map((elm, index) => {
            const { title, className, isSort } = elm;
            return (
              <div
                className={`header-cell pointer ${className || ""}`}
                key={index}
              >
                <span>{title}</span>
                {isSort && (
                  <span
                    className="h-24 w-24"
                    onClick={() => handleSorting(title)}
                  >
                    <img
                      src={icons.sortbyup}
                      alt="sort"
                      className="fit-image"
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div
          className="body-container brave-scroll"
          style={{ minWidth: row.length === 0 ? "100%" : min || "500px" }}
        >
          {loading ? (
            <div className="text-center pt-100 pb-100">
              <Roundedloader />
            </div>
          ) : (
            <>
              {row.length === 0 && (
                <div className="text-center pt-100 pb-100 text-18-500 color-a1a1">
                  No data found
                </div>
              )}
              {row.map((elm, index) => {
                if (elm.month) {
                  return (
                    <div
                      className="month-header"
                      key={index}
                      style={{
                        backgroundColor: "#D0D0D0",
                        padding: "10px 20px",
                      }}
                    >
                      {renderMonthHeader(elm.month)}
                    </div>
                  );
                }

                return (
                  <div className="body-row" key={index}>
                    {elm.data.map((cElem, cIndex) => {
                      return (
                        <div
                          className={`body-cell d-flex align-items-center ${
                            cElem.className || ""
                          }`}
                          key={cIndex}
                        >
                          {cElem.value}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {showTotal && (
        <div className="d-flex justify-content-center btntable-container">
          <div className="btn-table1">
            <span>Total</span>
          </div>
          <div className="btn-table2">
            <span>${totalOwed}</span>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <div className="d-flex justify-content-end gap-md-5 gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-3">
              <span>Rows per page:</span>
              <div className="select" onClick={() => setIsOpen(!isOpen)}>
                <div className="f-center gap-2">
                  <div>{rowsPerPage}</div>
                  <div className="pointer w-14">
                    <img
                      src={icons.down}
                      alt=""
                      className="fit-image"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </div>
                {isOpen && (
                  <div className="options">
                    {rowOptions.map((option) => (
                      <div
                        key={option}
                        className="option"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="d-flex align-items-center color-5151">
              <span className="row-count">
                {startRow} - {endRow}
              </span>{" "}
              of <span className="row-count">{totalRows}</span>
            </span>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagoicon"
              >
                <GrPrevious />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagoicon"
              >
                <GrNext />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
