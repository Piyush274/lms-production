import { useState } from "react";
import { icons } from "utils/constants";
import Modal from "../Modal";
import "./LocationDeleteConfirmation.scss";
import { Button, Dropdown, } from "@/components";
import { useDispatch } from "react-redux";
import { handleLocationDelete } from "@/store/globalSlice";


const LocationDeleteConfirmation = ({ onHide, title, onDelete, location, locationToDelete }) => {
  const dispatch = useDispatch()
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [transferLocationId, setTransferLocationId] = useState("");


  const handleDelete =async () => {
    setDeleteLoader(true);
 const res =  await dispatch(handleLocationDelete({locationId: locationToDelete,transferLocationId}))
 if (res?.status === 200) {
        onHide();
        onDelete();
      }
    setTimeout(() => {
      setDeleteLoader(false);
    }, 1500);
  };


  return (
    <div id="location-deleteconfirmation-container">
      <Modal
        title={`Delete ${title}`}
        width="600px"
        onHide={onHide}
        isCloseOutside={true}
      >
        <div className="ps-26 pe-26 pt-26 mb-10">
          <div className="h-74 mb-26">
            <img
              src={icons.redDelete}
              alt="deleteFrame"
              className="fit-image"
            />
          </div>
          <div className={`text-center text-18-600  mb-10`}>
            Delete Confirmation!
          </div>
          <div className="text-center text-16-400 mb-26">
            If you want to transfer users from this {title}, please select another location.
          </div>

          <div className="mb-26">
            <Dropdown
              id="location"
              label="Select location"
              value={transferLocationId}
              onChange={(e) => {
                setTransferLocationId(e?.target.value)
              }}
              options={location?.filter(val=> val._id !== locationToDelete)?.map((loc) => ({
                id: loc._id,
                label: loc.name,
              }))}
              required
              labelClass="color-5151 text-16-400 mb-8 font-gilroy-m"
              startClass="color-1515"
            // error={studioLocationError}
            />
          </div>

          <div className="f-center gap-2">
            <Button
              btnStyle="PDO"
              btnText="Cancel"
              className="ps-45 pe-40"
              onClick={onHide}
            />
            <Button
              className="ps-45 pe-45"
              btnText={`Delete & Transfer`}
              loading={deleteLoader}
              onClick={handleDelete}
              disabled={deleteLoader|| !transferLocationId }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LocationDeleteConfirmation;
