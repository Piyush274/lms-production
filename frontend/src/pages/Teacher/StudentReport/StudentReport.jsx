import { icons } from "@/utils/constants";
import "./StudentReport.scss";
import { useEffect, useState } from "react";
import { Button, Dropdown, Roundedloader, TextInput } from "@/components";
import { useDispatch } from "react-redux";
import {
  getAllSubscriptionPlan,
  getStudentdetails,
  handelGetinstruments,
  handelGetReport,
  handelGetStudentProfile,
  handelUpdateStudent,
  handleGetLocation,
} from "@/store/globalSlice";
import { useLocation } from "react-router-dom";
import { getDataFromLocalStorage } from "@/utils/helpers";

const StudentReport = ({ isResponsive }) => {
  const dispatch = useDispatch();
  const [profileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const location = useLocation();
  const { state } = location;
  const [subscriptionPlan, setsubscriptionPlan] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [reportList, setReportList] = useState({
    Name: "",
    SurName: "",
    Email: "",
    PhoneNumber: "",
    Location: "",
    PrimaryInstrument: "",
    AccountCreated: "",
    ProfileCreated: "",
    RBAAccountActive: "",
    RBAProfileActive: "",
    SelectedPlan: "",
    ProRateCharged: "",
    Deleted: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [instrumentsList, setInstrumentsList] = useState({});
  const [editValue, setEditValue] = useState("");
  const [showError, setShowError] = useState("");
  const teacherProfile = getDataFromLocalStorage("");
  const [errors, setErrors] = useState({});

  const validateField = (key, value) => {
    let errorMessage = "";
    if (key === "Name") {
      if (!value || value.trim() === "") {
        errorMessage = "Name is required.";
      } else {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
          errorMessage = "Name must only contain letters and spaces.";
        }
      }
    }
    if (key === "SurName") {
      if (!value || value.trim() === "") {
        errorMessage = "SurName is required.";
      } else {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
          errorMessage = "SurName must only contain letters and spaces.";
        }
      }
    }
    if (key === "Email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Please enter a valid email address.";
      }
    }
    if (key === "PrimaryInstrument") {
      if (!value || value.trim() === "") {
        errorMessage = "PrimaryInstrument is required ";
      }
    }
    if (key === "SelectedPlan") {
      if (!value || value.trim() === "") {
        errorMessage = "Selected Plan is required ";
      }
    }
    if (key === "Location") {
      if (!value || value.trim() === "") {
        errorMessage = "Location is required ";
      }
    }

    if (key === "PhoneNumber" && value) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        errorMessage = "Phone number must be exactly 10 digits.";
      }
    }
    return errorMessage;
  };

  const handleEdit = (key) => {
    setShowError("");
    setEditingField(key);
    setEditValue(reportList[key]);
  };

  const handleSave = async (key) => {
    const errorMessage = validateField(key, editValue);

    if (errorMessage) {
      setErrors((prev) => ({
        ...prev,
        [key]: errorMessage,
      }));
      return;
    }
    setErrors((prev) => ({
      ...prev,
      [key]: null,
    }));
    setLoading(true);
    const updatedData = {
      [key]: editValue,
    };
    let payload;
    if (updatedData?.Name) {
      payload = { firstName: updatedData.Name };
    } else if (updatedData?.SurName) {
      payload = { lastName: updatedData?.SurName };
    } else if (updatedData?.PhoneNumber) {
      payload = { phoneNumber: updatedData?.PhoneNumber };
    } else if (updatedData?.Email) {
      payload = { email: updatedData?.Email };
    } else if (updatedData?.Location) {
      payload = { location: updatedData?.Location };
    } else if (updatedData?.SelectedPlan) {
      payload = { selectedPlan: updatedData?.SelectedPlan };
    } else if (updatedData?.PrimaryInstrument) {
      payload = { instrument: updatedData?.PrimaryInstrument };
    } else if (updatedData?.RBAProfileActive) {
      payload = { RBA_PROFILE: updatedData?.RBAProfileActive };
    } else if (updatedData?.RBAAccountActive) {
      payload = { RBA_ACCOUNT: updatedData?.RBAAccountActive };
    } else if (updatedData?.ProRateCharged) {
      payload = { pro_rate_charge: updatedData?.ProRateCharged };
    }
    // else if (updatedData?.RBAProfileActive) {
    //   payload = { RBA_PROFILE: updatedData?.RBAProfileActive };
    // }

    // else if (
    //   key === "RBAAccountActive" ||
    //   key === "RBAProfileActive" ||
    //   key === "ProRateCharged"
    // ) {
    //   // Invert the boolean value for these keys
    //   payload = { [key]: !reportList[key] };
    // }

    const updatePayload = { ...payload, studentId: state?.id };

    setReportList((prev) => ({
      ...prev,
      [key]: editValue,
    }));

    const res = await dispatch(handelUpdateStudent(updatePayload));
    if (res?.status === 200) {
      setShowError("");
      fetchGetProfileList();
      setEditingField(null);
    }
    setLoading(false);
  };

  const fetachgetSubscriptionPlan = async () => {
    const res = await dispatch(getAllSubscriptionPlan({}));
    if (res?.status === 200) {
      setsubscriptionPlan(res?.data?.response?.result || {});
    }
  };

  const fetchLocation = async () => {
    const res = await dispatch(handleGetLocation({}));
    if (res?.status === 200) {
      setLocationList(res?.data?.response?.result || {});
    }
  };
  const fetchInstruments = async () => {
    const res = await dispatch(handelGetinstruments());
    if (res?.status === 200) {
      setInstrumentsList(res?.data?.response?.result || {});
    }
  };

  useEffect(() => {
    fetachgetSubscriptionPlan();
    fetchLocation();
    fetchInstruments();
  }, []);

  const fetchGetProfileList = async () => {
    if (!state?.id) return;
    // setLoadingData(true);
    const res = await dispatch(handelGetReport(state?.id));
    if (res?.status === 200) {
      setProfileList(res?.data?.response?.[0] || {});
    }
    // setLoadingData(false);
  };

  useEffect(() => {
    fetchGetProfileList();
  }, [state]);

  useEffect(() => {
    setReportList({
      Name: profileList?.firstName || "",
      SurName: profileList?.lastName || "",
      Email: profileList?.email || "",
      PhoneNumber: profileList?.phoneNumber || "",
      Location: profileList?.location?._id || "",
      PrimaryInstrument: profileList?.instruments?._id || "",
      AccountCreated: profileList?.createdAt || "",
      ProfileCreated: profileList?.createdAt || "",
      RBAAccountActive: profileList?.studentInfo?.RBA_ACCOUNT || "",
      RBAProfileActive: profileList?.studentInfo?.RBA_PROFILE || "",
      SelectedPlan: profileList?.selectedPlan?._id || "",
      ProRateCharged: profileList?.studentInfo?.pro_rate_charge || "",
      Deleted:
        profileList?.teachers?.[0]?.status === "deleted" ? "Yes" : "No" || "",
    });
  }, [profileList]);
  return (
    <div id="studentreport-container">
      {/* {loadingData ? (
        <div className="pt-150 f-center">
        <Roundedloader />
        </div>
      ) : ( */}
        {/* <> */}
          <div className="text-20-400 color-1a1a font-gilroy-m mb-20">
            {`${profileList?.firstName} ${profileList?.lastName}`}
          </div>
          <div className="cardBlock">
            {Object.keys(reportList).map((key, index) => {
              const value = reportList[key];
              const filteredList =
                (locationList?.length > 0 &&
                  locationList
                    ?.filter((ele) => ele?._id === value)
                    ?.map((ele) => ({
                      label: ele?.name,
                    }))) ||
                [];

              const filterInstrumentsListList =
                (instrumentsList?.length > 0 &&
                  instrumentsList
                    ?.filter((ele) => ele?._id === value)
                    ?.map((ele) => ({
                      label: ele?.name,
                    }))) ||
                [];

              const filterSelectedPlanList =
                (subscriptionPlan?.length > 0 &&
                  subscriptionPlan
                    ?.filter((ele) => ele?._id === value)
                    ?.map((ele) => ({
                      label: ele?.title,
                    }))) ||
                [];

              return (
                <div className="block" key={index}>
                  <div className="label text-18-400 color-5151 font-gilroy-m text-break">
                    {key}
                  </div>
                  <div className="value text-18-400 color-1a1a font-gilroy-m fa-center gap-3 text-break">
                    {editingField === key ? (
                      <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <div className="tex-div">
                            {key === "Location" ? (
                              <Dropdown
                                value={editValue}
                                onChange={(selected) =>
                                  setEditValue(selected?.target?.data?.id)
                                }
                                options={
                                  locationList?.map((ele) => ({
                                    id: ele?._id,
                                    label: ele?.name,
                                  })) || []
                                }
                              />
                            ) : key === "PrimaryInstrument" ? (
                              <Dropdown
                                value={editValue}
                                onChange={(selected) =>
                                  setEditValue(selected?.target?.data?.id)
                                }
                                options={
                                  instrumentsList?.map((ele) => ({
                                    id: ele?._id,
                                    label: ele?.name,
                                  })) || []
                                }
                              />
                            ) : key === "SelectedPlan" ? (
                              <Dropdown
                                value={editValue}
                                onChange={(selected) =>
                                  setEditValue(selected?.target?.data?.id)
                                }
                                // optionLabel="label"
                                options={
                                  subscriptionPlan?.map((ele) => ({
                                    id: ele?._id,
                                    label: ele?.title,
                                  })) || []
                                }
                              />
                            ) : (
                              <TextInput
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                            )}
                          </div>
                          <Button
                            loading={loading}
                            disabled={editValue === reportList[key]||loading}
                            onClick={() => {
                              handleSave(key);
                            }}
                            className="h-35"
                            btnText="Save"
                          />
                        </div>
                        {errors[key] && (
                          <div className="input-error">{errors[key]}</div>
                        )}
                        {/* {showError && (
                      <div className="input-error">{showError}</div>
                    )} */}
                      </div>
                    ) : (
                      <>
                        {key === "RBAAccountActive" ||
                        key === "RBAProfileActive" ||
                        key === "ProRateCharged" ? (
                          <div
                            className={`f-center gap-2 flex-nowrap ${
                              value === true ? "yesBox" : "noBox"
                            }`}
                            // onClick={() => {
                            //   setEditValue(
                            //     key === "RBAAccountActive" ||
                            //       key === "RBAProfileActive" ||
                            //       key === "ProRateCharged"
                            //       ? value === true
                            //         ? false
                            //         : true
                            //       : ""
                            //   );
                            //   setTimeout(() => {
                            //     handleSave(key);
                            //   }, 2000);
                            // }}
                          >
                            <div
                              className={`text-16-400 font-gilroy-m ${
                                value === true ? "color-5ea1" : "color-1515"
                              }`}
                            >
                              {value === true ? "Yes" : "No"}
                            </div>
                            <div className="w-20 h-20 f-center">
                              <img
                                src={
                                  value === true ? icons.gRight : icons.rCancel
                                }
                                alt=""
                                className="fit-image"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className=" text-18-400 color-1a1a font-gilroy-m fa-center gap-3">
                            {key === "Location"
                              ? filteredList?.[0]?.label
                              : key === "PrimaryInstrument"
                              ? filterInstrumentsListList?.[0]?.label
                              : key === "SelectedPlan"
                              ? filterSelectedPlanList?.[0]?.label
                              : value}
                          </div>
                        )}
                      </>
                    )}

                    {key === "AccountCreated" ||
                    key === "ProfileCreated" ||
                    key === "RBAAccountActive" ||
                    key === "RBAProfileActive" ||
                    key === "ProRateCharged" ||
                    key === "Deleted" ? (
                      <></>
                    ) : (
                      <div>
                        {editingField !== key ? (
                          <div className="w-28 h-28 f-center">
                            <img
                              src={icons.editImg}
                              alt="Edit"
                              className="fit-image edit-icon"
                              onClick={() => handleEdit(key)}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        {/* </> */}
      {/* )} */}
    </div>
  );
};

export default StudentReport;
