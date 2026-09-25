import { useEvaluationCriteria } from "@/context/InternshipContext";

export const useNewInternship = () => {
  const { evaluationCriteria, setEvaluationCriteria } = useEvaluationCriteria();
  let evaluation = {};
  Object.entries(evaluationCriteria).map(([key, value]) => {
    evaluation = { ...evaluation, [key]: 1 };
  });
  return {
    company: "",
    role: "",
    category: "",
    status: "toApply",
    excerpt: "",
    type: "",
    location: "",
    salary: "",
    duration: 0,
    link: "",
    deadline: "",
    requirements: [],
    interview: {
      date: "",
      tips: "",
      notes: "",
    },
    evaluation: evaluation,
    marked: false,
    acceptedDate: null,
    AIFit: "",
    isPublic: false,
  };
};
