import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleCheck,
  faExclamationTriangle,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MatchOrdersStatuses } from "../../api/contracts";

export function MatchOrders({ status }: { status?: MatchOrdersStatuses }) {
  switch (status) {
    case MatchOrdersStatuses.NOT_SHOWED:
      return (
        <FontAwesomeIcon
          icon={faEyeSlash}
          className="text-muted"
          title="This player prefers not to show you his Individual Orders"
        />
      );
    case MatchOrdersStatuses.NO_MANAGER_ORDERS:
      return (
        <FontAwesomeIcon icon={faCircle} title="No manager individual orders" />
      );

    case MatchOrdersStatuses.NOT_SET:
      return (
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-danger"
          title="The player has other individual orders set"
        />
      );
    case MatchOrdersStatuses.OK:
      return (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-success"
          title="It's ok"
        />
      );
  }
  return <></>;
}
