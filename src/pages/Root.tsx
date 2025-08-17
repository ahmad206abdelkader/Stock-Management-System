import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/shows/1">Show 1</Link>
        <Link to="/shows/2">Show 2</Link>
      </nav>
      <Outlet />
    </div>
  );
}
