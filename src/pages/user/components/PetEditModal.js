import { useState } from "react";
//packages
import i18n from "i18n-js";
import Compressor from "compressorjs";
import axios from "axios";
//components
import { Select, Input, Modal, Upload, message, Button, Row } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
//statics
import { API_BASE_URL } from "../../../configs/AppConfig";
import { useSelector, useDispatch } from "react-redux";
import { getPetList } from "../../../redux/actions";

const Avatar = ({ addPetInfo, setAddPetInfo }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(addPetInfo.petImage);

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
      <div style={{ marginTop: 8 }}>{i18n.t("Upload")}</div>
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

const PetCardModal = (props) => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const { Option } = Select;
  const language = window.localStorage.getItem("language");
  const { visible, setEditModal } = props;

  const [petInfo, setPetInfo] = useState({ ...props.petInfo });

  const serviceCategory = useSelector(
    (state) => state.serviceData.serviceCategory
  );

  // const petTypes = serviceCategory?.map((category, index) => {
  //   return {
  //     label: category.categoryName[language],
  //     value: index,
  //     key: index,
  //   };
  // });

  const handleDropDownSelector = (value, key) => {
    if (key === "petGender") {
      setPetInfo((state) => ({
        ...state,
        petGender: value,
      }));
    } else if (key === "isOperated") {
      setPetInfo((state) => ({
        ...state,
        isOperated: value === "no" ? "0" : "1",
      }));
    } else if (key === "petType") {
      setPetInfo((state) => ({
        ...state,
        petType: value,
      }));
    }
  };

  const handleInputChange = (value, key) => {
    setPetInfo((state) => ({
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
        setPetInfo((state) => ({
          ...state,
          petPortfolio: [...state.petPortfolio, res.data.data[0]],
        }));
      } else {
        message.error("Upload failed");
      }
    });
  };

  const handleSubmit = () => {
    const { petName, petGender, petType, petAge, isOperated, petWeight } =
      petInfo;
    if (
      !petName ||
      !petGender ||
      !petType ||
      !petAge ||
      !isOperated ||
      !petWeight
    ) {
      message.error(i18n.t("Please complete required infomation"));
    } else {
      // 编辑宠物卡
      axios
        .post(API_BASE_URL + "pet/changePet.php", petInfo, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            dispatch(getPetList(userId));
            setEditModal(false);
          } else {
            message.error(i18n.t("UpdatePetCardFail"));
          }
        })
        .catch((error) => {
          console.log(error);
          setEditModal(false);
        });
    }
  };

  const hanldeFileDelete = async (file) => {
    const result = await axios.post(
      `${API_BASE_URL}pet/fileModule.php?Content-Type=application/x-www-form-urlencoded`,
      [file]
    );
    if (result.data.message === "success") {
      message.success(i18n.t("File deleted"));
      setPetInfo({
        ...petInfo,
        petPortfolio: petInfo.petPortfolio.filter((doc) => doc !== file),
      });
    } else {
      message.error(i18n.t("File delete failed"));
    }
  };

  if (!serviceCategory) {
    return null;
  } else {
    return (
      <Modal
        width={860}
        closable={true}
        maskClosable={true}
        footer={null}
        visible={visible}
        onCancel={() => setEditModal(false)}
      >
        <div className="modal-pet-card">
          <div className="pet-card-inner">
            <div className="content margin-bottom-10">
              {/* 上传宠物图片 */}
              <div className="upload-photo-container">
                <span className="title margin-bottom-10">
                  {i18n.t("Upload pet image")}
                </span>
                <span className="subtitle margin-bottom-10">
                  {i18n.t("Please upload your lovely pet images")}
                </span>

                <div className="upload">
                  <Avatar setAddPetInfo={setPetInfo} addPetInfo={petInfo} />
                </div>
              </div>

              {/* empty space */}
              <div className="empty-space"></div>

              {/* 填写宠物信息 */}
              <div className="add-pet-info-container">
                <div className="title text-20 margin-bottom-10">
                  {i18n.t("Complete your pet information")}
                </div>

                <div
                  className="d-flex flex-column"
                  // className="two-col-input-container subtitle"
                >
                  {/* 左边 */}
                  <div
                    className="left-container"
                    // className="left-container padding-right-20"
                  >
                    {/* 宠物名字 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-10">
                        {i18n.t("Pet Name")}({i18n.t("require")})
                      </div>
                      <Input
                        onChange={(value) => {
                          handleInputChange(value, "petName");
                        }}
                        className="input-font text-16 text-input text-input--grey"
                        maxLength={8}
                        value={petInfo.petName}
                      />
                    </div>

                    {/* 宠物年龄 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-10">
                        {i18n.t("Pet Age")}({i18n.t("require")})
                      </div>
                      <Input
                        onChange={(value) => {
                          handleInputChange(value, "petAge");
                        }}
                        className="input-font text-input text-16 text-input--grey"
                        placeholder=""
                        maxLength={3}
                        value={petInfo.petAge}
                      />
                    </div>

                    {/* 宠物品种 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-10">
                        {i18n.t("Pet type")}({i18n.t("require")})
                      </div>
                      <Select
                        onChange={(name, key) => {
                          handleDropDownSelector(key.name, "petType");
                        }}
                        className="input-font text-16 input-box-padding w-100"
                        value={petInfo.petType && petInfo.petType[language]}
                      >
                        {serviceCategory.map((category, index) => {
                          return (
                            <Option
                              key={category.categoryId}
                              name={category.categoryName}
                              // value={category.categoryName[language]}
                            >
                              {category.categoryName[language]}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>

                  {/* 右边 */}
                  <div className="left-container">
                    {/* 性别 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-10">
                        {i18n.t("Gender")}({i18n.t("require")})
                      </div>
                      <Select
                        onChange={(value) => {
                          handleDropDownSelector(value, "petGender");
                        }}
                        className="input-font text-16 input-box-padding w-100"
                        value={
                          petInfo.petGender == 1
                            ? i18n.t("Male")
                            : i18n.t("Female")
                        }
                      >
                        <Option value="1" key="1">
                          {i18n.t("Male")}
                        </Option>
                        <Option value="0" key="0">
                          {i18n.t("Female")}
                        </Option>
                      </Select>
                    </div>

                    {/* 绝育 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-10">
                        {i18n.t("Neutered or spayed")}({i18n.t("require")})
                      </div>
                      <Select
                        onChange={(value) => {
                          handleDropDownSelector(value, "isOperated");
                        }}
                        className="input-font text-16 input-box-padding w-100"
                        value={
                          petInfo.isOperated && petInfo.isOperated == "1"
                            ? i18n.t("Yes")
                            : i18n.t("No")
                        }
                      >
                        <Option value="yes">{i18n.t("Yes")}</Option>
                        <Option value="no">{i18n.t("No")}</Option>
                      </Select>
                    </div>

                    {/* 宠物体重 */}
                    <div className="each-div margin-bottom-10">
                      <div className="margin-bottom-15">
                        {i18n.t("Pet Weight")}({i18n.t("require")})
                      </div>
                      <Input
                        onChange={(value) => {
                          handleInputChange(value, "petWeight");
                        }}
                        bordered={false}
                        className="input-font text-16 text-input text-input--grey"
                        maxLength={6}
                        value={petInfo.petWeight}
                        addonAfter={
                          <span className="border-0">{i18n.t("lb")}</span>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 简介 */}
                <div className="each-div subtitle text-16 margin-bottom-10">
                  <div className="margin-bottom-10">
                    {i18n.t("Description")}
                  </div>
                  <Input
                    onChange={(value) => {
                      handleInputChange(value, "petDescription");
                    }}
                    className="input-font text-16 text-input text-input--grey"
                    maxLength={30}
                    value={petInfo.petDescription}
                  />
                </div>

                {/* 健康信息 */}
                <div className="each-div subtitle text-20 margin-bottom-10">
                  <div className="margin-bottom-10">
                    {i18n.t("Health Info")}
                  </div>
                  {petInfo.petPortfolio?.length > 0 &&
                    petInfo.petPortfolio.map((file) => (
                      <Row
                        justify="space-between"
                        align="middle"
                        className="w-100 border border-1"
                      >
                        <span className="d-inline-block text-truncate">
                          <a href={file} target="_blank">
                            {file.split("/").slice(-1)[0]}
                          </a>
                        </span>

                        <DeleteOutlined
                          onClick={() => hanldeFileDelete(file)}
                        />
                      </Row>
                    ))}
                  <Upload action={handleFileUpload}>
                    <Button icon={<UploadOutlined />}>
                      {i18n.t("Upload")}
                    </Button>
                  </Upload>
                </div>
              </div>
            </div>

            <div className="footer">
              <Button
                onClick={() => setEditModal(false)}
                className="transparent-button font-size-16"
              >
                {i18n.t("Return")}
              </Button>

              <Button
                onClick={handleSubmit}
                className="primary-button font-size-16"
              >
                {i18n.t("Confirm")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
};

export default PetCardModal;
