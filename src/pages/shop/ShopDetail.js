import React, { useEffect, useState } from "react";
//import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

//components
import RouterLoading from "../../components/loading/RouterLoading";
import Order from "./component/Order";
import SubmitOrder from "./component/SubmitOrder";
import { message } from "antd";

//packages
import { Row, Col } from "antd";

//redux
import axios from "axios";
import { API_BASE_URL } from "../../configs/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddress, getCart, getPostByType } from "../../redux/actions";
import I18n from "i18n-js";

//components
const ShopDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  const { userAddress, postListByType } = useSelector(
    (state) => state.userData
  );
  const { cartList } = useSelector((state) => state.productData);

  const [inputAddress, setInputAddress] = useState({
    unit: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    name: "",
    phone: "",
  });

  const [addressText, setAddressText] = useState({
    unit: "",
    address: "",
    city: "",
    province: "",
    postal: "",
    name: "",
    phone: "",
  });
  const [selectedAdressId, setSelectedAddressId] = useState();
  const [selectedDeliverMethod, setSelectedDeliverMethod] = useState();
  const [deliverList, setDeliverList] = useState();
  const [itemOrderComment, setItemOrderComment] = useState();
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    dispatch(getCart(userId));
    dispatch(getUserAddress(userId));
    dispatch(getPostByType("3"));
  }, []);

  useEffect(() => {
    if (userAddress && cartList && firstTime) {
      // console.log("here cartList", cartList);
      const defaultAddress = userAddress.filter((e) => e.isDefault === "1");

      if (userAddress.length > 0) {
        const addressArr =
          defaultAddress.length > 0 ? defaultAddress[0] : userAddress[0];

        setFirstTime(false);
        setAddressText({
          address: addressArr?.address,
          unit: addressArr?.unit,
          city: addressArr?.city,
          province: addressArr?.province,
          postal: addressArr?.postal,
          name: addressArr?.name,
          phone: addressArr?.phone,
        });
        setSelectedAddressId(addressArr.addressId);
        //获取配送方式
        const data = {
          deliverPostal: addressArr.postal,
          subTotal: cartList.subTotal,
        };
        console.log("get deliver lsit input", data);
        axios
          .post(API_BASE_URL + `item/getDeliverList.php`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            console.log("get deliver list result", res.data);
            if (res.data.message === "success") {
              if (res.data.data.length > 0) {
                setSelectedDeliverMethod(res.data.data[0]);
                setDeliverList(res.data.data);
                //调商品选择配送方式api
                const selectDeliverInputData = {
                  userId: userId,
                  deliverId: res.data.data[0].deliverId,
                };
                // console.log("select deliver input", selectDeliverInputData);
                axios
                  .post(
                    API_BASE_URL + `item/selectDeliver.php`,
                    selectDeliverInputData,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((res) => {
                    // console.log("select deliver result", res.data);
                    if (res.data.message === "success") {
                      //重新获取cart
                      console.log("select deliver finished, get cart again");
                      dispatch(getCart(userId));
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                // setSelectedDeliverMethod(res.data.data[0]);
                setDeliverList([]);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setDeliverList([]);
      }
    }
  }, [userAddress, cartList]);

  const handleSubmitOrder = async () => {
    const { unit, address, city, province, postal, name, phone } = addressText;
    if (
      !unit ||
      !address ||
      !city ||
      !province ||
      !postal ||
      !name ||
      !phone ||
      !selectedDeliverMethod
    ) {
      message.error(I18n.t("Please complete the information"));
    } else {
      const data = {
        userId: userId,
        cartId: cartList?.cartId,
        address: addressText,
        deliverId: selectedDeliverMethod.deliverId,
        itemOrderComment: itemOrderComment,
      };

      await axios
        .post(API_BASE_URL + `item/addItemOrder.php`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          // console.log("make order result", res.data);
          if (res.data.message === "success") {
            // message.success("下单成功，去支付页面");
            history.push({
              pathname: "/payment/method",
              state: { ...cartList, ...res.data.data },
              productPaymentFlag: true,
            });
          } else {
            message.error(I18n.t("Make order failed, please try again later"));
          }
        })
        .catch((error) => {});
    }
  };

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (!cartList || !userAddress || !postListByType || !deliverList) {
    return <RouterLoading />;
  }

  return (
    <div className="shop-detail-wrapper">
      <div className="shop-detail-inner-container responsive-container">
        {/* 收货地址 商品信息  */}
        <Row className="w-100">
          <Col
            xs={24}
            sm={24}
            md={15}
            xl={15}
            className="delivery-product-info-container"
          >
            <Order
              addressText={addressText}
              setAddressText={setAddressText}
              setNote={setItemOrderComment}
              inputAddress={inputAddress}
              setInputAddress={setInputAddress}
              selectedAdressId={selectedAdressId}
              setSelectedAddressId={setSelectedAddressId}
              selectedDeliverMethod={selectedDeliverMethod}
              setSelectedDeliverMethod={setSelectedDeliverMethod}
              deliverList={deliverList}
            />
          </Col>

          {/* 中间间隙 */}
          <Col xs={0} sm={0} md={1} xl={1}></Col>

          {/* 提交订单 */}
          <Col
            xs={24}
            sm={24}
            md={8}
            xl={8}
            className="submit-order-container mb-4"
          >
            <SubmitOrder handleSubmitOrder={handleSubmitOrder} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShopDetail;
