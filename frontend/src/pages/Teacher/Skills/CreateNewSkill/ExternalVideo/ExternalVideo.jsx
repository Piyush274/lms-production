import { Button } from "@/components";
import { icons } from "@/utils/constants";
import moment from "moment";
import "./ExternalVideo.scss";

const ExternalVideo = ({ yuVideo, setYuVideo, setDeleteVideo, skillEdit ,setYuVideoEdit,setDeleteExternal}) => {
  return (
    <div id="externalvideo-container">
      <div className="cardBlock d-flex flex-column h-350 ov">
        <div className="fb-center flex-nowrap gap-3 mb-20">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            External Videos (Youtube)
          </div>
          <div>
            <Button
              btnText="Add"
              className="h-37 text-17-400 font-gilroy-m"
              rightIcon={icons.wAdd}
              onClick={() => {
                setYuVideo(true);
              }}
			  disabled={!skillEdit?._id}
            />
          </div>
        </div>
        <div className=" card-design flex-grow-1 brave-scroll">
          {skillEdit?.externalVideos?.map((ele, index) => {
            const { title, createdAt, description, link, _id} = ele;
            return (
              <div className="row mb-10"  key={index}>
                <div className="col-xxl-5 col-lg-6">
                  <iframe className="i-w-h" src={link} allowfullscreen />
                </div>
                <div className="col-xxl-7 col-lg-6">
                  <div className="youtube-card">
                    <div className="youtube-d">
                      <h6 className="y-title">{title}</h6>
                      <h6 className="yd-time">
                        {moment(createdAt).format("MM/DD/YY")}{" "}
                        {moment(createdAt).format("h:mm A")}
                      </h6>
                      <h6 className="yd-des"> {description}</h6>
                    </div>
                    <div className="btn-i">
                      <div className="w-28 h-28 f-center pointer">
                        <img
                          src={icons.editImg}
                          alt=""
                          className="fit-image"
                          onClick={() => {
                            setYuVideo(true);
							setYuVideoEdit(ele)
                          }}
                        />
                      </div>
                      <div
                        className="w-28 h-28 f-center pointer"
                        onClick={() => {
                          setDeleteVideo(true);
						  setDeleteExternal(_id)
                        }}
                      >
                        <img src={icons.gdelete} alt="" className="fit-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {skillEdit?.externalVideos?.length === 0 && (
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
    </div>
  );
};

export default ExternalVideo;
