import { useParams } from "react-router-dom";

export default function Show() {
  const { showId } = useParams();
  return <h2>Show ID: {showId}</h2>;
}