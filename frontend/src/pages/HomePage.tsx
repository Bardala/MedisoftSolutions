import { FC } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { HomePageProps } from "../types";
import { useHomePage } from "../hooks/useHomePage";

const HomePage: FC<HomePageProps> = ({ loggedInUser }) => {
  const { setSelectedOption, renderContent } = useHomePage(loggedInUser);
  return (
    <div>
      {loggedInUser && (
        <Header
          loggedInUser={loggedInUser}
          setSelectedOption={setSelectedOption}
        />
      )}

      {loggedInUser && (
        <Sidebar
          loggedInUser={loggedInUser}
          setSelectedOption={setSelectedOption}
        />
      )}

      <div className="home-page-container">
        <div className="dashboard">
          <div className="home-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
