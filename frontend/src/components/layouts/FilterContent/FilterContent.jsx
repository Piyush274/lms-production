import { useState } from "react";
import { Button, RadioButton, CheckBox } from "@/components";
import { icons } from "@/utils/constants";

const FilterContent = ({
  onHide,
  data,
  setFilterList,
  filterList,
  setShowLocations,
  showLocations,
  showInstructors,
  setShowInstructors,
  teacherList,
  loading,
  handleSubmit,
  featchTearcherList,
  setfilterDropdown,
}) => {
  const selectAll = () => {
    const allSelected =
      filterList?.instructors?.length === teacherList?.length &&
      filterList?.locations?.length === data?.length;

    if (allSelected) {
      setFilterList({
        instructors: [],
        locations: [],
      });
    } else {
      setFilterList({
        instructors: teacherList.map((ele) => ele?.id),
        locations: data.map((ele) => ele?._id),
      });
    }
  };
  const locations = data?.map((ele) => {
    return {
      name: ele?.name,
      id: ele?._id,
    };
  });

  const isAllSelected =
    filterList?.instructors?.length === teacherList?.length &&
    filterList?.locations?.length === data?.length;
  return (
    <div className="filter-dropdown">
      <div className="fb-center wp-100 flex-nowrap ps-28 pt-28 pe-28">
        <div className="text-20-400 font-gilroy-m color-1a1a">Filter</div>
        <div className="w-22 h-22 pointer" onClick={onHide}>
          <img src={icons.closeBgImg} alt="Close" className="fit-image" />
        </div>
      </div>
      <div className="mt-20 fa-center ps-28 pe-28 mb-20 gap-2">
        <div>
          <CheckBox
            id={1}
            checked={isAllSelected}
            onChange={selectAll}
            name="Show all calendars"
          />
        </div>
        <div className="text-18-400 font-gilroy-m">Show all calendars</div>
      </div>

      <div>
        <div
          className="fb-center ps-28 pe-28 pt-8 pb-8 bg-ECEC pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowInstructors(!showInstructors);
          }}
        >
          <div className="fa-center gap-2">
            <span className="text-16-400 font-gilroy-m color-5151">
              Instructors
            </span>
            <span className="w-35 h-23 text-16-400 font-gilroy-m color-aoao br-10 bg-dada f-center">
              {teacherList?.length}
            </span>
          </div>
          <div>
            <div className="w-16 h-16 f-center pointer">
              <img
                src={icons.down}
                alt=""
                className="fit-image"
                style={{
                  transform: showInstructors ? "rotate(180deg)" : "none",
                }}
              />
            </div>
          </div>
        </div>
        {showInstructors && (
          <div className="ps-28 pe-28 inst-block brave-scroll">
            {teacherList?.map((item, index) => (
              <div key={index} className="fa-center gap-2 bb-e2e2 pb-15 pt-20">
                <CheckBox
                  checked={filterList?.instructors?.includes(item.id)}
                  onChange={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFilterList((prevFilterList) => {
                      const updatedLocations = prevFilterList?.instructors
                        ? prevFilterList.instructors.includes(item.id)
                          ? prevFilterList.instructors.filter(
                              (id) => id !== item.id
                            )
                          : [...prevFilterList.instructors, item.id]
                        : [item.id];

                      return {
                        ...prevFilterList,
                        instructors: updatedLocations,
                      };
                    });
                  }}
                />
                <div className="text-18-400 font-gilroy-m color-1a1a">
                  {item?.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div
          className="fb-center ps-28 pe-28 pt-8 pb-8 bg-ECEC pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLocations(!showLocations);
          }}
        >
          <div className="fa-center gap-2">
            <span className="text-16-400 font-gilroy-m color-5151">
              Locations
            </span>
            <span className="w-35 h-23 text-16-400 font-gilroy-m color-aoao br-10 bg-dada f-center">
              {data?.length}
            </span>
          </div>
          <div>
            <div className="w-16 h-16 f-center pointer">
              <img
                src={icons.down}
                alt=""
                className="fit-image"
                style={{
                  transform: showLocations ? "rotate(180deg)" : "none",
                }}
              />
            </div>
          </div>
        </div>
        {showLocations && (
          <div className="ps-28 pe-28 inst-block brave-scroll">
            {locations?.map((item, index) => (
              <div key={index} className="fa-center gap-2 bb-e2e2 pb-15 pt-20">
                <CheckBox
                  checked={filterList?.locations?.includes(item.id)}
                  onChange={() => {
                    setFilterList((prevFilterList) => {
                      const updatedLocations = prevFilterList?.locations
                        ? prevFilterList.locations.includes(item.id)
                          ? prevFilterList.locations.filter(
                              (id) => id !== item.id
                            )
                          : [...prevFilterList.locations, item.id]
                        : [item.id];

                      return {
                        ...prevFilterList,
                        locations: updatedLocations,
                      };
                    });
                  }}
                />
                <div className="text-18-400 font-gilroy-m color-1a1a">
                  {item?.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="fb-center ps-28 pe-28 pb-28 mt-20">
        <Button
          btnText="Reset"
          className="h-37"
          btnStyle="PDW"
          onClick={() => {
            setFilterList({ locations: [], instructors: [] });
            featchTearcherList();
            setfilterDropdown();
          }}
        />
        <Button
          btnText="Apply Filter"
          className="h-37"
          onClick={handleSubmit}
          loading={loading}
          disabled={
            (filterList?.locations.length === 0 &&
              filterList?.instructors.length === 0) ||
            loading
          }
        />
      </div>
    </div>
  );
};

export default FilterContent;
