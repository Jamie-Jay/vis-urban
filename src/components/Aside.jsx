import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaList, FaGithub, FaRegMap, FaCodeBranch } from 'react-icons/fa';
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

//import sidebar css from react-pro-sidebar module
import "react-pro-sidebar/dist/css/styles.css";
import "./Aside.css";

import {
  LayerControls, // create settings for our scatterplot layer
} from '../helper/controllers';
import { MapStylePicker } from '../helper/controllers';
import { INIT_MAP_STYLE } from '../helper/constants';

import { About } from './About'

export const Aside = (props) => {
  const { setMeneItems, penelsToShow,
    titleIndex = 0 } = props

  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(true)

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
  };

  const titleContent = ['5 MIN LOOP Map', 'History Map']

  const [settings, setSettings] = useState(
    Object.keys(penelsToShow).reduce(
      (accu, key) => ({
        ...accu,
        [key]: penelsToShow[key].value
      }),
      {
        mapThemeStyle: INIT_MAP_STYLE
      }
    )
  );

  function handleItemChange (settingName, newValue) {
    const changedSet = {...settings,
      [settingName]: newValue}
    setSettings(changedSet);
    setMeneItems(changedSet)
  }

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
      {/* <SidebarHeader> */}
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
        <SidebarHeader>
          <div className="logotext"
                style={{
                  padding: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: 14,
                  letterSpacing: '1px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // whiteSpace: 'nowrap',
                  wordWrap: 'break-word',
                  // wordBreak: 'break-all' 
                }}
                >
              {/* small and big change using menucollapse state */}
              <p>{/*menuCollapse ? titleContent[titleIndex].split(' ')[0] : */titleContent[titleIndex]}</p>
            </div>

            {/* links to switch between real time and history map */}
            <div className="mapOptions">
              <a href="5MinLoop" 
                style={{
                  fontSize: 10, 
                  fontWeight: titleIndex===0 ? 'bold' : 'normal',
                }}>{titleContent[0]}</a>
              <br></br>
              <a href="../#" 
                style={{
                  fontSize: 10, 
                  fontWeight: titleIndex===1 ? 'bold' : 'normal'
                }}>{titleContent[1]}</a>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? (
                <FiArrowRightCircle/>
              ) : (
                <FiArrowLeftCircle/>
              )}
            </div>
          </SidebarHeader>
      {/* </SidebarHeader> */}

      <SidebarContent>
        <Menu iconShape="circle">
          {/* <MenuItem icon={<FaGem />}> components</MenuItem> */}
          <SubMenu title="Map Selector" icon={<FaCodeBranch />}>
            {/* links to switch between real time and history map */}
            <MenuItem><a href="5MinLoop">go to {titleContent[0]}</a></MenuItem>
            <MenuItem><a href="../#">go to {titleContent[1]}</a></MenuItem>
          </SubMenu>

          <SubMenu title="Toggle Controls" icon={<FaList />}>
            <LayerControls
              title='Toggle Controls'
              settings={settings}
              propCtrls={penelsToShow}
              onChange={handleItemChange}
            />
          </SubMenu>

          <SubMenu title="Change Theme" icon={<FaRegMap />}>
            Theme Picker
            <MapStylePicker 
              onStyleChange={(newStyle) => handleItemChange('mapThemeStyle', newStyle)}
              currentStyle={settings.mapThemeStyle}
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

        <Menu iconShape="circle">
          <SubMenu title="About" icon={<FaTachometerAlt />}>
            <About></About>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center' }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://github.com/Jamie-Jay/vis-urban/tree/master"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
            style={{textDecoration: 'none'}}
          >
            <FaGithub />
            {
              menuCollapse ? null :
              <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
              > View Source Code
              </span>
            }
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
    </div>
  );
};