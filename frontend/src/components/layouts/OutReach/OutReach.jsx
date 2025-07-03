import Button from "@/components/inputs/Button";
import { useState, useEffect } from "react";
import { icons } from "utils/constants";
import Modal from "../Modal";
import "./OutReach.scss";
import { TextInput } from "@/components";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addOutReach, getOutReach } from "@/store/globalSlice";

const OutReach = ({ onHide, id }) => {
  const dispatch = useDispatch();
  const initialValues = {
    comment: "",
  };
  const validationSchema = Yup.object().shape({
    comment: Yup.string().required("Comment is required."),
  });
  const [loading, setloading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      try {
        const res = await dispatch(getOutReach(id));
        if (res?.status) {
          setComments(res.data.response);
        }
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    };
    fetchComments();
  }, [id, dispatch]);

  const handleSave = async (values, { resetForm }) => {
    setloading(true);
    const { comment } = values;
    const payload = {
      studentId: id,
      comment: comment,
    };
    const res = await dispatch(addOutReach(payload));
    if (res?.status === 200) {
      resetForm();
      onHide();
    }
    setloading(false);
  };

  return (
    <div id="outreachconfirmation-container">
      <Modal
        title="Out Reach"
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        {comments.length > 0 && (
          <div className="mt-20">
            <div className="mb-20">
              <div className="text-16-500 mb-2">Previous Comments:</div>
              <div className="comment-box">
                {comments.map((cmt, idx) => (
                  <div
                    key={idx}
                    className="text-14-400 mb-1 d-flex align-items-start"
                  >
                    <span className="me-2">•</span>
                    <span>{cmt.comment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {(props) => {
            const { values, errors, handleChange, handleSubmit, handleBlur } =
              props;
            const { comment } = values;
            return (
              <div className="ps-26 pe-26 pt-26 mb-10">
                <form className="profile-card">
                  <div className={`text-center text-16-400  mb-26`}>
                    <TextInput
                      id="comment"
                      placeholder="Add Comment"
                      className="text-18 mb-3"
                      value={comment}
                      error={errors?.comment}
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

export default OutReach;
