import { useTranslation } from "react-i18next";

export const useTranslatedLists = () => {
  const { t } = useTranslation();
  const statusList = [
    {
      name: "To Apply",
      status: "toApply",
    },
    {
      name: "Waiting for Response",
      status: "waitingforResponse",
    },
    {
      name: "Considering Offer",
      status: "consideringOffer",
    },
    {
      name: "Accepted",
      status: "accepted",
    },
    {
      name: "Finalized",
      status: "finalized",
    },
  ];

  const statusListString = [
    t("board.toApply"),
    t("board.waitingForResponse"),
    t("board.consideringOffer"),
    t("board.accepted"),
    t("board.finalized"),
  ];

  const internshipWindowViewsStrings = [
    t("internshipWindow.tabs.overview.title"),
    t("internshipWindow.tabs.AIFit.title"),
    t("internshipWindow.tabs.requirements.title"),
    t("internshipWindow.tabs.interview.title"),
    t("internshipWindow.tabs.evaluation.title"),
  ];

  const internshipWindowCriteria = [
    t("internshipWindow.tabs.evaluation.criteria.location"),
    t("internshipWindow.tabs.evaluation.criteria.supervisor"),
    t("internshipWindow.tabs.evaluation.criteria.prestige"),
    t("internshipWindow.tabs.evaluation.criteria.salary"),
    t("internshipWindow.tabs.evaluation.criteria.duration"),
  ];

  return {
    statusList,
    statusListString,
    internshipWindowViewsStrings,
    internshipWindowCriteria,
  };
};
