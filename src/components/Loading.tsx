import { Spinner } from "react-bootstrap";

export function Loading() {
  return (
    <div className="text-center">
      <Spinner className="my-3" />
    </div>
  );
}
