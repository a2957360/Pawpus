import { Checkbox } from "antd";

import i18n from "i18n-js";
import NoImageDog from "../../../assets/img/empty-page-dogy.png";

const PetCard = ({ data, handlePetCardSelector, isCardDisable }) => {
  const {
    petImage,
    petName,
    petGender,
    isOperated,
    petAge,
    petType,
    petPortfolio,
    petDescription,
    petPercentage,
    petWeight,
  } = data;

  const language = localStorage.getItem("language");

  const petGenderList = {
    0: i18n.t("Female"),
    1: i18n.t("Male"),
  };

  return (
    <Checkbox
      value={data}
      disabled={isCardDisable}
      onClick={() => handlePetCardSelector(data)}
      className="d-flex align-items-center checkbox--primary mb-3"
    >
      <div className="petcard-main-container">
        <div className="petcard-wrapper petcard-wrapper-full margin-bottom-10">
          <div className="image-container">
            <img
              src={petImage ? petImage : NoImageDog}
              alt="/"
              className="image-size"
            />
          </div>
          <div className="content-container">
            <div className="name-container">
              {petName}({petGenderList[petGender]})
            </div>
            <div>
              {isOperated === "0" ? i18n.t("Not Neuter") : i18n.t("Neutered")}
            </div>
            <div className="age-container">
              {`${petType[language]} ${i18n.t("Age")}: ${petAge} ${i18n.t(
                "weight"
              )}: ${petWeight}`}
            </div>
            <div className="hobby-container">{petDescription}</div>
          </div>
        </div>
        <div className="message-section">
          <span>
            {i18n.t("completeness")} {petPercentage}%
          </span>
          <span>
            {petPortfolio?.length === 0
              ? i18n.t("No health document uoloaded")
              : null}
          </span>
        </div>
      </div>
    </Checkbox>
  );
};

export default PetCard;
