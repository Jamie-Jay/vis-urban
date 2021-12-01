import React from 'react';
import Popup from 'reactjs-popup';
import './About.css'

export const About = () => (
  <Popup
    trigger={<button className="button" 
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
          {' '}
          This is the paragraph 1 of introduction
          {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
          Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
          delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos? */}
          <br />
          This is the paragraph 2 of introduction
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
              console.log('introduction modal closed ');
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