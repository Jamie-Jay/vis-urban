import React from 'react';
import Popup from 'reactjs-popup';
import './About.css'

export const About = () => (
  <Popup
    trigger={<button className="button" id='about-button'
      style={{color: 'white', background:'rgba(0,0,0,0)', border: 'none'}}
      > About Visualization </button>}
    modal
    nested
  >
    {close => (
      <div className="modal">
        <button className="close" onClick={close}>
          &times;
        </button>
        <div className="header"> About This Visualization </div>
        <div className="content">
          <p>
            This is a Visualization Application to visualize the New York City Bus Routes Positions.
            There are two modes. The first mode shows one hour worth of history bus routes data and extra aggregation information. 
            It requests data from an 
            <a href='https://api.buswatcher.org/docs' target="_blank" style={{color: 'black'}}
            > API Anthony povides</a>
            . The users are allowed to select what data to show - which hour and which bus routes. 
            It also provides filters and settings to formatting symbols and tokens showing on the map.
          </p>
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos? */}
          <p>
            This second mode shows 5 minutes loop of latest data from New York City MTA GTFS API. It acquires
            data every 5 seconds directly from an 
            <a href='https://vj9tinkr4k.execute-api.us-east-1.amazonaws.com/dev/ALL' target="_blank" style={{color: 'black'}}
            > API Hao develops </a>
            which gets latest data from New York City MTA GTFS vehicle position API and responses with data having trip update attribute. 
            This mode shows all bus positions and trips in New York city in the most recent 5 miuntes and also allow users to view aggregation information.
          </p>
          <p>This application is developed by 
            <a href='mailto:hg457@cornell.edu' target="_blank" style={{color: 'black'}}> Hao Geng </a> 
            and advised by 
            <a href='mailto:amt353@cornell.edu' target="_blank" style={{color: 'black'}}> Anthony Townsend</a>
            .
          </p>
          {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
          commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
          explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae? */}
        </div>
        <div className="actions">
          {/* <Popup
            trigger={<button className="button"> Trigger </button>}
            position="top center"
            nested
          >
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
              magni omnis delectus nemo, maxime molestiae dolorem numquam
              mollitia, voluptate ea, accusamus excepturi deleniti ratione
              sapiente! Laudantium, aperiam doloribus. Odit, aut.
            </span>
          </Popup> */}
          <button
            className="button"
            onClick={() => {
              // console.log('introduction modal closed ');
              close();
            }}
          >
            close
          </button>
        </div>
      </div>
    )}
  </Popup>
);