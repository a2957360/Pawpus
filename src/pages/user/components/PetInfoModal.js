import { Modal, Button } from "antd";

import i18n from "i18n-js";

const PetInfoModal = ({
  isPetInfoVisible,
  setIsPetInfoVisible,
  selectedPetCard,
}) => {
  const language = localStorage.getItem("language");

  if (selectedPetCard.length === 0) {
    return null;
  }

  return (
    <Modal
      width={860}
      closable={false}
      maskClosable={true}
      footer={null}
      visible={isPetInfoVisible}
      onCancel={() => setIsPetInfoVisible(false)}
    >
      <div className="petInfoModal-wrapper">
        <div className="inner-container margin-bottom-30">
          {/* pet image */}
          <div className="pet-image-container">
            <span className="title margin-bottom-10">
              {i18n.t("Pet Image")}
            </span>
            <img
              src={
                selectedPetCard.petImage &&
                selectedPetCard.petImage.length > 0 &&
                selectedPetCard.petImage
              }
              className="pet-image"
              alt=""
            />
          </div>

          {/* pet infomation */}
          <div className="pet-info-container subtitle">
            <span className="title margin-bottom-10">
              {i18n.t("Pet Information")}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Pet Name")}: {selectedPetCard.petName}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Gender")}:{" "}
              {selectedPetCard.petGender === "0"
                ? i18n.t("Female")
                : i18n.t("Male")}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Pet Age")}: {selectedPetCard.petName}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Neuter")}: {selectedPetCard.petAge}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Pet Type")}: {selectedPetCard.petType[language]}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Pet Weight")}: {selectedPetCard.petWeight}
            </span>
            <span className="margin-bottom-10">
              {i18n.t("Description")}: {selectedPetCard.petDescription}
            </span>
            <div>
              <span className="margin-right-10">{i18n.t("Health Info")}:</span>
              {selectedPetCard.petPortfolio &&
              selectedPetCard.petPortfolio.length > 0 ? (
                <a
                  href={selectedPetCard.petPortfolio[0]}
                  target="_blank"
                  className="subtitle"
                >
                  {i18n.t("Click here to see health information")}
                </a>
              ) : (
                i18n.t("No health information")
              )}
            </div>
          </div>
        </div>
        <div className="button-container">
          <Button
            onClick={() => setIsPetInfoVisible(false)}
            className="primary-button font-size-22"
          >
            {i18n.t("Confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PetInfoModal;
