import { Steps } from "antd";
import I18n from "i18n-js";

const { Step } = Steps;

const Process = ({ current, state }) => {
  const processList = [
    {
      id: 0,
      description: I18n.t("Applicant basic information"),
    },
    {
      id: 1,
      description: I18n.t("Service basic information"),
    },
    {
      id: 2,
      description: I18n.t("Service detail and time"),
    },
    {
      id: 3,
      description: I18n.t("Submit application"),
    },
  ];

  let title;

  return (
    <div className="process-wrapper">
      <Steps responsive progressDot current={current}>
        {processList.map((element, index) => {
          if (index < current) {
            title = I18n.t("Completed");
          } else {
            if (index === current) {
              title = I18n.t("In Progress");
            } else {
              title = I18n.t("Not Completed");
            }
          }
          return (
            <Step
              key={index}
              title={title}
              description={element.description}
              className="process-section-font"
            />
          );
        })}
      </Steps>
    </div>
  );
};

export default Process;
