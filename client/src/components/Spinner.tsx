import { FC } from "react";

const Spinner:  FC<{loading:boolean}>= ({loading}) => {
  return (
<div className="loader-container" style={{opacity:loading?'1':'0'}}>
        <div className="loader"></div>
    </div>
    );
};

export default Spinner;
