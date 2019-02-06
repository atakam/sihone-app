import React from "react";

class Footer extends React.Component {
  render(){
    return (
      <div className="footer">
        &copy; {1900 + new Date().getYear()}{" "}
        Sihone | All rights reserved. Powered by <a href='https://sihone.com'>Sihone</a>.
      </div>
    )
  }
}
export default Footer;
