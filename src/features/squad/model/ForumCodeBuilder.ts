import { t } from "i18next";
import {
  MatchItemDTO,
  MatchOrdersStatuses,
  PositionTypeGeneralEnum
} from "../../../api/contracts";
import { SquadItem } from "../Squad.model";

class ForumCodeBuilder {
  build(props: {
    players: SquadItem[];
    minMorale: number;
    minFitness: number;
    minItems: number;
  }) {
    return this.head() + this.body(props);
  }
  head() {
    return `[b]${t("Name")} | ${t("Fitness")} | ${t("Morale")} | ${t(
      "Confidence"
    )} | ${t("Match orders")} | ${t("Items")}[/b]\n`;
  }

  body({
    players,
    minMorale,
    minFitness,
    minItems
  }: {
    players: SquadItem[];
    minMorale: number;
    minFitness: number;
    minItems: number;
  }) {
    return players
      .map((p) => {
        return [
          p.name,
          bold(
            (p.fitnessBeforeMatch ?? 100) < minFitness,
            p.fitnessBeforeMatch
          ),
          bold((p.morale ?? 100) < minMorale, p.morale),
          bold(p.confidenceProblem, p.confidence),
          matchOrders(p.matchOrders),
          items(p)
        ].join(" | ");
      })
      .join("\n");

    function items(p: SquadItem) {
      return !!p.userId
        ? [
            itemValue(p.items.shirt),
            itemValue(p.items.shoes),
            itemValue(
              p.items.gloves,
              p.positionId === PositionTypeGeneralEnum.GK
            )
          ].join(" ")
        : "";
    }
    function matchOrders(status: MatchOrdersStatuses | undefined): string {
      switch (status) {
        case MatchOrdersStatuses.NOT_SHOWED:
          return `[b]${t("Not showed")}[/b]`;
        case MatchOrdersStatuses.NOT_SET:
          return `[b]${t("Not set")}[/b]`;
        case MatchOrdersStatuses.OK:
          return t("ok");
      }
      return "";
    }

    function itemValue(item: MatchItemDTO | undefined, toCheck = true) {
      const value = item?.bonus ?? 0;

      return toCheck && value < minItems
        ? bold(true, valueText(value))
        : valueText(value);

      function valueText(value: number) {
        if (!value) return "";
        return `+${item?.bonus}`;
      }
    }

    function bold(condition: boolean, value: string | number = ""): string {
      return condition ? `[b]${value}[/b]` : String(value);
    }
  }
}
const forumCodeBuilder = new ForumCodeBuilder();

export default forumCodeBuilder;
