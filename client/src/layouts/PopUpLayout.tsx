import { FC } from "react";
 
const PopUpLayout: FC<{ children: React.ReactNode ,close:any}> = (props) => {
  return (
    
    <div className="popup">
    <div className="popup__content">
        <div className="popup__nav">
            <button onClick={props.close} className="icon-with-cycle">

                <svg viewBox="0 0 24 24" aria-hidden="true"
                    className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03">
                    <g>
                        <path
                            d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z">
                        </path>
                    </g>
                </svg>
            </button>

 
        </div>
        {props.children}
    </div>
</div> 
  );
};

export default PopUpLayout;
