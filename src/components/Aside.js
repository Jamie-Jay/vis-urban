import React, { useState, useSyncCallback } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  // SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

//import sidebar css from react-pro-sidebar module
import "react-pro-sidebar/dist/css/styles.css";
import "./Aside.css";

import {
  LayerControls, // create settings for our scatterplot layer
} from '../helper/controllers';
import { PANELS_TO_SHOW } from '../helper/settings'

import { About } from './About'

export const Aside = (props) => {
  const { setPanelVisibility,
    titleIndex = 0 } = props

    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(true)

    //create a custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = () => {
      //condition checking to change state from true to false and vice versa
      menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    const titleContent = ['Real Time Map', 'History Map']

    const [settings, setSettings] = useState(
      Object.keys(PANELS_TO_SHOW).reduce(
        (accu, key) => ({
          ...accu,
          [key]: PANELS_TO_SHOW[key].value
        }),
        {}
      )
    );

  return (
    <div >
    <ProSidebar 
      // image={image ? sidebarBg : false}
      // rtl={rtl}
      collapsed={menuCollapse}
      // toggled={toggled}
      breakPoint="md"
      // onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        {/* <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          sidebarTitle
        </div> */}
        <SidebarHeader className="mapOptions">
          <div className="logotext"
                style={{
                  padding: '24px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 14,
                  letterSpacing: '1px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? titleContent[titleIndex].split(' ')[0] : titleContent[titleIndex]}</p>
            </div>

            {/* links to switch between real time and history map */}
            <a href="real" style={{fontSize: 10, fontWeight: titleIndex===0 ? 'bold' : 'normal'}}>{titleContent[0]}</a>
            <br></br>
            <a href="../#" style={{fontSize: 10, fontWeight: titleIndex===1 ? 'bold' : 'normal'}}>{titleContent[1]}</a>

            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
            </div>
          </SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title="About" icon={<FaTachometerAlt />}>
            <About></About>
          </SubMenu>

          {/* <MenuItem icon={<FaGem />}> components</MenuItem> */}
          <SubMenu title="components" icon={<FaGem />}>
            {/* links to switch between real time and history map */}
            <MenuItem><a href="real">go to {titleContent[0]}</a></MenuItem>
            <MenuItem><a href="../#">go to {titleContent[1]}</a></MenuItem>

          </SubMenu>
        </Menu>

        <Menu iconShape="circle">
        <SubMenu title="What panel to show" icon={<FaList />}>
          <LayerControls
          title='What panel(s) to show'
          settings={settings}
          propCtrls={PANELS_TO_SHOW}
          onChange={(settingName, newValue) => {
            const changedSet = {...settings,
              [settingName]: newValue}
            setSettings(changedSet);
            setPanelVisibility(changedSet)
          }}
        />
        </SubMenu>
          {/*<SubMenu title="Data Source" icon={<FaList />}>              
             <MenuItem>{dateTime}</MenuItem>
            <MenuItem>{busRoutes}</MenuItem>
            <Menu iconShape="circle">
              <SubMenu title="Change Data Source" icon={<FaList />}>              
                  <MenuItem></MenuItem>
                  <MenuItem></MenuItem>
              </SubMenu>
            </Menu> 
          </SubMenu>
          <SubMenu
            suffix={<span className="badge yellow">3</span>}
            title='withSuffix'
            icon={<FaRegLaughWink />}
          >
            <MenuItem>submenu 1</MenuItem>
            <MenuItem>submenu 2</MenuItem>
            <MenuItem>submenu 3</MenuItem>
          </SubMenu>
          <SubMenu
            prefix={<span className="badge gray">3</span>}
            title='withPrefix'
            icon={<FaHeart />}
          >
            <MenuItem>submenu 1</MenuItem>
            <MenuItem>submenu 2</MenuItem>
            <MenuItem>submenu 3</MenuItem>
          </SubMenu>
          <SubMenu title='multiLevel' icon={<FaList />}>
            <MenuItem>submenu 1 </MenuItem>
            <MenuItem>submenu 2 </MenuItem>
            <SubMenu title={`$submenu 3`}>
              <MenuItem>submenu 3.1 </MenuItem>
              <MenuItem>submenu 3.2 </MenuItem>
              <SubMenu title={`$submenu 3.3`}>
                <MenuItem>submenu 3.3.1 </MenuItem>
                <MenuItem>submenu 3.3.2 </MenuItem>
                <MenuItem>submenu 3.3.3 </MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>*/}
        </Menu>
      </SidebarContent>

      {/* <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/azouaoui-med/react-pro-sidebar"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              viewSource
            </span>
          </a>
        </div>
      </SidebarFooter> */}
    </ProSidebar>
    </div>
  );
};