import { icons } from "@/utils/constants";
import "./SkillDetails.scss";
import { Button } from "@/components";

const SkillDetails = () => {
  return (
    <div id="skilldetails-container">
      <div className="cardBlock d-flex flex-column hp-100 gap-4">
        <div className="fb-center flex-nowrap gap-3">
          <div className="text-20-400 color-1a1a font-gilroy-sb">
            Skill details
          </div>
        </div>
        <div className="d-flex">
          {Array(5).fill(
            <div className="w-20 h-20">
              <img src={icons.gStar} alt="" className="fit-image" />
            </div>
          )}
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">
          Title :- <span className="color-5151">Bruno Mars</span>
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">
          Instrument :- <span className="color-5151">Guitar</span>
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">
          Category :- <span className="color-5151"></span>
        </div>
        <div className="text-16-400 color-1a1a font-gilroy-m">
          Description :- <span className="color-5151"></span>
        </div>
        <div className="fa-center gap-3">
          <div>
            <Button
              btnText="Edit Template"
              className="h-37 text-17-400 font-gilroy-m"
              btnStyle="PDO"
            />
          </div>
          <div>
            <Button
              btnText="Inactive"
              className="h-37 text-17-400 font-gilroy-m"
              btnStyle="PDG"
            />
          </div>
          <div>
            <Button
              btnText="Complete"
              className="h-37 text-17-400 font-gilroy-m"
              btnStyle="PDC"
            />
          </div>
          <div>
            <Button
              btnText="Delete"
              className="h-37 text-17-400 font-gilroy-m"
              btnStyle="PDR"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetails;
