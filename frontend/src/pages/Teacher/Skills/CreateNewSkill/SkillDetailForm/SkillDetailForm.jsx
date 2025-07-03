import { Button, Dropdown, TextInput } from "@/components";
import {
  handelAddSkill,
  handelUpdateSkill,
  showSuccess,
} from "@/store/globalSlice";
import { icons } from "@/utils/constants";
import { Formik } from "formik";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./SkillDetailForm.scss";

const SkillDetailForm = ({
  skillEdit,
  instrumentsList,
  categoriesList,
  skillTitle,
  featchSkillEditVal,
  isNew,
  setIsNew
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteloading, setDeleteLoading] = useState(false);
  const location = useLocation();

  const initialValues = {
    skillId: skillEdit?._id || "",
    title: skillEdit?.title || "",
    instrument: skillEdit?.instrument?._id || "",
    category: skillEdit?.category?._id || "",
    description: skillEdit?.description || "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title  is required"),
    instrument: Yup.string().required("Instrument  is required"),
    category: Yup.string().required("Category  is required"),
    description: Yup.string().required("Discription  is required"),

    //   .min(50, "Description must be at least 50 characters")
  });

  const handleSave = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    let res;
    if (skillEdit?._id) {
      res = await dispatch(handelUpdateSkill(formData));
    } else {
      res = await dispatch(handelAddSkill(formData));
    }
    if (res?.status === 200) {
      setIsNew(false)
      featchSkillEditVal();
      dispatch(showSuccess("Skill details updated successfully."));
      navigate(`/teacher/skills/create-skill`, {
        state: { id: res?.data?.response?.skillId },
        replace: true,
      });
      resetForm();
    }

    setLoading(false);
  };

  const handleDelete = async (val) => {
    setDeleteLoading(true);
    const payload = {
      skillId: skillEdit?._id,
      isDeleted: val,
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const res = await dispatch(handelUpdateSkill(formData));
    if (res?.status === 200) {
      featchSkillEditVal();
      dispatch(showSuccess("Your skill has been successfully deleted"));
    }
    setDeleteLoading(false);
  };

  return (
    <div id="skilldetailform-container">
      <div className="cardBlock d-flex flex-column hp-100">
        <div className="fb-center flex-nowrap gap-3 mb-20">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Skill details
          </div>
          <div>
            {skillEdit?._id &&
              (!skillEdit?.isDeleted ? (
                <Button
                  btnText="Delete"
                  btnStyle="PDO"
                  className="h-37 text-17-400 color-1515 b-1515 font-gilroy-m"
                  onClick={() => {
                    handleDelete(1);
                  }}
                  loading={deleteloading}
                  disabled={deleteloading}
                />
              ) : (
                <Button
                  btnText="Restore"
                  rightIcon={icons?.eDelete}
                  btnStyle="PDO"
                  className="h-37 text-17-400 color-1515 b-1515 font-gilroy-m"
                  onClick={() => {
                    handleDelete(0);
                  }}
                  loading={deleteloading}
                  disabled={deleteloading}
                />
              ))}
          </div>
        </div>
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
              handleChange,
              handleSubmit,
              handleBlur,
              dirty,
            } = props;
            const { description, category, instrument, title } = values;
            return (
              <form className="" onSubmit={handleSubmit}>
                <Row className="row-gap-3 mb-20">
                  <Col md={12}>
                    <TextInput
                      id="title"
                      placeholder=""
                      className="h-49 bg-f7f7"
                      value={title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors?.title}
                      label="Title"
                    />
                  </Col>
                  <Col md={4}>
                    {instrumentsList?.length > 0 && (
                      <Dropdown
                        id="instrument"
                        placeholder=""
                        options={instrumentsList}
                        optionKey="_id"
                        optionLabel="name"
                        className="h-49 bg-f7f7"
                        value={instrument}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors?.instrument}
                        label="Instrument"
                      />
                    )}
                  </Col>
                  <Col md={12}>
                    {categoriesList?.length > 0 && (
                      <Dropdown
                        id="category"
                        placeholder=""
                        className="h-49 bg-f7f7"
                        options={categoriesList}
                        optionKey="_id"
                        optionLabel="name"
                        value={category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors?.category}
                        label="Category"
                      />
                    )}
                  </Col>
                  <Col md={12}>
                    <TextInput
                      id="description"
                      placeholder=""
                      className="h-49 bg-f7f7"
                      value={description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors?.description}
                      label="Discription"
                    />
                  </Col>
                </Row>
                <div className="d-flex gap-2 justify-content-start flex-wrap">
                  <Button
                    btnText="Save all"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || !dirty}
                    className="h-37"
                  />
                  {/* <Button
                    btnText="Assign to current student"
                    onClick={() => {}}
                    btnStyle="PDO"
                    className="h-37"
                  /> */}
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SkillDetailForm;
