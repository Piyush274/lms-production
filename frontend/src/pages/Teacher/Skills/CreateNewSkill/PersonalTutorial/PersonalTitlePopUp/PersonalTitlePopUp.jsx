import { Button, Modal, TextInput } from "@/components";
import { handelUpdatedocument } from "@/store/globalSlice";
import { trimLeftSpace } from "@/utils/helpers";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "./PersonalTitlePopUp.scss";

const PersonalTitlePopUp = ({
  onHide,
  featchSkillEditVal,
  changeTitlePersonal,
  skillId,
}) => {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    title: changeTitlePersonal?.title || "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),
  });

  const handleSave = async (values) => {
    // setloading(true);
    // const payload = {
    //   skillId: skillId,
    //   title: values?.title,
    //   documentId: changeTitlePersonal?._id,
    //   documentType: "Supporting",
    // };
    // const res = await dispatch(handelUpdatedocument(payload));
    // if (res?.status === 200) {
    //   featchSkillEditVal();
    //   onHide();
    // }
    // setloading(false);
    onHide();
  };
  return (
    <Modal onHide={onHide} isClose={false}>
      <div className="take-conatiner">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const {
              values,
              errors,
              setFieldValue,
              handleSubmit,
              handleBlur,
              dirty,
            } = props;
            const { title } = values;

            return (
              <form
                className="row gy-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              >
                <div className="col-12">
                  <TextInput
                    labelClass="label-c"
                    className="input-bg"
                    value={title}
                    onChange={(e) => {
                      setFieldValue("title", trimLeftSpace(e?.target?.value));
                    }}
                    error={errors?.title}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="d-flex justify-content-center gap-2 mt-25">
                  <Button
                    btnText="Cancel"
                    btnStyle="PDO"
                    className="h-43"
                    onClick={onHide}
                  />
                  <Button
                    className="ps-25 pe-25"
                    btnStyle="og-43"
                    btnText="save"
                    onClick={handleSubmit}
                    disabled={loading || !dirty}
                    loading={loading}
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

export default PersonalTitlePopUp;
