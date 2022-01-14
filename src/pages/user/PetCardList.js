import React, { useState, useEffect } from "react";
//package
import axios from "axios";
import i18n from "i18n-js";
import { useSelector, useDispatch } from "react-redux";
import { getUserReview, getPetList } from "../../redux/actions";
//components
import DisplayPetCard from "../record/components/DisplayPetCard";
import PetCardModal from "../service/components/PetCardModal";
import { Row, Col, Divider, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import LoadingView from "../../components/loading/LoadingView";
import Review from "../../components/review/Review";
//statics
import { API_BASE_URL, breakpointColumnsObj } from "../../configs/AppConfig";

const PetCardList = () => {
  const userId = localStorage.getItem("userId");
  const { userReviewList } = useSelector((state) => state.userData);
  const { petList } = useSelector((state) => state.serviceData);
  const dispatch = useDispatch();

  const [addPetInfo, setAddPetInfo] = useState({
    userId: userId,
    petName: null,
    petGender: null,
    petAge: null,
    isOperated: null,
    petType: null,
    petWeight: null,
    petDescription: null,
    petPortfolio: [],
    petImage: null,
    petVariety: null,
  });
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getUserReview(userId));
    dispatch(getPetList(userId));
  }, [userId]);

  const handleSubmitButton = () => {
    const { petName, petGender, petType, petAge, isOperated, petWeight } =
      addPetInfo;
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
      // 添加宠物卡
      axios
        .post(API_BASE_URL + "pet/addPet.php", addPetInfo, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            message.success(i18n.t("AddPetCardSuccess"));
          } else {
            message.error(i18n.t("AddPetCardFail"));
          }
          setIsAddPetModalVisible(false);
          dispatch(getPetList(userId));
        })
        .catch((error) => {
          console.log(error);
          setIsAddPetModalVisible(false);
        });
    }
  };

  if (!userReviewList || !petList) {
    return <LoadingView />;
  }

  const renderAverageStar = () => {
    const sumStar = userReviewList.reduce((sum, cur) => {
      return Number(cur.reviewStar) + sum;
    }, 0);

    return Number(sumStar / userReviewList.length).toFixed(1);
  };

  return (
    <>
      <div className="w-100 d-flex flex-wrap">
        {petList.map((petCard, index) => (
          <div key={index} className="mr-4">
            <DisplayPetCard data={petCard} editable />
          </div>
        ))}
        <div className="petcard-main-container">
          <div
            className="petcard-wrapper petcard-wrapper-blank text-center"
            onClick={() => setIsAddPetModalVisible(true)}
          >
            {i18n.t("Add new pet card")}
          </div>
        </div>
      </div>
      <Divider dashed />

      <div className="px-2 w-100 profile-review-wrapper">
        {userReviewList.length === 0 ? (
          <div className="w-50 m-auto text-center">
            <p className="text-18 color-grey-7">{i18n.t("No review")}</p>
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center">
              <div className="text-25 fw-bold mr-4">
                {i18n.t("Review received")}
              </div>
              <div className="d-flex align-items-center">
                <StarFilled className="color-primary" />
                <span className="ml-1 text-16 color-grey-7">
                  {renderAverageStar()}
                </span>
              </div>
            </div>

            <Row className="w-100 d-flex flex-wrap py-3">
              {/* <div className="w-100 d-flex flex-wrap py-3"> */}
              {userReviewList.map((review, index) => {
                const {
                  userName,
                  createTime,
                  reviewStar,
                  reviewContent,
                  userImage,
                } = review;

                return (
                  <Col key={index} span={24}>
                    <Review
                      name={userName}
                      time={createTime}
                      reviewStar={reviewStar}
                      content={reviewContent}
                      avatarUrl={userImage}
                    />
                  </Col>
                );

                // return (
                //   <Col key={index} span={12} className="single-review-wrapper">
                //     <Row className="w-100 ">
                //       <div className="review-avatar">
                //         <img
                //           src={review.userImage}
                //           alt="Pawpus"
                //           className="w-100 rounded-circle"
                //         />
                //       </div>
                //       <div>
                //         <p className="text-18 color-grey-7 fw-bold mb-1 ">
                //           {review.userName}
                //         </p>
                //         <p className="text-14 color-grey-7 mb-1">
                //           {`${i18n.t("Posted at")} ${review.createTime}`}
                //         </p>
                //       </div>
                //     </Row>
                //     <Row>
                //       <p className="mt-2 color-grey-7 text-16">
                //         {review.reviewContent}
                //       </p>
                //     </Row>
                //     <Row className="mb-5">
                //       <Ratings rate={review.reviewStar} />
                //     </Row>
                //   </Col>
                // );
              })}
            </Row>
          </>
        )}
        <PetCardModal
          addPetInfo={addPetInfo}
          setAddPetInfo={setAddPetInfo}
          isAddPetModalVisible={isAddPetModalVisible}
          setIsAddPetModalVisible={setIsAddPetModalVisible}
          handleSubmitButton={handleSubmitButton}
        />
      </div>
    </>
  );
};

export default PetCardList;
