import { FC } from "react";
import HNav from "../components/HNav";
import SearchInput from "../components/SearchInput";
import TrendCard from "../components/TrendCard";
import VNav from "../components/VNav";

const MainLayout: FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className="main-layout">
        <div className='main-layout__left'> <VNav/></div>
  
      <div className='main-layout__center'>
          <HNav/>
        <div>{props.children}</div>
      </div>
      <div className='main-layout__right'>
          <SearchInput/>
          <TrendCard/>
      </div>
    </div>
  );
};

export default MainLayout;
