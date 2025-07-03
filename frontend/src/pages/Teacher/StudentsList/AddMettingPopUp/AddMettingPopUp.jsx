import { Button, Modal, TextInput } from "@/components";
import "./AddMettingPopUp.scss";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  handelAddLocation,
  handelAddMettingLink,
  handelEditLocation,
  showSuccess,
  throwError,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";

const AddMettingPopUp = ({ onHide,fetchAllStudentList,fetchStudentList }) => {
  const [edit, setEdit] = useState(false);
  const [loading, setloading] = useState(false);
  const reduxData = useSelector((state) => state.global);
  const { mettingData } = reduxData || {};
  const dispatch = useDispatch();

  const initialValues = {
    meeting_link: mettingData?.teacherDetails?.[0]?.meeting_link || "",
  };

  const validationSchema = Yup.object().shape({
    // meeting_link: Yup.string()
    //   .required("Metting link is required."),
    meeting_link: Yup.string()
  .matches(/^https:\/\/[^\s]+$/, "Meeting link must start with 'https://'.")
  .required("Meeting link is required."),

  });

  const handleSave = async (values, { resetForm }) => {
    setloading(true);
    if (mettingData?._id) {
        const payload ={
            Id:mettingData?.teacherDetails?.[0]?._id,
             meeting_link:values?.meeting_link
        }
      const res = await dispatch(handelAddMettingLink(payload));
      if (res?.status === 200) {
        resetForm();
        fetchStudentList()
        fetchAllStudentList()
        onHide();
      }
    }

    setloading(false);
  };

  const handleCopy = async (val) => {
    try {
      await navigator.clipboard.writeText(val);
      dispatch(showSuccess("Mettng link copied to clipboard!"));
    } catch (err) {
      dispatch(throwError("Failed to copy Mettng link. Please try again."));
    }
  };

  return (
    <Modal onHide={onHide} size="md" isClose={onHide} title="Add Link">
      <div className="mt-20 metting-container">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              setFieldError,
              handleBlur,
              dirty,
            } = props;
            const { meeting_link } = values;
            const handleInputChange = (e) => {
              const { id, value } = e.target;
              if (!touched[id]) {
                touched[id] = true;
              }
              if (value === "") {
                setFieldError(id, "");
              }

              handleChange(e);
            };
            return (
              <form
                className="bottom-div"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              >
                <div className="d-flex flex-wrap  justify-content-between">
                  <div className="w-s-h">
                    <TextInput
                     
                      edit={edit}
                      id="meeting_link"
                      className="text-18"
                      placeholder="Enter metting link"
                      onChange={handleInputChange}
                      value={meeting_link}
                      error={errors?.meeting_link}
                      onBlur={handleBlur}
                      disabled={!edit}
                    />
                  </div>
                  <div className="d-flex  align-items-start gap-2 btn-g">
                    <div
                     data-toggle="tooltip"
                        data-placement="top"
                        title="Edit metting link"
                      onClick={() => {
                        setEdit((prev) => {
                          return !prev;
                        });
                      }}
                      className="btn-edit pointer"
                    >
                      <img src={icons?.editImg} />
                    </div>
                    <div
                      onClick={() => {
                        setEdit((prev) => {
                          return !prev;
                        });
                      }}
                      className="btn-edit pointer"
                    >
                      <img
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Copy metting link"
                        src={icons.CopyImg}
                        alt=""
                        className="fit-image"
                        onClick={() => {
                          if (meeting_link) {
                            handleCopy(meeting_link);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-end mt-20">
                  <Button btnText="Close" btnStyle="PDO" onClick={onHide} />
                  <Button
                    btnText="Save"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || !dirty}
                  />
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddMettingPopUp;
