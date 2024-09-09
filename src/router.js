//Phase01
import Login from "./components/phase01/Login.vue";
import Signup from "./components/phase01/Signup.vue";
import Forgotpassword from "./components/phase01/Forgotpassword.vue";
//Phase02
import MasterPage from "./components/phase02/MasterPage.vue";
//Phase03
import UploadFile from "./components/Signature/UploadFile.vue";
import Step01 from "./components/signature/Step01.vue";
import AddPerson from "./components/signature/Step02.vue";
import Display from "./components/signature/Step03.vue";
import Confirm from "./components/signature/Step04.vue";
//Phase04
import DM from "./components/phase04/directoryManagement.vue";
import CM from "./components/phase04/contactsManagement.vue";
import Setting from "./components/phase04/Setting.vue";
//Setting
import CP from "./components/setting/Password.vue";
//Layout
import { createRouter, createWebHistory } from "vue-router";
import Sidebar from "./components/layout/Sidebar.vue";
import Header from "./components/layout/Header.vue";
import BottomButton from "./components/layout/BottomButton.vue";
import Processing from "./components/layout/Processing.vue";
//Test
import test from "./components/testFile/test.vue";
import Test02 from "./components/testFile/Test02.vue";
import { set } from "lodash";
const routes = [
  {
    name: "Home",
    component: Login,
    path: "/",
  },
  {
    name: "SignUp",
    component: Signup,
    path: "/Dang-ky",
  },
  {
    name: "Login",
    component: Login,
    path: "/Dang-nhap",
  },
  //Password
  {
    name: "ForgotPass",
    component: Forgotpassword,
    path: "/Quen-mat-khau",
  },
  {
    name: "ChangePass",
    component: CP,
    path: "/Doi-mat-khau",
  },
  //Phase02
  {
    name: "MasterPage",
    component: MasterPage,
    path: "/Trang-chu",
  },
  {
    name: "DM",
    component: DM,
    path: "/Quan-ly-danh-muc",
  },
  {
    name: "CM",
    component: CM,
    path: "/Quan-ly-danh-ba",
  },
  {
    name: "ST",
    component: Setting,
    path: "/Cai-dat",
  },
  
  {
    name: "Display",
    component: Display,
    path: "/Thiet-lap-vung-ky",
  },
  {
    name: "UploadFile",
    component: UploadFile,
    path: "/Upload-File",

  },
  {
    name: "AddPerson",
    component: AddPerson,
    path: "/Them-nguoi",
  },
  {
    name: "EditFile",
    component: Step01,
    path: "/Chinh-sua-van-ban",
  },
  {
    name: "Sidebar",
    component: Sidebar,
    path: "/Sidebar",
  },
  {
    name: "Header",
    component: Header,
    path: "/Header",
  },
  {
    name: "Bottom",
    component: BottomButton,
    path: "/Bottom",
  },
  {
    name: "Confirm",
    component: Confirm,
    path: "/Xac-nhan",
  },
  {
    name: "StepNav",
    component: Processing,
    path: "/Processing",
  },
  {
    name: "Test",
    component: test,
    path: "/Test",
  },
  {
    name: "Test02",
    component: Test02,
    path: "/Test02",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
