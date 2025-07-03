import { icons } from "@/utils/constants";
import "./StudentResponseVideo.scss";
import { handelGetStuentSkillDetails } from "@/store/globalSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { Button } from "@/components";
import PreviewVideo from "../../PreviewVideo";

const StudentResponseVideo = ({}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [detailsList, setDetailsList] = useState([]);
  const [preview, setPreview] = useState({
    videoUrl: null,
    isShowVideo: false,
  });
  const { state } = location;

  const featchDetails = async () => {
    if (!state?.id || !state?.studentId) return;
    // setLoading(true);
    const payload = {
      id: state?.id,
      studentId: state?.studentId,
    };
    const res = await dispatch(handelGetStuentSkillDetails(payload));
    if (res?.status === 200) {
      setDetailsList(res?.data?.response);
    }
    // setLoading(false);
  };

  useEffect(() => {
    featchDetails();
  }, []);
  return (
    <div id="studentresponsevideo-container">
      <div className="cardBlock d-flex flex-column h-300">
        <div className="fb-center flex-nowrap gap-3 mb-20">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Student Response Videos
          </div>
        </div>
        <div className="fa-center gap-2 flex-nowrap infoBlock text-16-400 mb-30">
          <div className="w-18 h-18 f-center">
            <img src={icons.bInfo} alt="" className="fit-image" />
          </div>
          <div>Response videos from students will contain here</div>
        </div>
        {detailsList?.studentResponseVideo?.length > 0 && (
          <div className="listBlock-e brave-scroll mb-10">
            {detailsList?.studentResponseVideo?.map((item, index) => (
              <div key={index}>
                <div className="fb-center">
                  <div className="d-flex flex-column gap-3">
                    <div className="fa-center gap-2">
                      <div className="w-24 h-24 f-center">
                        <img
                          src={icons.dFileVideo}
                          alt=""
                          className="fit-image"
                        />
                      </div>
                      <div className="text-16-400 color-1a1a font-gilroy-m text-break">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-14-400 color-aoao font-gilroy-m mb-5">
                      {moment(item?.time).format("MM/DD/YY")} -{" "}
                      {moment(item?.time).format("h:mm A")}
                    </div>
                  </div>
                  <div className="me-5">
                    <Button
                      btnText="Open"
                      btnStyle="PDO"
                      className="h-35"
                      onClick={() => {
                        setPreview({
                          videoUrl: item?.url,
                          isShowVideo: true,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {detailsList?.studentResponseVideo?.length === 0 && (
          <div className="flex-grow-1 f-center">
            <div className="f-center flex-column">
              <div className="w-50 h-50 f-center">
                <img src={icons.fileVideo} alt="" className="fit-image" />
              </div>
              <div className="text-16-400 color-c9c9">Nothing for now</div>
            </div>
          </div>
        )}
      </div>
      {preview?.isShowVideo && (
        <PreviewVideo
          previewUrl={preview?.videoUrl}
          onHide={() => {
            setPreview({
              videoUrl: null,
              isShowVideo: false,
            });
          }}
        />
      )}
    </div>
  );
};

export default StudentResponseVideo;
