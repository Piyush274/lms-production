import { Button, Modal, TextInput } from "@/components";
import { handelAddNewExternal } from "@/store/globalSlice";
import { trimLeftSpace } from "@/utils/helpers";
import { Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "./ExternalPopup.scss";

const ExternalPopup = ({
  onHide,
  skillId,
  featchSkillEditVal,
  setYuVideo,
  yuVideoEdit,
  setYuVideoEdit
}) => {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    title: yuVideoEdit?.title || "",
    link: yuVideoEdit?.link || "",
    description: yuVideoEdit?.description || "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),
    link: Yup.string().required("Link is required."),
    description: Yup.string().required("Description is required."),
  });

  const handleSave = async (values) => {
    setloading(true);
    const payload = {
		...values,
		skillId: skillId,
		...(yuVideoEdit?._id && { externalId: yuVideoEdit?._id })
    };
    const res = await dispatch(handelAddNewExternal(payload));
    if (res?.status === 200) {
      featchSkillEditVal();
	  setYuVideoEdit({})
      setYuVideo(false);
    }

    setloading(false);
  };

  return (
    <Modal onHide={onHide} isClose={false}>
      <div className="external-container">
        <h1 className="external-title mb-30">
          {`${yuVideoEdit?._id ? "EDIT EXTERNAL VIDEO" : "ADD EXTERNAL VIDEO"}`}{" "}
        </h1>
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
              setFieldError,
              handleSubmit,
              handleBlur,
			  dirty
            } = props;
            const { title, description, link } = values;

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
                  <div className="text-w">
                    <div className="title">Title</div>
                    <div className="text-i">
                      <TextInput
                        labelClass="label-c"
                        className="input-bg"
                        value={title}
                        onChange={(e) => {
                          setFieldValue(
                            "title",
                            trimLeftSpace(e?.target?.value)
                          );
                        }}
                        error={errors?.title}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-w">
                    <div className="title">Embed Link</div>
                    <div className="text-i">
                      <TextInput
                        labelClass="label-c"
                        className="input-bg"
                        value={link}
                        onChange={(e) => {
                          setFieldValue(
                            "link",
                            trimLeftSpace(e?.target?.value)
                          );
                        }}
                        error={errors?.link}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-w">
                    <div className="title">Description</div>
                    <div className="text-i">
                      <TextInput
                        labelClass="label-c"
                        className="input-bg"
                        value={description}
                        onChange={(e) => {
                          setFieldValue(
                            "description",
                            trimLeftSpace(e?.target?.value)
                          );
                        }}
                        error={errors?.description}
                        onBlur={handleBlur}
                      />
                    </div>
                  </div>
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

export default ExternalPopup;
