import { useIntl } from "react-intl";
import "@styles/home.css";
import { DashboardSummary } from "./DashboardSummary";

const Home = () => {
  const { formatMessage: f } = useIntl();

  return (
    <div className="home">
      <h1>{f({ id: "welcome_dashboard" })}</h1>
      <p>{f({ id: "select_option" })}</p>
      <DashboardSummary />
    </div>
  );
};

export default Home;
