
import { Link } from "react-router-dom";

const ServerError = () => (
  <div>
    <h1>500 - Internal Server Error</h1>
    <p>Opps! Something went wrong on our side.</p>
    <Link to="/">Go Home</Link>
  </div>
);

export default ServerError;
