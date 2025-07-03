import { Button, DeleteConfirmation } from "@/components";
import useDebounce from "@/hook/useDebounce";
import {
  handelAddSkill,
  handelCopySkill,
  handelGetAllSkillList,
  handelGetDeleteSkillList,
  handelGetMySkillList,
  handelRemoveAllSkill,
  handelRemoveSkill,
  handelUpdateSkill,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { handleExport, storeLocalStorageData } from "@/utils/helpers";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import AllSkillTemplateList from "./AllSkillTemplateList";
import DeletedTemplateList from "./DeletedTemplateList";
import MySkillTemplateList from "./MySkillTemplateList";
import "./SkillTemplate.scss";

const SkillTemplate = ({ handleClickNewSkill }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  //your skill
  const [searchYourSkill, setSearchYourSkill] = useState("");
  const debouncedSearchYourSkill = useDebounce(searchYourSkill, 300);
  const [skillList, setSkillList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortKeyOrder: 1,
    sortKey: "title",
  });

  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteYsId, setIsDeleteYsId] = useState(null);
  const [exportMySkillLoading, setExportMySkillLoading] = useState(false);

  // all skill
  const [searchAllSkill, setSearchAllSkill] = useState("");
  const debouncedSearchAllSkill = useDebounce(searchAllSkill, 300);
  const [allSkillList, setAllSkillList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortKeyOrder: 1,
    sortKey: "title",
  });

  const [allTotalRows, setAllTotalRows] = useState(0);
  const [allCurrentPage, setAllCurrentPage] = useState(1);
  const [allRowsPerPage, setAllRowsPerPage] = useState(10);
  const [allLoading, setAllLoading] = useState(false);
  const [allDeleteYsId, setAllDeleteYsId] = useState(null);
  const [exportAllSkillLoading, setExportAllSkillLoading] = useState(false);

  //delete skill
  const [searchDeleteSkill, setSearchDeleteSkill] = useState("");
  const debouncedSearchDeleteSkill = useDebounce(searchDeleteSkill, 300);
  const [deleteSkillList, setDeleteSkillList] = useState({
    total: 0,
    offset: 0,
    limit: 10,
    search: "",
    sortKeyOrder: 1,
    sortKey: "title",
  });

  const [deleteTotalRows, setDeleteTotalRows] = useState(0);
  const [deleteCurrentPage, setDeleteCurrentPage] = useState(1);
  const [deleteRowsPerPage, setDeleteRowsPerPage] = useState(10);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteYs, setDeleteYs] = useState(null);
  const [exportDeleteLoading, setExportDeleteLoading] = useState(false);

  //your skill

  const fetchYourSkillList = async (page = 1, obj) => {
    setLoading(true);
    const offset = (page - 1) * rowsPerPage;
    const removeData = omit(obj, ["data", "total", "offset", "limit"]);
    const payload = {
      limit: rowsPerPage,
      offset,
      search: removeData?.search,
      ...removeData,
    };
    const res = await dispatch(handelGetMySkillList(payload));

    if (res?.status === 200) {
      setTotalRows(res?.data?.response[0]?.totalCount);
      setSkillList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setLoading(false);
  };

  const handleSorting = (val) => {
    const columnName = val === "Skill name" ? "title" : val;
    const { sortKeyOrder } = skillList;
    const newData = {
      ...skillList,
      sortKeyOrder: sortKeyOrder === 1 ? -1 : 1,
      sortKey: columnName,
      limit: rowsPerPage,
    };
    setSkillList(newData);
    fetchYourSkillList(currentPage, newData);
  };

  useEffect(() => {
    const newData = {
      ...skillList,
      limit: rowsPerPage,
    };
    fetchYourSkillList(currentPage, newData);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    let newData = { ...skillList, search: debouncedSearchYourSkill };
    setSkillList(newData);
    fetchYourSkillList(currentPage, newData);
  }, [debouncedSearchYourSkill]);

  const handleDeleteYourSkill = async (id) => {
    const payload = {
      skillId: id,
    };

    const res = await dispatch(handelRemoveAllSkill(payload));
    if (res?.status === 200) {
      dispatch(showSuccess("Your skill has been successfully deleted"));
      fetchAllSkillList()
      fetchYourSkillList()
      fetchDeleteSkillList();
      setIsDeleteYsId(null);
    }
  };

  const handleExportSkillCsv = async () => {
    setExportMySkillLoading(true);
    if (totalRows === 0) {
      dispatch(throwError("Skill list was not found."));
    } else {
      const payload = {
        limit: totalRows,
        offset: 0,
      };
      const res = await dispatch(handelGetMySkillList(payload));
      const data = res?.data?.response[0]?.data;
      if (data && data.length > 0) {
        const headers = [
          "SkillName",
          "Instrument",
          "Category",
          "description",
          "Creator",
        ];
        const headerKeyMap = {
          SkillName: "title",
          Instrument: "instrument",
          Category: "category",
          description: "description",
          Creator: "creator",
        };
        const transformedData = data?.map((item) => {
          const transformedRow = {};
          Object.keys(headerKeyMap).forEach((header) => {
            transformedRow[header] = item[headerKeyMap[header]] || "";
          });
          return transformedRow;
        });

        handleExport(headers, transformedData, "my_skill_list");
      }
    }
    setExportMySkillLoading(false);
  };

  //   all skill

  const fetchAllSkillList = async (page = 1, obj) => {
    setAllLoading(true);
    const offset = (page - 1) * allRowsPerPage;
    const removeData = omit(obj, ["data", "total", "offset", "limit"]);
    const payload = {
      limit: allRowsPerPage,
      offset,
      //   sortKey: allSortBy,
      //   sortKeyOrder: allOrder,
      search: removeData?.search,
      ...removeData,
    };
    const res = await dispatch(handelGetAllSkillList(payload));

    if (res?.status === 200) {
      setAllTotalRows(res?.data?.response[0]?.totalCount);
      setAllSkillList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setAllLoading(false);
  };

  const handleAllSorting = (val) => {
    const columnName = val === "Skill name" ? "title" : val;
    const { sortKeyOrder } = allSkillList;
    const newData = {
      ...allSkillList,
      sortKeyOrder: sortKeyOrder === 1 ? -1 : 1,
      sortKey: columnName,
      limit: allRowsPerPage,
    };
    setAllSkillList(newData);
    fetchAllSkillList(allCurrentPage, allSkillList);
  };

  useEffect(() => {
    const newData = {
      ...allSkillList,
      limit: allRowsPerPage,
    };
    fetchAllSkillList(allCurrentPage, newData);
  }, [allCurrentPage, allRowsPerPage]);

  useEffect(() => {
    let newData = { ...allSkillList, search: debouncedSearchAllSkill };
    setAllSkillList(newData);
    fetchAllSkillList(allCurrentPage, newData);
  }, [debouncedSearchAllSkill]);

  const handleDeleteAllSkill = async (id) => {
    const payload = {
      skillId: id,
    };
    const res = await dispatch(handelRemoveAllSkill(payload));
    if (res?.status === 200) {
      dispatch(showSuccess("Skill has been successfully deleted"));
      fetchAllSkillList()
      fetchYourSkillList()
      fetchDeleteSkillList();
      setAllDeleteYsId(null);
    }
  };

  const handleExportAllSkillCsv = async () => {
    setExportAllSkillLoading(true);
    if (allTotalRows === 0) {
      dispatch(throwError("Skill list was not found."));
    } else {
      const payload = {
        limit: allTotalRows,
        offset: 0,
      };
      const res = await dispatch(handelGetAllSkillList(payload));
      const data = res?.data?.response[0]?.data;
      if (data && data.length > 0) {
        const headers = [
          "SkillName",
          "Instrument",
          "Category",
          "description",
          "Creator",
        ];
        const headerKeyMap = {
          SkillName: "title",
          Instrument: "instrument",
          Category: "category",
          description: "description",
          Creator: "creator",
        };
        const transformedData = data?.map((item) => {
          const transformedRow = {};
          Object.keys(headerKeyMap).forEach((header) => {
            transformedRow[header] = item[headerKeyMap[header]] || "";
          });
          return transformedRow;
        });

        handleExport(headers, transformedData, "all_skill_list");
      }
    }
    setExportAllSkillLoading(false);
  };

  // delete skill

  const fetchDeleteSkillList = async (page = 1, obj) => {
    setDeleteLoading(true);
    const offset = (page - 1) * deleteRowsPerPage;
    const removeData = omit(obj, ["data", "total", "offset", "limit"]);
    const payload = {
      limit: deleteRowsPerPage,
      offset,
      search: removeData?.search,
      ...removeData,
    };
    const res = await dispatch(handelGetDeleteSkillList(payload));

    if (res?.status === 200) {
      setDeleteTotalRows(res?.data?.response[0]?.totalCount);
      setDeleteSkillList((prev) => {
        return {
          ...prev,
          total: res?.data?.response?.[0]?.totalCount,
          data: res?.data?.response?.[0]?.data || {},
        };
      });
    }
    setDeleteLoading(false);
  };

  const handleDeleteSorting = (val) => {
    const columnName = val === "Skill name" ? "title" : val;
    const { sortKeyOrder } = deleteSkillList;
    const newData = {
      ...deleteSkillList,
      sortKeyOrder: sortKeyOrder === 1 ? -1 : 1,
      sortKey: columnName,
      limit: deleteRowsPerPage,
    };
    setDeleteSkillList(newData);
    fetchDeleteSkillList(deleteCurrentPage, newData);
  };

  useEffect(() => {
    const newData = {
      ...deleteSkillList,
      limit: deleteRowsPerPage,
    };
    fetchDeleteSkillList(deleteCurrentPage, newData);
  }, [deleteCurrentPage, deleteRowsPerPage]);

  useEffect(() => {
    let newData = { ...deleteSkillList, search: debouncedSearchDeleteSkill };
    setDeleteSkillList(newData);
    fetchDeleteSkillList(deleteCurrentPage, newData);
  }, [debouncedSearchDeleteSkill]);

  const handleDeleteSkill = async (id) => {
    const res = await dispatch(handelRemoveSkill(id));
    if (res?.status === 200) {
      setDeleteYs(null);
      dispatch(showSuccess("Skill has been successfully deleted"));
      fetchAllSkillList()
      fetchYourSkillList()
      fetchDeleteSkillList();
    }
  };

  useEffect(() => {
    if (!location?.pathname.startsWith("/teacher/skills/")) {
      storeLocalStorageData({ tabId: "" });
    }
  }, [location]);

  const handleExportDeleteSkillCsv = async () => {
    setExportDeleteLoading(true);
    if (deleteTotalRows === 0) {
      dispatch(throwError("Skill list was not found."));
    } else {
      const payload = {
        limit: deleteTotalRows,
        offset: 0,
      };
      const res = await dispatch(handelGetDeleteSkillList(payload));
      const data = res?.data?.response[0]?.data;
      if (data && data.length > 0) {
        const headers = [
          "SkillName",
          "Instrument",
          "Category",
          "description",
          "Creator",
        ];
        const headerKeyMap = {
          SkillName: "title",
          Instrument: "instrument",
          Category: "category",
          description: "description",
          Creator: "creator",
        };
        const transformedData = data?.map((item) => {
          const transformedRow = {};
          Object.keys(headerKeyMap).forEach((header) => {
            transformedRow[header] = item[headerKeyMap[header]] || "";
          });
          return transformedRow;
        });

        handleExport(headers, transformedData, "delete_skill_list");
      }
    }
    setExportDeleteLoading(false);
  };

  //   const handleCopyYourSkill = async (val) => {
  // 	const { _id, ...rest } = val;
  //     const payload = {
  // 		...rest,
  // 		title: `${val?.title} (copy)`,
  // 		category:val?.categoryId,
  // 		instrument:val?.instrumentId
  //     };
  //     const formData = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       formData.append(key, value);
  //     });
  //     const res = await dispatch(handelAddSkill(formData));
  //     if (res?.status === 200) {
  //       dispatch(showSuccess("New skill has been added successfully."));
  //       fetchYourSkillList();
  //     }
  //   };

  // const handleCopyAllSkill = async (val) => {
    // console.log('val', val)
    // const { _id, ...rest } = val;
    // const payload = {
    //   ...rest,
    //   title: `${val?.title} (copy)`,
    //   category: val?.categoryId,
    //   instrument: val?.instrumentId,
    // };
    // const formData = new FormData();
    // Object.entries(payload).forEach(([key, value]) => {
    //   formData.append(key, value);
    // });
    // const res = await dispatch(handelAddSkill(formData));
    // if (res?.status === 200) {
    //   dispatch(showSuccess("New skill has been added successfully."));
    //   fetchAllSkillList();
    // }
  // };
  const handleCopyAllSkill = async (val,listV) => {
    if(listV ==='my'){
      setLoading(true)
    }
    if(listV==='all')
    {
      setAllLoading(true)
    }
    if(listV==='delete')
      {
        setDeleteLoading(true)
      }
    const payload ={
      skillId:val
    }
    const res = await dispatch(handelCopySkill(payload));
    if (res?.status === 201) {
      dispatch(showSuccess("New skill has been added successfully."));
      fetchYourSkillList()
      fetchAllSkillList();
      fetchDeleteSkillList()
    }
    setLoading(false)
    setAllLoading(false)
    setDeleteLoading(false)

  }
  //   const handleCopyDeleteSkill = async (val) => {
  // 	const { _id, ...rest } = val;
  //     const payload = {
  // 		...rest,
  // 		title: `${val?.title} (copy)`,
  // 		category:val?.categoryId,
  // 		instrument:val?.instrumentId
  //     };
  //     const formData = new FormData();
  //     Object.entries(payload).forEach(([key, value]) => {
  //       formData.append(key, value);
  //     });
  //     const res = await dispatch(handelAddSkill(formData));
  //     if (res?.status === 200) {
  //       dispatch(showSuccess("New skill has been added successfully."));
  //       fetchAllSkillList();
  //     }
  //   };

  return (
    <div id="skilltemplate-container">
      <div className="fa-center gap-4 mb-20">
        <div className="d-flex flex-column ">
          <div className="text-20-400 color-1a1a font-gilroy-m">
            Your Skill Templates
          </div>
          <div className="text-16-400 color-5151 font-gilroy-m">
            Assign a skill to your selected student
          </div>
        </div>
        <div>
          <Button
            btnText="Create New"
            className="h-37 text-17-400 font-gilroy-sb"
            leftIcon={icons.wAdd}
            leftIconClass="f-center"
            onClick={handleClickNewSkill}
          />
        </div>
      </div>
      <div className="tableBlock mb-30">
        <MySkillTemplateList
          handleExportCsv={handleExportSkillCsv}
          exportLoading={exportMySkillLoading}
            handleCopyYourSkill={handleCopyAllSkill}
          skillList={skillList}
          setSearchYourSkill={setSearchYourSkill}
          handleSorting={handleSorting}
          loading={loading}
          totalRows={totalRows}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          setIsDeleteYsId={setIsDeleteYsId}
        />
      </div>
      <div>
        <div className="text-20-400 color-1a1a font-gilroy-m mb-20">
          All Skill Templates
        </div>
        <div className="tableBlock mb-30">
          <AllSkillTemplateList
            handleCopyAllSkill={handleCopyAllSkill}
            handleExportCsv={handleExportAllSkillCsv}
            exportLoading={exportAllSkillLoading}
            allSkillList={allSkillList}
            allTotalRows={allTotalRows}
            handleSorting={handleAllSorting}
            allRowsPerPage={allRowsPerPage}
            allCurrentPage={allCurrentPage}
            setAllRowsPerPage={setAllRowsPerPage}
            setAllCurrentPage={setAllCurrentPage}
            setSearchAllSkill={setSearchAllSkill}
            allLoading={allLoading}
            setAllDeleteYsId={setAllDeleteYsId}
          />
        </div>
      </div>
      <div>
        <div className="text-20-400 color-1a1a font-gilroy-m mb-20">
          Deleted Templates
        </div>
        <div className="tableBlock">
          <DeletedTemplateList
            handleExportCsv={handleExportDeleteSkillCsv}
            exportLoading={exportDeleteLoading}
              handleCopyDeleteSkill={handleCopyAllSkill}
            handleSorting={handleDeleteSorting}
            setDeleteYs={setDeleteYs}
            deleteRowsPerPage={deleteRowsPerPage}
            deleteCurrentPage={deleteCurrentPage}
            setDeleteRowsPerPage={setDeleteRowsPerPage}
            setDeleteCurrentPage={setDeleteCurrentPage}
            deleteTotalRows={deleteTotalRows}
            deleteSkillList={deleteSkillList}
            setSearchDeleteSkill={setSearchDeleteSkill}
            deleteLoading={deleteLoading}
          />
        </div>
      </div>

      {deleteYsId && (
        <DeleteConfirmation
          title="your skill"
          onHide={() => {
            setIsDeleteYsId(null);
          }}
          onDelete={() => {
            handleDeleteYourSkill(deleteYsId);
          }}
        />
      )}

      {allDeleteYsId && (
        <DeleteConfirmation
          title="skill"
          onHide={() => {
            setAllDeleteYsId(null);
          }}
          onDelete={() => {
            handleDeleteAllSkill(allDeleteYsId);
          }}
        />
      )}

      {deleteYs && (
        <DeleteConfirmation
          title="skill"
          onHide={() => {
            setDeleteYs(null);
          }}
          onDelete={() => {
            handleDeleteSkill(deleteYs);
          }}
        />
      )}
    </div>
  );
};

export default SkillTemplate;
