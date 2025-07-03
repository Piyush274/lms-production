import { Button, CheckBox, Modal, Roundedloader } from "@/components";
import {
  handelAddAssignSkill,
  handelGetSkillTemplate,
  showSuccess,
} from "@/store/globalSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./AssignSkill.scss";
import { titleCaseString } from "@/utils/helpers";

const AssignSkill = ({
  onHide,
  data,
  fetchStudentList,
  fetchAllStudentList,
}) => {
  const { assignId, studentName } = data;
  const [list, setList] = useState([]);
  const [otherList, setOtherList] = useState([]);
  const dispatch = useDispatch();
  const [originalList, setOriginalList] = useState([]);
  const [otherOriginalList, setOtherOriginalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedIds, setSelectedIds] = useState(
    list.filter((item) => item?.isSelected).map((item) => item?.id)
  );
  const [selectedOtherIds, setSelectedOtherIds] = useState(
    otherList?.filter((item) => item?.isSelected).map((item) => item?.id)
  );
  const [hasChanges, setHasChanges] = useState(false);
  // console.log("✌️list --->", list);
  const handleCheck = (id) => {
    setList((prev) =>
      prev?.map((item) =>
        item?.id === id
          ? {
              ...item,
              isSelected: originalList?.find((orig) => orig?.id === id)
                ?.isSelected
                ? true
                : !item?.isSelected,
            }
          : item
      )
    );

    setSelectedIds((prev) =>
      prev?.includes(id) ? prev?.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  const handleCheckOther = (id) => {
    setOtherList((prev) =>
      prev.map((item) =>
        item?.id === id
          ? {
              ...item,
              isSelected: otherOriginalList.find((orig) => orig?.id === id)
                ?.isSelected
                ? true
                : !item?.isSelected,
            }
          : item
      )
    );

    setSelectedOtherIds((prev) =>
      prev?.includes(id) ? prev?.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
 
  


  useEffect(() => {
    const changesDetected = list.some(
      (item, index) => item?.isSelected !== originalList[index]?.isSelected
    );
    const otherLista = otherList.some(
      (item, index) => item?.isSelected !== otherOriginalList[index]?.isSelected
    );

    setHasChanges(changesDetected || otherLista);
  }, [list, originalList, otherList, otherOriginalList]);

  const handleAssign = async () => {
    setIsLoading(true);

    const skillIds = [...selectedIds,...selectedOtherIds]
  
    const payload = {
      studentId: assignId,
      skillIds: skillIds,
    };
    const res = await dispatch(handelAddAssignSkill(payload));
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      fetchStudentList();
      fetchAllStudentList();
      onHide();
    }
    setIsLoading(false);
  };

  const fetchSkillList = async () => {
    setIsLoadingData(true);
    const res = await dispatch(handelGetSkillTemplate(assignId));
    if (res?.status === 200) {
      const skillList = res?.data?.response?.mySkills.map((ele) => ({
          id: ele?.skillId?._id,
          isSelected: ele?.isSelected,
          name: ele?.skillId?.title,  
      }));
      const otherSkillList = res?.data?.response?.otherSkills.map((ele) => ({
        id: ele?.skillId?._id,
        isSelected: ele?.isSelected,
        name: ele?.skillId?.title,  
    }));
      setOtherList(otherSkillList)
      setOtherOriginalList(otherSkillList)
      setList(skillList);
      setOriginalList(skillList);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    fetchSkillList();
  }, []);
  return (
    <Modal onHide={onHide} isClose={false}>
      <div className="assign-container">
        <div className="assign-div">
          <h1 className="assign-text">{studentName}</h1>
          <p className="assign-p"> {assignId}</p>
        </div>
        {isLoadingData ? (
          <div className="pt-70 pb-70 d-flex justify-content-center">
            {" "}
            <Roundedloader size="md" />
          </div>
        ) : (
          <div className="skill-list-div brave-scroll">
            {list.length > 0 ? (
              <div className="mb-10">

             <div className="text-16-600 color-a1a1 mb-10"> My Skill</div>
                {list?.map((ele, index) => {
                  const { name, isSelected, id } = ele;
                  return (
                    <div
                      className={`fb-center p-10 mb-4 ${
                        isSelected && originalList[index]?.isSelected
                          ? "div-disable"
                          : ""
                      }`}
                      key={index}
                    >
                      <div className="me-20">
                        <CheckBox
                          className="h-w-c"
                          checked={isSelected}
                          disabled={
                            isSelected && originalList[index]?.isSelected
                          }
                          onChange={() => handleCheck(id)}
                        />
                      </div>
                      <div className="text-start flex-grow-1">{name}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
              <h5 className="text-center pt-30 ">Skill Not Found</h5>

              </div>
            )}
            {otherList.length > 0 ? (
              <>
             <div className="text-16-600 color-a1a1 mb-10"> Other Skill</div>

                {otherList?.map((ele, index) => {
                  const { name, isSelected, id } = ele;
                  return (
                    <div
                      className={`fb-center p-10 mb-4 ${
                        isSelected && otherOriginalList[index]?.isSelected
                          ? "div-disable"
                          : ""
                      }`}
                      key={index}
                    >
                      <div className="me-20">
                        <CheckBox
                          className="h-w-c"
                          checked={isSelected}
                          disabled={
                            isSelected && otherOriginalList[index]?.isSelected
                          }
                          onChange={() => handleCheckOther(id)}
                        />
                      </div>
                      <div className="text-start flex-grow-1">{name}</div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div>
                <h5 className="text-center pt-30 ">Skill Not Found</h5>
              </div>
            )}
          </div>
        )}
        <div className="btn-a d-flex justify-content-end gap-2 mt-10">
          <Button
            btnStyle="PDO"
            btnText="Cancel"
            className="ps-15 pe-15"
            onClick={onHide}
          />
          <Button
            btnText="Assign"
            btnStyle="PD"
            onClick={handleAssign}
            loading={isLoading}
            disabled={!hasChanges || isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignSkill;
