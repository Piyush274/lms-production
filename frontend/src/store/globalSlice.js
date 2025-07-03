import { createSlice } from "@reduxjs/toolkit";
import { api } from "services/api";
import { encrypt, storeLocalStorageData } from "utils/helpers";

const initialState = {
  authData: null,
  errorData: null,
  showInstrumentForm: false,
  showEvenModal: false,
  showNewShedule: false,
  showAddInstument: false,
  instrumentData: {},
  locationList: [],
  instrumentList: [],
  showAdminProfile: false,
  adminProfileData: {},
  profileData: {},
  showAdminresetPopup: false,
  showSubscriptionPopup: false,
  subScriptionData: {},
  showUserEditPopup: false,
  userEditData: {},
  showChatGroupPopup: false,
  viewStudentDetailsPop: false,
  viewStudentDetails: {},
  viewTeacherDetailsPop: false,
  viewTeacherDetails: {},
  virtualOpen: false,
  IsLocation: false,
  EditList: [],
  mettingData: [],
  IsMetting: false,
  isUserActive: null,
  selectedFile: null,
  selectedChatData: {},
  groupId: null,
  isMeetStarted: false,
  addNotification: null,
  scheduleList: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.authData = action.payload;
    },
    setErrorData(state, action) {
      state.errorData = action.payload;
    },
    setShowInstrumentForm(state, action) {
      state.showInstrumentForm = action.payload;
    },
    setIsMeetingStarted(state, action) {
      state.isMeetStarted = action.payload;
    },
    setShowEvenModal(state, action) {
      state.showEvenModal = action.payload;
    },
    setShowNewShedule(state, action) {
      state.showNewShedule = action.payload;
    },
    setinstrumentData(state, action) {
      state.instrumentData = action.payload;
    },
    setshowAddInstument(state, action) {
      state.showAddInstument = action.payload;
    },
    setLocationList(state, action) {
      state.locationList = action.payload;
    },
    setInstrumentList(state, action) {
      state.instrumentList = action.payload;
    },
    setShowAdminProfile(state, action) {
      state.showAdminProfile = action.payload;
    },
    setAdminProfileData(state, action) {
      state.adminProfileData = action.payload;
    },
    setProfileData(state, action) {
      state.profileData = action.payload;
    },
    setShowAdminresetPopup(state, action) {
      state.showAdminresetPopup = action.payload;
    },
    setShowSubscriptionPopup(state, action) {
      state.showSubscriptionPopup = action.payload;
    },
    setSubScriptionData(state, action) {
      state.subScriptionData = action.payload;
    },
    setShowUserEditPopup(state, action) {
      state.showUserEditPopup = action.payload;
    },
    setUserEditData(state, action) {
      state.userEditData = action.payload;
    },
    setShowChatGroupPopup(state, action) {
      state.showChatGroupPopup = action.payload;
    },
    setViewStudentDetails(state, action) {
      state.viewStudentDetails = action.payload;
    },
    setViewStudentDetailsPopUp(state, action) {
      state.viewStudentDetailsPop = action.payload;
    },
    setViewTeacherDetails(state, action) {
      state.viewTeacherDetails = action.payload;
    },
    setViewTeacherDetailsPopUp(state, action) {
      state.viewTeacherDetailsPop = action.payload;
    },
    setVirtualOpen(state, action) {
      state.virtualOpen = action.payload;
    },
    setEditList(state, action) {
      state.EditList = action.payload;
    },
    setIsLocation(state, action) {
      state.IsLocation = action.payload;
    },
    setMettingData(state, action) {
      state.mettingData = action.payload;
    },
    setIsMetting(state, action) {
      state.IsMetting = action.payload;
    },
    setIsUserActive(state, action) {
      state.isUserActive = action.payload;
    },
    setSelectedFile(state, action) {
      state.selectedFile = action.payload;
    },
    setSelectedChatData(state, action) {
      state.selectedChatData = action.payload;
    },
    setGroupId(state, action) {
      state.groupId = action.payload;
    },
    setAddNotification(state, action) {
      state.addNotification = action.payload;
    },
    setScheduleList(state, action) {
      state.scheduleList = action.payload;
    },
    resetAllState(state) {
      state.authData = null;
      state.errorData = null;
      state.showInstrumentForm = false;
      state.showEvenModal = false;
      state.showNewShedule = false;
      state.showAddInstument = false;
      state.instrumentData = {};
      state.locationList = [];
      state.instrumentList = [];
      state.showAdminProfile = false;
      state.adminProfileData = {};
      state.profileData = {};
      state.showAdminresetPopup = false;
      state.showUserEditPopup = false;
      state.userEditData = {};
      state.showChatGroupPopup = false;
      state.viewStudentDetails = {};
      state.viewStudentDetailsPop = false;
      state.viewTeacherDetails = {};
      state.viewTeacherDetailsPop = false;
      state.virtualOpen = false;
      state.IsLocation = false;
      state.EditList = [];
      state.IsMetting = false;
      state.mettingData = [];
      state.isUserActive = null;
      state.selectedFile = null;
      state.selectedChatData = {};
      state.groupId = null;
      state.isMeetStarted = false;
      state.addNotification = null;
    },
  },
});

export const handleLogin = (payload) => async (dispatch) => {
  try {
    const res = await api.post("/auth/sign-in", payload, {});
    if (res?.status === 200) {
      storeLocalStorageData({ ...res?.data.response });
      dispatch(setAuthData(encrypt({ ...res?.data?.response })));
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handleForgotPassword = (payload) => async (dispatch) => {
  try {
    const res = await api.post("/auth/forgot-password", payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handleResetPassword = (payload) => async (dispatch) => {
  try {
    const res = await api.post("/auth/reset-password", payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Admin registration
export const handleAdminRegistration = (payload) => async (dispatch) => {
  try {
    const res = await api.post("/admin/register-user", payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Get Location, Get Instrument
export const handleGetLocation =
  ({ limit, offset } = {}) =>
  async (dispatch) => {
    try {
      let query = "";
      if (limit !== undefined && offset !== undefined) {
        query = `?limit=${limit}&offset=${offset}`;
      }
      const res = await api.get(`/locations${query}`, {});
      if (res?.status === 200) {
        dispatch(setLocationList(res?.data?.response?.result));
        return res;
      }
      return res;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };
export const handleGetInstrument =
  ({ limit, offset } = {}) =>
  async (dispatch) => {
    try {
      let query = "";
      if (limit !== undefined && offset !== undefined) {
        query = `?limit=${limit}&offset=${offset}`;
      }
      const res = await api.get(`/instruments${query}`, {});
      if (res?.status === 200) {
        dispatch(setInstrumentList(res?.data?.response?.result));
        return res;
      }
      return res;
    } catch (error) {
      return dispatch(handelCatch(error));
    }
  };

// Admin Instrument
export const addInstrument = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/instrument`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateInstrument = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/instrument`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// For Zoom MEet
export const updateStudent = (payload) => async (dispatch) => {
  try {
    const res = await api.update(`/updateUser`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    const res = await api.getUser(`/getUser?userId=${id}`, {});
    if (res?.status === 200) {
      dispatch(setProfileData(res?.data?.response));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const deleteInstrument = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/instrument/${id}`, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handleLocationDelete = (payload) => async (dispatch) => {
  try {
    const res = await api.post("/admin/location/delete", payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// get and update profile and reset password
export const getProfile = () => async (dispatch) => {
  try {
    const res = await api.get(`/auth/profile`);
    if (res?.status === 200) {
      dispatch(setProfileData(res?.data?.response || {}));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateProfileData = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/auth/update-profile`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const resetPasswordMail = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/auth/change-password-mail`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const resetPassword = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/auth/update-password`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Admin all strudent and teacher list
export const getUserslist = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/users-list`, payload, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateUserStatus = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/update-user`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteUser = (payload) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/user/${payload}`);
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getUserDetailsByID = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/user/${id}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getTeacherStudentList = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/teacher-students/${id}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// Admin Subscription
export const getAllSubscription = () => async (dispatch) => {
  try {
    const res = await api.get(`/plans`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const addSubscriptionPlan = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/plan`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const updateSubscriptionPlan = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/plan`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const deleteSubscriptionPlan = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/admin/plan/${id}`, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelpurchesPlan = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/plan-payment`, payload, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// teacher
export const handelGetStudentList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/my-students`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelRemoveStudent = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/remove-student`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelUnFollowStudent = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/unfollow-student`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUnArchive = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/unarchive-student`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelGetAllStudentList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/all-students`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddStudent = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/add-student`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetDeleteStudentList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/deleted-students`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetinstruments = (payload) => async (dispatch) => {
  try {
    const res = await api.get(`/instruments`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetCategories = (payload) => async (dispatch) => {
  try {
    const res = await api.get(`/categories`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddNewSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/new-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetMySkillList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/get-my-skills`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetAllSkillList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/get-all-skills`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetDeleteSkillList = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/get-archived-skills`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelRemoveSkill = (id) => async (dispatch) => {
  try {
    const res = await api.delete(`/teachers/remove-skill/${id}`);
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/create-skill`, payload, {
      "Content-Type": "multipart/form-data",
    });
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelUpdateSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/teachers/update-skill`, payload, {
      "Content-Type": "multipart/form-data",
    });
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      //   dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelRemoveAllSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/teachers/remove-teacher-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetSkillTemplate = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/skill-templates/${id}`);
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddAssignSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/assign-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetStudentProfile = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/student-details/${id}`);
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelStudentGetAssignedSkill = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/get-assigned-skill/${id}`);
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const markAttendance = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/mark-attendance`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelUpdateSkillAction = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/teachers/update-assigned-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUpdateSkillActionVC = (payload) => async (dispatch) => {
  try {
    const res = await api.put(
      `/teachers/update-assigned-skill-videocall`,
      payload,
      {}
    );
    const response = await dispatch(handelResponse(res));
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUpdateAsssignSkill = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/students/change-assigned-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelGetSkillDetails = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/skill-details/${id}`, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUpdatedocument = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/teachers/update-document-title`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddNewExternal = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/manage-external-video`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelCopySkill = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/copy-skill`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelTecherSchedule = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/schedule-lessons`, {});

    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// export const handelGetSchedule = (payload) => async (dispatch) => {
//   const { startDate, endDate } = payload;
//   let queryString;
//   if (startDate) {
//     queryString = `startDate=${startDate}&`;
//   }
//   if (endDate) {
//     queryString += `endDate=${endDate}`;
//   }

//   try {
//     const res = await api.get(`/students/schedule-lessons?${queryString}`, {});
//     if (res?.status === 200) {
//       return res;
//     }
//     return res;
//   } catch (error) {
//     return dispatch(handelCatch(error));
//   }
// };

//admin

export const handelGetTeacherList = () => async (dispatch) => {
  try {
    const res = await api.get(`/admin/filter-teachers`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelLocationTeacherList = (req) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/location-teachers/${req}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getAllSubscriptionPlan = () => async (dispatch) => {
  try {
    const res = await api.get(`/plans`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getStudentdetails = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/student/${id}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUpdateStudent = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/teachers/edit-student`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetReport = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/student-report/${id}`, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getTeachersDetails = () => async (dispatch) => {
  try {
    const res = await api.get(`/teachers/dashboard`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelAddLocation = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/location`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelEditLocation = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/admin/location`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelAddMettingLink = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/teachers/add-meet-link`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//user
export const getStudentSkilldetails = (payload) => async (dispatch) => {
  const { sortKey, sortKeyOrder } = payload;
  let queryString;
  if (sortKey) {
    queryString = `sortKey=${sortKey}&`;
  }
  if (sortKeyOrder) {
    queryString += `sortKeyOrder=${sortKeyOrder}`;
  }
  try {
    const res = await api.get(`/students/my-skills?${queryString}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const getStudentDashboard = (id) => async (dispatch) => {
  try {
    const res = await api.get(`/students/dashboard/${id}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelUpdateStudentProfile = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/auth/update-profile`, payload, {
      "Content-Type": "multipart/form-data",
    });
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelAddConsultation = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/students/add-consultation`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelGetConsultation = (payload) => async (dispatch) => {
  const { search } = payload;

  try {
    const res = await api.get(`/admin/get-consultation?search=${search}`, {});
    if (res?.status === 200) {
      dispatch(setProfileData(res?.data?.response));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelGetStuentSkillDetails = (payload) => async (dispatch) => {
  const { studentId, id } = payload;
  try {
    const res = await api.get(
      `/students/assigns-skill-details/${id}?studentId=${studentId}`,
      {}
    );
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelUpdateStudentVideo = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/students/response-video`, payload, {
      "Content-Type": "multipart/form-data",
    });
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      //   dispatch(showSuccess(res?.data?.message));
      return response;
    }
    return response;
  } catch (error) {
    dispatch(handelCatch(error));
    return error;
  }
};

export const handelUpdateStudentResponse = (payload) => async (dispatch) => {
  try {
    const res = await api.put(`/students/update-response-video`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};
export const handelGetHistory = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/students/skill-history`, payload, {});
    const response = await dispatch(handelResponse(res));
    if (response?.status === 200) {
      return response;
    }
    return response;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

//user lesson-schedule
export const handelStudentSchedule = () => async (dispatch) => {
  try {
    const res = await api.get(`/students/schedule-lessons`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

// export const handelGetLessonSchedule = (payload) => async (dispatch) => {
//   const { startDate, endDate } = payload;
//   let queryString;
//   if (startDate) {
//     queryString = `startDate=${startDate}&`;
//   }
//   if (endDate) {
//     queryString += `endDate=${endDate}`;
//   }

//   try {
//     const res = await api.get(`/students/schedule-lessons?${queryString}`, {});
//     if (res?.status === 200) {
//       return res;
//     }
//     return res;
//   } catch (error) {
//     return dispatch(handelCatch(error));
//   }
// };

//parent
export const getchildern = () => async (dispatch) => {
  try {
    const res = await api.get(`/students/get-my-child-list`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getparentdashboard = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/students/parent-dashboard`, payload, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getLessonSchedule = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/schedule-lessons`, payload, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getUserList = (userId) => async (dispatch) => {
  try {
    const res = await api.get(`/chat/fetch-user-data/${userId}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getStudentslistTeacherWise = () => async (dispatch) => {
  try {
    const res = await api.get(`/chat/fetch-student-data`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const addActionTaken = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-action-take`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getActionTaken = (studentId) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-action-take/${studentId}`, {});
    if (res?.status === 200) {
      // dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const addOutReach = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-out-reach`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getOutReach = (studentId) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-out-reach/${studentId}`, {});
    if (res?.status === 200) {
      // dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const addPerformance = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-performance`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getPerformance = (studentId) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-performance/${studentId}`, {});
    if (res?.status === 200) {
      // dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const addInstAssessment = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/admin/add-inst-assessment`, payload, {});
    if (res?.status === 200) {
      dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getInstAssessment = (studentId) => async (dispatch) => {
  try {
    const res = await api.get(`/admin/get-inst-assessment/${studentId}`, {});
    if (res?.status === 200) {
      // dispatch(showSuccess(res?.data?.message));
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};


export const handleCreateGroup = (payload) => async (dispatch) => {
  try {
    const res = await api.post(`/chat/create-group`, payload, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchAllGroup = () => async (dispatch) => {
  try {
    const res = await api.get(`/chat/fetch-all-group`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const fetchAllMessages = (group_id) => async (dispatch) => {
  try {
    const res = await api.get(`/chat/get-message?group_id=${group_id}`, {});
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const getNotification = () => async (dispatch) => {
  try {
    const res = await api.get(`/auth/get-notification`);
    if (res?.status === 200) {
      return res;
    }
    return res;
  } catch (error) {
    return dispatch(handelCatch(error));
  }
};

export const handelResponse = (res) => async () => {
  let returnValue = null;
  const status = res?.status;
  switch (status) {
    case 200:
      returnValue = res;
      break;
    case 201:
      returnValue = res;
      break;
    case 204:
      returnValue = {
        status: status,
        data: [],
      };
      break;
    case 400:
      console.log(res);
      break;
    default:
      throwError({ message: "Something went wrong!" });
      returnValue = {
        status: status,
        message: "Something went wrong!",
      };
      break;
  }
  return returnValue;
};
export const handelCatch = (error) => async (dispatch) => {
  let status = error?.response?.status;
  let messsage = error?.response?.data?.message || "Something went wrong!";
  let returnCatch = {
    status: status,
    messsage: messsage,
  };
  if (status === 401) {
    dispatch(throwError("Session is expired"));
    dispatch(setAuthData(encrypt({ time: new Date().toLocaleString() })));
    dispatch(resetAllState(null));
    localStorage.removeItem("authData");
    localStorage.clear();
  } else if (status === 403) {
    messsage =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Something went wrong!";
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else if (status === 409) {
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else if (status === 404) {
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else if (status === 400) {
    messsage = error?.response?.data?.message || "Something went wrong!";
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else if (status === 500) {
    messsage = error?.response?.data?.message || "Something went wrong!";
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else if (status === 422) {
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  } else {
    dispatch(
      setErrorData({
        show: true,
        message: messsage,
        type: "danger",
      })
    );
  }
  return returnCatch;
};
export const showSuccess = (message) => async (dispatch) => {
  dispatch(
    setErrorData({
      show: true,
      message: message,
      type: "success",
    })
  );
};
export const throwError = (message) => async (dispatch) => {
  let newMessage = message;
  newMessage = message || "Something went wrong!";
  dispatch(
    setErrorData({
      show: true,
      message: newMessage,
      type: "danger",
    })
  );
};

export const {
  setAuthData,
  setErrorData,
  resetAllState,
  setShowInstrumentForm,
  setIsMeetingStarted,
  setShowEvenModal,
  setShowNewShedule,
  setinstrumentData,
  showAddInstument,
  setshowAddInstument,
  setLocationList,
  setInstrumentList,
  setAdminProfileData,
  setShowAdminProfile,
  setProfileData,
  setShowAdminresetPopup,
  setSubScriptionData,
  setShowSubscriptionPopup,
  setShowUserEditPopup,
  setUserEditData,
  setShowChatGroupPopup,
  setViewStudentDetailsPopUp,
  setViewStudentDetails,
  setViewTeacherDetailsPopUp,
  setViewTeacherDetails,
  setVirtualOpen,
  setIsLocation,
  setEditList,
  setIsMetting,
  setMettingData,
  setIsUserActive,
  setSelectedFile,
  setSelectedChatData,
  setGroupId,
  setAddNotification,
  setScheduleList,
} = globalSlice.actions;

export default globalSlice.reducer;
