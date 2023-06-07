import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleCheck,
  faExclamationTriangle,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { MatchOrdersStatuses } from "../../api/contracts";

export function MatchOrders({ status }: { status?: MatchOrdersStatuses }) {
  const { t } = useTranslation();
  switch (status) {
    case MatchOrdersStatuses.NOT_SHOWED:
      return (
        <FontAwesomeIcon
          icon={faEyeSlash}
          className="text-muted"
          title={t("This player prefers not to show you his Individual Orders")}
        />
      );
    case MatchOrdersStatuses.NO_MANAGER_ORDERS:
      return (
        <FontAwesomeIcon
          icon={faCircle}
          title={t("No manager individual orders")}
        />
      );

    case MatchOrdersStatuses.NOT_SET:
      return (
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-danger"
          title={t("The player has other individual orders set")}
        />
      );
    case MatchOrdersStatuses.OK:
      return (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-success"
          title={t("ok")}
        />
      );
  }
  return <></>;
}
