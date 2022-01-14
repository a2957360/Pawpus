import { Checkbox } from "antd";
import I18n from "i18n-js";
import NoImageDog from "../../../assets/img/empty-page-dogy.png";

const PetCard = ({ data, checkedList, handlePetCardSelector }) => {
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
    0: I18n.t("Female"),
    1: I18n.t("Male"),
  };

  return (
    <Checkbox
      value={data}
      checked={
        checkedList?.length > 0 && checkedList.includes(data.petId)
          ? true
          : false
      }
      onClick={() => handlePetCardSelector(data.petId)}
      className="d-flex align-items-center checkbox--primary"
    >
      <div className="petcard-main-container mb-3">
        <div className="petcard-wrapper petcard-wrapper-full mb-3">
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
              {isOperated === "0" ? I18n.t("Not Neuter") : I18n.t("Neutered")}
            </div>

            <div className="age-container">
              {`${petType[language]} ${I18n.t("Age")}: ${petAge} ${I18n.t(
                "weight"
              )}: ${petWeight}`}
            </div>
            <div className="hobby-container">{petDescription}</div>
          </div>
        </div>
        <div className="message-section">
          <span>
            {I18n.t("completeness")} {petPercentage}%
          </span>
          <span>
            {petPortfolio?.length === 0
              ? I18n.t("No health document uoloaded")
              : null}
          </span>
        </div>
      </div>
    </Checkbox>
  );
};

export default PetCard;
