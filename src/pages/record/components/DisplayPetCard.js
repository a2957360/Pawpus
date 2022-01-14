// import { Checkbox } from "antd";
import React, { useState } from "react";
//packages
import i18n from "i18n-js";
import { useDispatch } from "react-redux";
import axios from "axios";
//components
import { Modal, Row, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PetEditModal from "../../user/components/PetEditModal";
//statics
import NoImageDog from "../../../assets/img/empty-page-dogy.png";
import noAvatar from "../../../assets/img/Success-Dogy.png";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { getPetList } from "../../../redux/actions";

const DisplayPetCard = ({ data, editable, showMessage }) => {
  const {
    petId: id,
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

  const userId = localStorage.getItem("userId");
  const language = localStorage.getItem("language");
  const dispatch = useDispatch();

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const petGenderList = {
    0: i18n.t("Female"),
    1: i18n.t("Male"),
  };

  const handlePetCardDelete = async () => {
    const toDelete = {
      userId,
      petId: id,
    };
    const { data } = await axios.post(
      `${API_BASE_URL}pet/deletePet.php`,
      toDelete
    );

    if (data.message === "success") {
      message.success(i18n.t("Pet card deleted"));
      setDeleteModal(false);
      dispatch(getPetList(userId));
    } else {
      message.error(i18n.t("111"));
    }
  };

  return (
    // <Checkbox
    //   value={data}
    //   disabled={isCardDisable}
    //   onClick={() => handlePetCardSelector(data)}
    //   className="pet-card-checkbox-container margin-bottom-30"
    // >
    <div className="petcard-main-container  margin-bottom-30">
      <div className="petcard-wrapper petcard-wrapper-full margin-bottom-10 position">
        {editable && (
          <div className="petcard-edit-container">
            <EditOutlined onClick={() => setEditModal(true)} />
            <DeleteOutlined onClick={() => setDeleteModal(true)} />
          </div>
        )}

        <div className="image-container">
          <img
            src={petImage ? petImage : NoImageDog}
            alt="pet-image"
            className="image-size"
          />
        </div>
        <div className="content-container ">
          <div className="text-14 name-container ">
            {petName}({petGenderList[petGender]}){" "}
            {isOperated === "0" ? i18n.t("Not Neuter") : i18n.t("Neutered")}
          </div>
          {/* <div className="name-container text-14">
            {isOperated === "0" ? i18n.t("Not Neuter") : i18n.t("Neutered")}
          </div> */}

          <div className="age-container">
            {`${data.petType && data.petType[language]} ${i18n.t(
              "Age"
            )}: ${petAge} ${i18n.t("weight")}: ${petWeight}`}
          </div>
          <div className="hobby-container">{petDescription}</div>
        </div>
      </div>
      {showMessage && (
        <div className="message-section">
          {petPortfolio && petPortfolio?.length > 0 ? (
            <a
              href={petPortfolio[0]}
              target="_blank"
              className="portfolio-message"
            >
              {i18n.t("Click here to see health information")}
            </a>
          ) : (
            <>
              <span>{`${i18n.t("completeness")} ${petPercentage}%`}</span>
              <span>({i18n.t("No health document uoloaded")})</span>
            </>
          )}
        </div>
      )}

      <PetEditModal
        petInfo={{ ...data, userId }}
        visible={editModal}
        setEditModal={setEditModal}
      />

      <Modal
        visible={deleteModal}
        footer={null}
        closable={false}
        maskClosable={true}
        onCancel={() => setDeleteModal(false)}
        width={500}
        bodyStyle={{
          borderRadius: "8px",
        }}
      >
        <div className="w-100">
          <div className="w-40 m-auto text-center">
            <img src={noAvatar} alt="Pawpus" className="w-100 m-auto" />
            <p className="text-20 color-grey-servicePrice mb-1">
              {i18n.t("Attention")}
            </p>
            <p className="text-14 color-grey-servicePrice mb-1">
              {i18n.t("Confirm deletion")}
            </p>
          </div>
          <Row
            justify="space-between"
            align="middle"
            className="w-80 m-auto py-3"
          >
            <Button
              type="text"
              className="text-normal text-20"
              onClick={() => setDeleteModal(false)}
            >
              {i18n.t("Cancel")}
            </Button>
            <Button
              className="text-normal text-22 color-button-title loadmore-button w-30"
              onClick={() => handlePetCardDelete()}
            >
              {i18n.t("Confirm")}
            </Button>
          </Row>
        </div>
      </Modal>
    </div>
    // </Checkbox>
  );
};

export default DisplayPetCard;
