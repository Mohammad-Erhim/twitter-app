 
import { FC, useState } from "react";
import { createPortal } from "react-dom";
import {  useSelector } from "react-redux";
 
import PopUpLayout from "../layouts/PopUpLayout";
import {  RootState } from "../store";
import { User } from "../util/ts";
 
import HeaderForm from "./HeaderForm";

const ProfileHeader: FC<{ profile: User   }> = ({ profile }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [popUpHeaderForm, setPopUpHeaderForm] = useState(false);
 
  return (
    <div className="profile-header">
      <img
      alt="img"
        src={`/${profile.cover}`}
        className="profile-header__cover"
      ></img>
      <div className="profile-header__account">
        <img
        
          className="account-avatar"
          src={`/${profile.avatar}`}
          alt="img"
        ></img>
        <div className="account-name">
          <span className="account-name--primary">{profile?.name}</span>
          <span className="account-name--secondary">
            {profile?.name + "" + profile?._id.slice(0, 5)}
          </span>
        </div>
      </div>

      {profile._id === user?._id && (
        <button onClick={()=>setPopUpHeaderForm(true)} className="btn">Set up profile</button>
      )}
      {popUpHeaderForm &&
          createPortal(
            <div onClick={(e) => e.stopPropagation()}>
              <PopUpLayout
                close={() => {
                  setPopUpHeaderForm(false);
                }}
              >
                <HeaderForm
               
                  close={() => setPopUpHeaderForm(false)}
                />
              </PopUpLayout>
            </div>,
            document.getElementById("pop-up")!
          )}

    </div>
  );
};

export default ProfileHeader;
