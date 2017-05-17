import React, {Component} from 'react';

export default function (props) {
  return (
    <div id="main" className="container-fluid">
      <div className="col-xs-2">
        <SidebarContainer />
      </div>
      <div className="col-xs-10">
        {
          props.children && React.cloneElement(props.children, props)
        }
      </div>
      <PlayerContainer />
    </div>
  );
}
