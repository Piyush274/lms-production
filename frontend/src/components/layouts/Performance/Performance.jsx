import Button from "@/components/inputs/Button";
import { useState, useEffect } from "react";
import { icons } from "utils/constants";
import Modal from "../Modal";
import "./Performance.scss";
import { TextInput } from "@/components";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addPerformance, getPerformance } from "@/store/globalSlice";

const Performance = ({ onHide, id }) => {
  const dispatch = useDispatch();
  const initialValues = {
    score: "",
  };
  const validationSchema = Yup.object().shape({
    score: Yup.string().required("Score is required."),
  });
  const [loading, setloading] = useState(false);
  const [scores, setScores] = useState("0");

  useEffect(() => {
    if (!id) return;
    const fetchScores = async () => {
      try {
        const res = await dispatch(getPerformance(id));
        if (res?.status) {
          setScores((res.data.response.performance && res.data.response.performance > 0) ? res.data.response.performance : 0);
        }
      } catch (error) {
        console.error("Failed to load scores", error);
      }
    };
    fetchScores();
  }, [id, dispatch]);

  const handleSave = async (values, { resetForm }) => {
    setloading(true);
    const { score } = values;
    const payload = {
      studentId: id,
      score: score,
    };
    const res = await dispatch(addPerformance(payload));
    if (res?.status === 200) {
      resetForm();
      onHide();
    }
    setloading(false);
  };

  return (
    <div id="performanceconfirmation-container">
      <Modal
        title="Performance"
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <div className="mt-20">
          <div className="mb-20">
            <div className="text-16-500 mb-2">Score: {scores}</div>
          </div>
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit, handleBlur } =
              props;
            const { score } = values;
            return (
              <div className="ps-26 pe-26 pt-26 mb-10">
                <form className="profile-card">
                  <div className={`text-center text-16-400  mb-26`}>
                    <TextInput
                      id="score"
                      placeholder="Add Score"
                      className="text-18 mb-3"
                      value={score}
                      error={errors?.score}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="f-center gap-3">
                    <Button
                      btnStyle="PDO"
                      btnText="Cancel"
                      className="ps-45 pe-45"
                      onClick={onHide}
                    />
                    <Button
                      className="ps-45 pe-45"
                      btnText={`Submit`}
                      loading={loading}
                      onClick={handleSubmit}
                      disabled={loading}
                    />
                  </div>
                </form>
              </div>
            );
          }}
        </Formik>
      </Modal>
    </div>
  );
};

export default Performance;
