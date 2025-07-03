import { useEffect, useState } from "react";
import { Formik } from "formik";
import Modal from "../Modal";
import "./CreateChatGroup.scss";
import SearchInput from "@/components/inputs/SearchInput";
import { getDataFromLocalStorage, getInitials } from "@/utils/helpers";
import { icons } from "@/utils/constants";
import CheckBox from "@/components/inputs/CheckBox";
import Button from "@/components/inputs/Button";
import {
  getStudentslistTeacherWise,
  handleCreateGroup,
  showSuccess,
} from "@/store/globalSlice";
import { useDispatch } from "react-redux";
import TextInput from "@/components/inputs/TextInput";
import * as Yup from "yup"; // For form validation

const CreateChatGroup = ({ onHide }) => {
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const dispatch = useDispatch();

  const userId = getDataFromLocalStorage("userId");

  // Fetch the students list
  const fetchStudentList = async () => {
    setIsLoadingStudent(true);

    const res = await dispatch(getStudentslistTeacherWise(userId));

    if (res?.status === 200) {
      setStudentsList(res?.data?.response || []);
    }
    setIsLoadingStudent(false);
  };

  // Fetch students list when the component mounts
  useEffect(() => {
    fetchStudentList();
  }, []);

  // Filter students by search query
  const filteredStudents = studentsList?.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const payload = {
        groupName: values.groupName,
        members: selectedStudents,
        type: "group",
      };

      const res = await dispatch(handleCreateGroup(payload));
      if (res?.status === 200) {
        onHide();
        dispatch(showSuccess(res?.message || "Group created successfully"));
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (id) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((student) => student !== id)
        : [...prevSelected, id]
    );
  };

  // Form validation schema
  const validationSchema = Yup.object({
    groupName: Yup.string().required("Group name is required"),
  });

  return (
    <Modal
      onHide={onHide}
      title="Create Group"
      isCloseOutside={true}
      textClass="text-20-400 font-gilroy-m"
    >
      <div>
        <Formik
          initialValues={{ groupName: "", students: [] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <form className="password-card pt-20" onSubmit={handleSubmit}>
              {/* Group Name Input */}
              <div className="mt-10 mb-20">
                <TextInput
                  id="groupName"
                  name="groupName"
                  placeholder="Enter Group Name"
                  value={values.groupName}
                  onChange={handleChange}
                  error={touched.groupName && errors.groupName}
                />
              </div>

              {/* Search Students Input */}
              <div className="mt-10 mb-20">
                <SearchInput
                  placeholder="Search Students"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Students List */}
              <div className="text-16-400 color-aoao font-gilroy-m mb-20">
                Students
              </div>

              <div className="studentBlock brave-scroll">
                {filteredStudents?.map((item, index) => {
                  const { profileImage, firstName, lastName, studentId, _id } =
                    item;
                  return (
                    <div key={_id}>
                      <div className="fa-center gap-3 flex-nowrap">
                        <CheckBox
                          className="s-22"
                          checked={selectedStudents.includes(studentId)}
                          onChange={() => handleCheckboxChange(studentId)}
                        />
                        <div className="flex-grow-1">
                          <div className="fa-center flex-wrap gap-3 wp-100">
                            <div className="w-49 h-49 f-center br-50 bg-bebe">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={`${firstName} ${lastName}`}
                                  className="fit-image br-50"
                                />
                              ) : (
                                <div className="f-center text-16-400 color-003e font-gilroy">
                                  {getInitials(firstName)}
                                </div>
                              )}
                            </div>
                            <div className="text-18-400 color-1a1a font-gilroy-m">
                              {firstName} {lastName}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index !== filteredStudents.length - 1 && (
                        <hr className="groupHr" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="mt-30">
                <Button
                  type="submit"
                  btnText="Create Group Chat"
                  className="h-44"
                  btnStyle={selectedStudents.length === 0 ? "PDE" : ""}
                  disabled={selectedStudents.length === 0}
                  onClick={handleSubmit} // Ensure the button triggers the Formik submit
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateChatGroup;
