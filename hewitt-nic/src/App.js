import React from 'react';
import niclogo from './nicLogo.png'
import hewittlogo from './hewittLogo.png'

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEffect, useState } from 'react';

import {
  UnorderedListOutlined,
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  MailOutlined,
  LineChartOutlined
} from '@ant-design/icons';

import { Layout, Menu, theme, Typography } from 'antd';
import { useLocation, BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';

import { ConfigProvider } from 'antd';

import GlobalStylesProvider from './globalStyles';
import ProtectedRoute from './Protection/protectedRoute';

// User authentication components
import WelcomePage from './Welcome Page/welcomePage'; 
import SignUp from './Sign Up/SignUp';
import GuardianSignUp from './Sign Up/guardianSignUp';
import JudgeSignUp from './Sign Up/judgeSignUp';
import Logout from './logout/logout';
import NoPermission from './Warnings/noPermission';

// Admin components
import CompetitionManagement from './Admin/Competition Management/competitionManagement';
import UserManagement from './Admin/User Management/UserManagement';
import CompetitionEditor from './Admin/Competition Management/competitionEditPage';
import AdminRubric from './Admin/Admin Rubric Page/adminRubric';
import ViewRubric from './Admin/Admin Rubric Page/pages/viewRubric';
import PreviewRubric from './Admin/Admin Rubric Page/pages/previewRubric';
import EditRubric from './Admin/Admin Rubric Page/pages/editRubric';
import Chart from './Admin/View Statistic/chart';

// Judge and Guardian components
import ContactPage from './Contact/contactPage';

import GuardianHome from './Guardian/Guardian Home Page/guardianHome';
import SubmissionEdit from './Guardian/Submission Edit Page/SubmissionEdit';

import JudgeHome from './Judge/judgeHome';

const { Header, Content, Footer, Sider } = Layout;
const {Title} = Typography;

// This is the highest level component which contains all major frames as well as the router navigation system
// There is a high level Frame that outlets into all the main pages and then for any link that includes "user"
// where someone has signed in, it will load another frame that includes the layout for all user portals
// this looks like the navigation bar on the side with the footer below and the sub page as the main content

// Styles for the side navigation bar
const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

// These control the links that appear on the navigation bars for different kinds of users
// To add a new page section link to the navigation bar, 
// make a new key, add an icon, and put a full link to that page around the label
const adminLinks = [
    { key: '1', icon: <UnorderedListOutlined />,       
      label:(
        <Link to="/user/admin">
          Competitions
        </Link>
      ),
    },
    { key: '2', icon: <FileTextOutlined />,      
      label:(
        <Link to="/user/admin/rubric">
          Rubrics
        </Link>
      ),
    },
    { key: '3', icon: <LineChartOutlined />,  
      label: "Statistics"    
      // label: (
      //   // Not fully implemented, page does not work yet and will cause an error if loaded
      //   <Link to="/user/admin/charts">
      //     Statistics
      //   </Link>
      // ),
    },
    { key: '5', icon: <UserOutlined />, 
      label:(
        <Link to="/user/admin/user-management">
          Users
        </Link>
      ),
    }
];

const judgeLinks = [
  { key: '1', icon: <HomeOutlined />,       
    label:(
      <Link to="/user/judge">
        Home
      </Link>
    ),
  },
  { key: '2', icon: <MailOutlined />, 
    label:(
      <Link to="/user/judge/contact">
        Contact
      </Link>
    ),
  }
];

const guardianLinks = [
  { key: '1', icon: <HomeOutlined />,       
    label:(
      <Link to="/user/guardian">
        Home
      </Link>
    ),
  },
  { key: '2', icon: <MailOutlined />, 
    label:(
      <Link to="/user/guardian/contact">
        Contact
      </Link>
    ),
  }
];

// This gets the user type for the naviagation bar based on the current url
// It is important to do it this way and not by fetching the user authentication type
// because it is possible for the admin to view a judge page but the navigation bar should still
// show the links for the judge page not the admin
function getUserType(routerPath) {

  const path = routerPath.toLowerCase();
  let userType = "unknown";

  if(path.includes("/admin")){
    userType = "admin";
  } else if (path.includes("/judge")){
    userType = "judge";
  } else if (path.includes("/guardian")){
    userType = "guardian"
  }

  return userType;

}

// loads the specific navigation links based on the user type for that page
function getNavLinks(userType) {

  let links = [];

  if(userType === "admin"){
    links = adminLinks
  }else if (userType === "judge"){
    links = judgeLinks;
  }else if(userType === "guardian"){
    links = guardianLinks;
  }

  return links;

}

// controls moving to the signup portal
function RegisterAndLogout() {
  localStorage.clear()
  return <SignUp />
}


export default function App() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // or a loading screen
  
  return (

    // This section outlines the entire routing system for the app
    // based on the link, certain components and child components will be rendered
    // To add a page, include the link here. Each step in creates an add on to the url before it
    <ConfigProvider
    theme={GlobalStylesProvider()}
    >
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
            
          <Route path="/" element={<Frame />}>
            <Route index element={<WelcomePage />}/>
              <Route path="charts" element={<Chart/>}/>
              <Route path="sign-up" element={<RegisterAndLogout/>}/>
              <Route path="guardian-sign-up" element={<GuardianSignUp />}/>
              <Route path="judge-sign-up" element={<JudgeSignUp />}/>
              <Route path="logout" element={<ProtectedRoute permissions={"any"}><Logout/></ProtectedRoute>}/>
              <Route path="no-permission" element={<NoPermission/>}/>
              <Route path ="user" element={<UserFrame/>}>
                <Route path="admin">
                    <Route index element={<ProtectedRoute permissions={"admin"}><CompetitionManagement /></ProtectedRoute>} />
                    <Route path="competition-edit" element={<ProtectedRoute permissions={"admin"}><CompetitionEditor /></ProtectedRoute>}/>
                    <Route path="rubric" element={<ProtectedRoute permissions={"admin"}><AdminRubric /></ProtectedRoute>}>
                      <Route index element={<ProtectedRoute permissions={"admin"}><ViewRubric/></ProtectedRoute>} />
                      <Route path="edit" element={<ProtectedRoute permissions={"admin"}><EditRubric /></ProtectedRoute>} />
                      <Route path="preview" element={<ProtectedRoute permissions={"admin"}><PreviewRubric /></ProtectedRoute>} />
                    </Route>
                    <Route path="user-management" element={<ProtectedRoute permissions={"admin"}><UserManagement /></ProtectedRoute>}></Route>
                    <Route path="charts" element={<ProtectedRoute permissions={"admin"}><Chart /></ProtectedRoute>}></Route>
                </Route>
                <Route path="guardian">
                    <Route index element={<ProtectedRoute permissions={"guardian, admin"}><GuardianHome/></ProtectedRoute>} />
                    <Route path="submission" element={<ProtectedRoute permissions={"guardian, admin"}><SubmissionEdit/></ProtectedRoute>} />
                    <Route path="contact" element={<ProtectedRoute permissions={"gaurdian, admin"}><ContactPage /></ProtectedRoute>}></Route>
                </Route>
                <Route path="judge">
                    <Route index element={<ProtectedRoute permissions={"judge, admin"}><JudgeHome /></ProtectedRoute>} />
                    <Route path="contact" element={<ProtectedRoute permissions={"judge, admin"}><ContactPage /></ProtectedRoute>}></Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </ConfigProvider>
  );
}


// The highest level frame for the app that works no matter which page is selected
// This is needed since sign up or login pages take the whole frame whereas other pages
// like user portals depend on having a layout around them
function Frame() {
  return(
    <div>
      <Outlet />
    </div>
  );
}

// This frame is specifically for all user portals and has the navigation bar as well as the header and footer with logos and info
function UserFrame() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const path = useLocation().pathname;
  const userType = getUserType(path)
  const links = getNavLinks(userType);

  return (
      <Layout hasSider>
        <Sider style={siderStyle}>
          <div className="demo-logo-vertical" />
          <div style={{ paddingTop: '20px', paddingBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            <a href="https://hewittlearning.org" target="_blank" rel="noopener noreferrer">
              <img src={hewittlogo} alt="HewittLogo" height="50" />
            </a>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={links} /> 
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <Link to="/logout/">
              <Title level={4} style={{ color: 'white'}}>
                Log Out
              </Title>
            </Link>
          </div>
        </Sider>
        <Layout>
        <Header style={{ textAlign: 'left', backgroundColor: 'white', paddingTop: "15px", paddingBottom: "100px",}}>
        <a href="https://nationalinnovatorchallenge.org" target="_blank"><img src={niclogo} alt="NICLogo" height="80"/></a>
            
          </Header>

          <Content style={{ overflow: 'initial' }}>
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
            {/* Outlet is used to load child components based on the link extensions, in this case the specific user page */}
            <Outlet /> 
            </div>
          </Content>
    
          <Footer style={{ textAlign: 'center', backgroundColor: 'black', color: 'white'}}>
            Whitworth University ©{new Date().getFullYear()} Created by Team 5
          </Footer>
        </Layout>
      </Layout>
  );
}