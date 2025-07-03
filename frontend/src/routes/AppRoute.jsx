import AccountSetting from "@/pages/Admin/AccountSetting";
import AdminCalender from "@/pages/Admin/AdminCalender";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminInstrument from "@/pages/Admin/AdminInstrument";
import AdminMasterForm from "@/pages/Admin/AdminMasterForm";
import AdminRegistration from "@/pages/Admin/AdminRegistration";
import AdminStudentList from "@/pages/Admin/AdminStudentList";
import AdminTeacherList from "@/pages/Admin/AdminTeacherList/AdminTeacherList";
import ConsultationData from "@/pages/Admin/ConsultationData";
import PaymentApprove from "@/pages/Admin/PaymentApprove";
import PaymentetailsAdmin from "@/pages/Admin/PaymentetailsAdmin";
import SubScription from "@/pages/Admin/SubScription";
import TeacherStudentList from "@/pages/Admin/TeacherStudentList";
import Layout from "@/pages/Layout";
import Parent from "@/pages/Parent";
import ParentAccount from "@/pages/Parent/ParentAccount";
import ParentBilling from "@/pages/Parent/ParentBilling";
import ParentDashBoard from "@/pages/Parent/ParentDashBoard";
import SkillAssessment from "@/pages/SkillAssessment";
import SkillDetails from "@/pages/SkillAssessment/SkillDetails";
import SelectedStudentDashboard from "@/pages/Teacher/SelectedStudentDashboard";
import Skills from "@/pages/Teacher/Skills";
import StudentReport from "@/pages/Teacher/StudentReport";
import StudentsList from "@/pages/Teacher/StudentsList";
import TeacherAccountSetting from "@/pages/Teacher/TeacherAccountSetting";
import TeacherBilling from "@/pages/Teacher/TeacherBilling";
import PaymentDetailsTeacher from "@/pages/Teacher/TeacherBilling/PaymentDetailsTeacher";
import TeacherChat from "@/pages/Teacher/TeacherChat";
import TeacherDashboad from "@/pages/Teacher/TeacherDashboad";
import TeacherLessionSchedule from "@/pages/Teacher/TeacherLessionSchedule";
import TeacherMetingRoom from "@/pages/Teacher/TeacherMetingRoom";
import AccountSettings from "@/pages/UserPage/AccountSettings";
import Billing from "@/pages/UserPage/Billing";
import PaymentDetails from "@/pages/UserPage/Billing/PaymentDetails";
import Chat from "@/pages/UserPage/Chat";
import Dashboard from "@/pages/UserPage/Dashboard";
import Introduction from "@/pages/UserPage/Introduction";
import LessonSchedule from "@/pages/UserPage/LessonSchedule";
import MetingRoom from "@/pages/UserPage/MetingRoom";
import { getProfile } from "@/store/globalSlice";
import { getDataFromLocalStorage, titleCaseString } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Performance from "@/pages/Admin/AdminPerformances";

export const AppRoutes = ({ userRole, show, setShow, handleLogout }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const reduxData = useSelector((state) => state.global);
  const { profileData } = reduxData || {};
  const isAuth = getDataFromLocalStorage("isFirstLogin");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isResponsive = windowWidth < 990;

  const getProfileData = async () => {
    await dispatch(getProfile());
  };

  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeLine = location?.pathname === "/teacher/skills/student-skill";

  const adminRoutes = (
    <Routes>
      <Route
        path="/admin/dashboard"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your dashboard!",
            }}
          >
            <AdminDashboard show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/registration"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Registration",
              description: "Create accounts for students and instructors",
            }}
          >
            <AdminRegistration />
          </Layout>
        }
      />
      <Route
        path="/admin/calender"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Calendar",
              description: "Manage all scheduled lessons",
            }}
          >
            <AdminCalender show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/studentlist"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "All Students",
              description: "Manage all your registered students",
            }}
          >
            <AdminStudentList show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/teacherlist"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "All Teachers",
              description: "Manage all your registered teachers",
            }}
          >
            <AdminTeacherList show={show} />
          </Layout>
        }
      />
      {/* <Route
        path="/admin/consultation"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your Consultation!",
            }}
          >
            <ConsultationData show={show} />
          </Layout>
        }
      /> */}

      <Route
        path="/admin/teacher-students"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
          >
            <TeacherStudentList />
          </Layout>
        }
      />
      <Route
        path="/admin/SubScription"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
          >
            <SubScription />
          </Layout>
        }
      />
      <Route
        path="/admin/accountsetting"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Account Settings",
              description: "Customize Your Preferences and Profile",
            }}
          >
            <AccountSetting />
          </Layout>
        }
      />
      <Route
        path="/admin/instrument"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Instruments",
              description: "Manage all instruments",
            }}
          >
            <AdminInstrument show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/payment/:id"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your subscription !",
            }}
          >
            <PaymentetailsAdmin show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/payment-status/:id"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your subscription !",
            }}
          >
            <PaymentApprove show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/master-form/:type"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your Master Form!",
            }}
          >
            <AdminMasterForm show={show} />
          </Layout>
        }
      />
      <Route
        path="/admin/performance"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Performance",
              description: "View and manage performance data",
            }}
          >
            <Performance />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to={"/admin/dashboard"} />} />
    </Routes>
  );
  const userRoutes = (
    <Routes>
      {/* <Route
          path="/user"
          element={
            <Layout
              role={userRole}
              setShow={setShow}
              show={show}
              handleLogout={handleLogout}
            >
              <Introduction />
            </Layout>
          }
        /> */}
      <Route
        path="/user"
        element={
          isAuth ? (
            <Navigate to="/user/dashboard" />
          ) : (
            <Layout
              role={userRole}
              setShow={setShow}
              show={show}
              handleLogout={handleLogout}
            >
              <Introduction />
            </Layout>
          )
        }
      />
      <Route
        path="/user/chat"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Chat",
              description: "Messages from your instructors will appear here",
            }}
            handleLogout={handleLogout}
          >
            <Chat />
          </Layout>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your Practice Pad dashboard!",
            }}
            handleLogout={handleLogout}
          >
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/user/lesson-schedule"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Lesson Schedule",
              description: "Plan your learning, One Lesson at a Time",
            }}
            handleLogout={handleLogout}
          >
            <LessonSchedule />
          </Layout>
        }
      />
      <Route
        path="/user/billing"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Billing",
              description: "Manage your payments and subscriptions easily",
            }}
            handleLogout={handleLogout}
          >
            <Billing />
          </Layout>
        }
      />
      <Route
        path="/user/billing/payment-details"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Billing",
              description: "Manage your payments and subscriptions easily",
            }}
            handleLogout={handleLogout}
          >
            <PaymentDetails />
          </Layout>
        }
      />
      <Route
        path="/user/account-settings"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Account Settings",
              description: "Customize Your Preferences and Profile",
            }}
            handleLogout={handleLogout}
          >
            <AccountSettings />
          </Layout>
        }
      />
      <Route
        path="/user/skill-assignments"
        element={
          <Layout
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            role={userRole}
            data={{
              name: "Skills & Assessments",
              description: "Track Your Progress and Master New Skills",
            }}
            isNotification={true}
          >
            <SkillAssessment show={show} />
          </Layout>
        }
      />
      <Route
        path="/user/skill-assignments/details"
        element={
          <Layout
            setShow={setShow}
            show={show}
            role={userRole}
            handleLogout={handleLogout}
            data={{
              name: "Skills & Assessments",
              description: "Track Your Progress and Master New Skills new",
            }}
            isNotification={true}
          >
            <SkillDetails show={show} />
          </Layout>
        }
      />
      <Route path="/user/meting-room" element={<MetingRoom />} />
      <Route
        path="*"
        element={<Navigate to={`${!isAuth ? "/user" : "/user/dashboard"}`} />}
      />
    </Routes>
  );
  const teacherRoutes = (
    <Routes>
      <Route
        path="/teacher/dashboard"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your Practice Pad dashboard!",
            }}
          >
            <TeacherDashboad />
          </Layout>
        }
      />
      <Route
        path="/teacher/lesson-schedule"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Your Lesson Schedule",
              description: "Plan Your Lessons With Selected Students",
            }}
            handleLogout={handleLogout}
          >
            <TeacherLessionSchedule />
          </Layout>
        }
      />
      <Route
        path="/teacher/student-dashboard"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your Practice Pad dashboard!",
            }}
          >
            <SelectedStudentDashboard />
          </Layout>
        }
      />
      <Route
        path="/teacher/studentList"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: `Students`,
              description: "Manage, Follow and Track Student's Performance",
            }}
          >
            <StudentsList />
          </Layout>
        }
      />
      <Route
        path="/teacher/skills/:type"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: `Skills`,
              description: `${
                removeLine
                  ? ""
                  : "Create, Manage and Assign Student's Skills and Skill Templates"
              }`,
            }}
          >
            <Skills />
          </Layout>
        }
      />
      <Route
        path="/teacher/skills/create-skill/:type"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: `Skills`,
              description:
                "Create, Manage and Assign Student's Skills and Skill Templates",
            }}
          >
            <Skills />
          </Layout>
        }
      />

      <Route
        path="/teacher/chat"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Chat",
              description: "Messages from your students will appear here",
            }}
            handleLogout={handleLogout}
          >
            <TeacherChat />
          </Layout>
        }
      />
      <Route
        path="/teacher/student-report"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Student Report",
              description: "Manager and View Student's Reports",
            }}
            handleLogout={handleLogout}
          >
            <StudentReport isResponsive={isResponsive} />
          </Layout>
        }
      />
      <Route
        path="/teacher/billing"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Billing",
              description: "Manage your payments and subscriptions easily",
            }}
            handleLogout={handleLogout}
          >
            <TeacherBilling />
          </Layout>
        }
      />
      <Route
        path="padetails"
        element={
          <Layout
            role={userRole}
            isNotification={true}
            setShow={setShow}
            show={show}
            data={{
              name: "Billing",
              description: "Manage your payments and subscriptions easily",
            }}
            handleLogout={handleLogout}
          >
            <PaymentDetailsTeacher />
          </Layout>
        }
      />
      <Route
        path="/teacher/accountsetting"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Account Settings",
              description: "Customize Your Preferences and Profile",
            }}
          >
            <TeacherAccountSetting />
          </Layout>
        }
      />
      <Route path="/teacher/meting-room" element={<TeacherMetingRoom />} />
      <Route path="*" element={<Navigate to={"/teacher/dashboard"} />} />
    </Routes>
  );
  const parentRoute = (
    <Routes>
      <Route
        path="/parent/dashboard"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your dashboard!",
            }}
          >
            <Parent show={show} />
          </Layout>
        }
      />

      <Route
        path="/parent/dashboard/:type"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: `Hello, ${titleCaseString(
                profileData?.firstName
              )} ${titleCaseString(profileData?.lastName)}! 👋`,
              description: "Welcome to your dashboard!",
            }}
          >
            <ParentDashBoard />
          </Layout>
        }
      />

      <Route
        path="/parent/billing"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            data={{
              name: "Billing",
              description: "Manage your payments and subscriptions easily",
            }}
          >
            <ParentBilling />
          </Layout>
        }
      />

      <Route
        path="/parent/accountsetting"
        element={
          <Layout
            role={userRole}
            setShow={setShow}
            show={show}
            handleLogout={handleLogout}
            isNotification={true}
            data={{
              name: "Account Settings",
              description: "Customize Your Preferences and Profile",
            }}
          >
            <ParentAccount />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to={"/parent/dashboard"} />} />
    </Routes>
  );

  return userRole === "admin"
    ? adminRoutes
    : userRole === "student"
    ? userRoutes
    : userRole === "teacher"
    ? teacherRoutes
    : parentRoute;
};
