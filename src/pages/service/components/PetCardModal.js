import { useState } from "react";

import { Select, Input, Modal, Upload, message, Button, Row, Col } from "antd";

import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import Compressor from "compressorjs";
import axios from "axios";
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useSelector } from "react-redux";
import I18n from "i18n-js";

const Avatar = ({ addPetInfo, setAddPetInfo }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleImageChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const handleImageUpload = (file) => {
    new Compressor(file, {
      quality: 0.2,
      convertSize: 30000000,
      success(result) {
        const formData = new FormData();
        formData.append("uploadImages", result, result.name);
        formData.append("isUploadImage", "1");
        axios.post(`${API_BASE_URL}imageModule.php`, formData).then((res) => {
          if (res.data.message === "success") {
            setLoading(false);

            setImageUrl(res.data.data[0]);

            setAddPetInfo((state) => ({
              ...state,
              petImage: res.data.data[0],
            }));
          } else {
            console.log("Upload failed");
          }
        });
      },
      error(err) {
        message.error("Compress Failed");
        console.log("compress failed", err.message);
      },
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{I18n.t("Upload")}</div>
    </div>
  );

  return (
    <div className="test">
      <Upload
        style={{ width: "100%", height: "100%" }}
        accept="image/*"
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        maxCount={1}
        action={handleImageUpload}
        beforeUpload={beforeUpload}
        onChange={handleImageChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
  );
};

const PetCardModal = ({
  addPetInfo,
  setAddPetInfo,
  isAddPetModalVisible,
  setIsAddPetModalVisible,
  handleSubmitButton,
}) => {
  const { Option } = Select;
  const language = window.localStorage.getItem("language");

  const serviceCategory = useSelector(
    (state) => state.serviceData.serviceCategory
  );

  const handleDropDownSelector = (value, key) => {
    if (key === "petGender") {
      setAddPetInfo((state) => ({
        ...state,
        petGender: value === "male" ? "1" : "0",
      }));
    } else if (key === "isOperated") {
      setAddPetInfo((state) => ({
        ...state,
        isOperated: value === "no" ? "0" : "1",
      }));
    } else if (key === "petType") {
      setAddPetInfo((state) => ({
        ...state,
        petType: value,
      }));
    }
  };

  const handleInputChange = (value, key) => {
    setAddPetInfo((state) => ({
      ...state,
      [key]: value.target.value,
    }));
  };

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append("uploadImages", file, file.name);
    formData.append("isUploadImage", "1");
    axios.post(`${API_BASE_URL}/pet/fileModule.php`, formData).then((res) => {
      if (res.data.message === "success") {
        setAddPetInfo((state) => ({
          ...state,
          petPortfolio: [...state.petPortfolio, res.data.data[0]],
        }));
      } else {
        console.log("Upload failed");
      }
    });
  };

  return (
    <Modal
      width={860}
      closable={true}
      maskClosable={true}
      footer={null}
      visible={isAddPetModalVisible}
      onCancel={() => setIsAddPetModalVisible(false)}
    >
      <div className="modal-pet-card">
        <div className="pet-card-inner">
          <div className="content margin-bottom-10">
            {/* <Row className="w-100"> */}
            {/* 上传宠物图片 */}
            {/* <Col className="upload-photo-container" sm={12} xs={24}> */}
            <div className="upload-photo-container mr-3">
              <span className="title text-20 margin-bottom-10">
                {I18n.t("Upload pet image")}
              </span>
              <span className="subtitle text-16 margin-bottom-10">
                {I18n.t("Please upload your lovely pet images")}
              </span>

              <div className="upload">
                <Avatar setAddPetInfo={setAddPetInfo} addPetInfo={addPetInfo} />
              </div>
            </div>
            {/* </Col> */}

            {/* empty space */}
            <div className="empty-space"></div>

            {/* 填写宠物信息 */}
            {/* <Col className="add-pet-info-container" sm={12} xs={24}> */}
            <div className="add-pet-info-container">
              <div className="title text-20 margin-bottom-10">
                {I18n.t("Complete your pet information")}
              </div>

              <div
                className="d-flex flex-column"
                // className="two-col-input-container text-16 subtitle"
              >
                {/* 左边 */}
                <div
                  className="left-container "
                  // className="left-container padding-right-20"
                >
                  {/* 宠物名字 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10">
                      {I18n.t("Pet Name")}({I18n.t("require")})
                    </div>
                    <Input
                      onChange={(value) => {
                        handleInputChange(value, "petName");
                      }}
                      className="input-font text-16 text-input text-input--grey"
                      maxLength={15}
                    />
                  </div>

                  {/* 宠物年龄 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10">
                      {I18n.t("Pet Age")}({I18n.t("require")})
                    </div>
                    <Input
                      onChange={(value) => {
                        handleInputChange(value, "petAge");
                      }}
                      className="input-font text-input text-16 text-input--grey"
                      placeholder=""
                      maxLength={3}
                    />
                  </div>

                  {/* 宠物品种 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10">
                      {I18n.t("Pet type")}({I18n.t("require")})
                    </div>
                    <div className="w-100">
                      <Select
                        onChange={(name, key) => {
                          handleDropDownSelector(key.name, "petType");
                        }}
                        className="input-font text-16 input-box-padding w-100"
                      >
                        {serviceCategory.map((category) => {
                          return (
                            <Option
                              key={category.categoryId}
                              name={category.categoryName}
                            >
                              {category.categoryName[language]}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 右边 */}
                <div className="left-container">
                  {/* 性别 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10">
                      {I18n.t("Gender")}({I18n.t("require")})
                    </div>
                    <Select
                      onChange={(value) => {
                        handleDropDownSelector(value, "petGender");
                      }}
                      className="input-font text-16 input-box-padding w-100"
                    >
                      <Option value="male">{I18n.t("Male")}</Option>
                      <Option value="female">{I18n.t("Female")}</Option>
                    </Select>
                  </div>

                  {/* 绝育 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10 ">
                      {I18n.t("Neutered or spayed")}({I18n.t("require")})
                    </div>
                    <Select
                      onChange={(value) => {
                        handleDropDownSelector(value, "isOperated");
                      }}
                      className="input-font text-16 input-box-padding w-100"
                    >
                      <Option value="yes">{I18n.t("Yes")}</Option>
                      <Option value="no">{I18n.t("No")}</Option>
                    </Select>
                  </div>

                  {/* 宠物体重 */}
                  <div className="each-div margin-bottom-10">
                    <div className="margin-bottom-10">
                      {I18n.t("Pet Weight")}({I18n.t("require")})
                    </div>
                    <Input
                      onChange={(value) => {
                        handleInputChange(value, "petWeight");
                      }}
                      className="input-font text-16 text-input text-input--grey"
                      maxLength={6}
                      addonAfter={
                        <span className="border-0 ">{I18n.t("lb")}</span>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 简介 */}
              <div className="each-div subtitle  text-16  text-20 margin-bottom-10">
                <div className="margin-bottom-10">{I18n.t("Description")}</div>
                <Input
                  onChange={(value) => {
                    handleInputChange(value, "petDescription");
                  }}
                  className="input-font text-16 text-input text-input--grey"
                  maxLength={30}
                />
              </div>

              {/* 健康信息 */}
              <div className="each-div subtitle    text-20 margin-bottom-10">
                <div className="margin-bottom-10">{I18n.t("Health Info")}</div>
                <Upload action={handleFileUpload}>
                  <Button icon={<UploadOutlined />}>{I18n.t("Upload")}</Button>
                </Upload>
              </div>
            </div>
            {/* </Col> */}
            {/* </Row> */}
          </div>

          <div className="footer">
            <Button
              onClick={() => setIsAddPetModalVisible(false)}
              className="transparent-button font-size-16"
            >
              {I18n.t("Return")}
            </Button>

            <Button
              onClick={() => handleSubmitButton()}
              className="primary-button font-size-16"
            >
              {I18n.t("Confirm")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PetCardModal;

// {/* <div className="two-col-input-container subtitle">
// {/* 左边 */}
// <div className="left-container padding-right-20">
//   {/* 宠物名字 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">
//       {I18n.t("Pet Name")}({I18n.t("require")})
//     </div>
//     <Input
//       onChange={(value) => {
//         handleInputChange(value, "petName");
//       }}
//       className="input-font text-input text-input--grey"
//       maxLength={15}
//     />
//   </div>

//   {/* 宠物年龄 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">{I18n.t("Pet Age")}</div>
//     <Input
//       onChange={(value) => {
//         handleInputChange(value, "petAge");
//       }}
//       className="input-font text-input text-input--grey"
//       placeholder=""
//       maxLength={3}
//     />
//   </div>

//   {/* 宠物品种 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">
//       {I18n.t("Pet type")}({I18n.t("require")})
//     </div>
//     <Select
//       onChange={(name, key) => {
//         handleDropDownSelector(key.name, "petType");
//       }}
//       className="input-font input-box-padding"
//     >
//       {serviceCategory.map((category) => {
//         return (
//           <Option
//             key={category.categoryId}
//             name={category.categoryName}
//           >
//             {category.categoryName[language]}
//           </Option>
//         );
//       })}
//     </Select>
//   </div>
// </div>

// {/* 右边 */}
// <div className="left-container">
//   {/* 性别 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">
//       {I18n.t("Gender")}({I18n.t("require")})
//     </div>
//     <Select
//       onChange={(value) => {
//         handleDropDownSelector(value, "petGender");
//       }}
//       className="input-font input-box-padding"
//     >
//       <Option value="male">{I18n.t("Male")}</Option>
//       <Option value="female">{I18n.t("Female")}</Option>
//     </Select>
//   </div>

//   {/* 绝育 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">{I18n.t("Neuter")}</div>
//     <Select
//       onChange={(value) => {
//         handleDropDownSelector(value, "isOperated");
//       }}
//       className="input-font input-box-padding"
//     >
//       <Option value="yes">{I18n.t("Yes")}</Option>
//       <Option value="no">{I18n.t("No")}</Option>
//     </Select>
//   </div>

//   {/* 宠物体重 */}
//   <div className="each-div margin-bottom-10">
//     <div className="margin-bottom-10">
//       {I18n.t("Pet Weight")}
//     </div>
//     <Input
//       onChange={(value) => {
//         handleInputChange(value, "petWeight");
//       }}
//       className="input-font text-input text-input--grey"
//       maxLength={6}
//       addonAfter={
//         <span className="border-0">{I18n.t("lb")}</span>
//       }
//     />
//   </div>
// </div>
// </div> */}
