import React, { useEffect, useState } from "react";

//packages
import {
  Breadcrumb,
  Row,
  Col,
  Checkbox,
  Button,
  InputNumber,
  message,
} from "antd";
import { useHistory } from "react-router-dom";

//components
import EmptyDataView from "../../components/loading/EmptyDataView";
import RouterLoading from "../../components/loading/RouterLoading";

//redux
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../redux/actions";
import { API_BASE_URL } from "../../configs/AppConfig";
import I18n from "i18n-js";

//components
const ShopList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userId = localStorage.getItem("userId");

  const { cartList } = useSelector((state) => state.productData);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    dispatch(getCart(userId));
  }, []);

  const handleSelectAllItems = (e) => {
    let temp = [];
    // 全选
    if (cartList.itemList.length > 0) {
      if (e.target.checked) {
        cartList.itemList.forEach((element) => {
          temp.push(element.itemId + "-" + element.itemOptionId);
        });
      }
      setSelectedItems(temp);
    } else {
      message.error(I18n.t("Your cart is empty"));
    }
  };

  const handleCheckProduct = (e, item) => {
    //如果选中的item在array里,找出index，从array中移除掉
    if (selectedItems.includes(item)) {
      const newItemArr = selectedItems.filter((e) => e !== item);
      setSelectedItems(newItemArr);
    }
    // 没有在选中的array里，直接添加
    else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleQuantityUpdate = async (value, itemId, itemOptionId) => {
    const data = {
      userId: userId,
      itemId: itemId,
      itemOptionId: itemOptionId,
      itemQuantity: value,
    };
    await axios
      .post(API_BASE_URL + `item/updateCart.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // 更改数量后重新获取购物车
        if (res.data.message === "success") {
          dispatch(getCart(userId));
        } else {
          message.error(I18n.t("Update quantity failed"));
        }
      })
      .catch((error) => {});
  };

  const handleDeleteItem = async (itemId, itemOptionId) => {
    const data = {
      userId: userId,
      itemId: itemId,
      itemOptionId: itemOptionId,
    };

    await axios
      .post(API_BASE_URL + `item/deleteCart.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // 删除后重新获取购物车
        if (res.data.message === "success") {
          dispatch(getCart(userId));
        } else {
          message.error(I18n.t("Delete failed"));
        }
      })
      .catch((error) => {});
  };

  const handleDeleteAllItems = async () => {
    if (selectedItems.length > 0) {
      for (let i = 0; i < selectedItems.length; i++) {
        const data = {
          userId: userId,
          itemId: selectedItems[i].split("-")[0],
          itemOptionId: selectedItems[i].split("-")[1],
        };
        const result = await axios.post(
          API_BASE_URL + `item/deleteCart.php`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        //如果是最后一个，重新获取购物车列表
        if (i === selectedItems.length - 1) {
          dispatch(getCart(userId));
        }
      }
    } else {
      message.error(I18n.t("Please select the product you want to remove"));
    }
  };

  const handleSaveItemFavorite = async (type, itemId) => {
    let tempTargetId = [];
    if (type === "all") {
      if (selectedItems.length > 0) {
        selectedItems.forEach((e) => {
          if (!tempTargetId.includes(e.split("-")[0])) {
            tempTargetId.push(e.split("-")[0]);
          }
        });
      } else {
        message.error(I18n.t("Please selecte the product you want to save"));
      }
    } else if (type === "single") {
      tempTargetId = [itemId];
    }

    const data = {
      userId: userId,
      targetId: tempTargetId,
    };

    await axios
      .post(API_BASE_URL + `item/saveItem.php`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          message.success("收藏商品成功");
        }
      });
  };

  if (!userId) {
    message.error(I18n.t("Please login"));
    history.push("/");
  }

  if (!cartList) {
    return <RouterLoading />;
  }

  const renderShopProducts = () => {
    return (
      <div className="shop-product-row-wrapper">
        {cartList.itemList.length > 0 ? (
          cartList.itemList.map((element, index) => {
            return (
              <Row key={index} className="each-row">
                {/* image */}
                <Col xs={8} sm={4} md={4} xl={4} className="text-center">
                  <div className="image-section cart-gutter">
                    <Checkbox
                      checked={selectedItems.some(
                        (i) => i === element.itemId + "-" + element.itemOptionId
                      )}
                      onChange={(e) =>
                        handleCheckProduct(
                          e,
                          element.itemId + "-" + element.itemOptionId
                        )
                      }
                      className="checkbox--primary pr-3"
                    />

                    <img
                      src={
                        element.itemImage &&
                        element.itemImage.length > 0 &&
                        element.itemImage[0]
                      }
                      alt="/"
                      className="product-image"
                    />
                  </div>
                </Col>

                {/* name */}
                <Col xs={16} sm={8} md={8} xl={8}>
                  <div className="product-content-container pl-5">
                    <div className="mb-2 product-name">{element.itemTitle}</div>

                    <div className="detail-name font-color-8c">
                      {element.itemOptionName}
                    </div>
                  </div>
                </Col>

                <Col xs={8} sm={0} md={0} xl={0}></Col>

                {/* single price */}
                <Col
                  xs={4}
                  sm={3}
                  md={3}
                  xl={3}
                  className="text-center price-font"
                >
                  <div className="center-item">
                    $
                    {Number(element.itemOptionSalePrice) !== 0 &&
                    Number(element.itemOptionSalePrice) <
                      Number(element.itemOptionPrice)
                      ? element.itemOptionSalePrice
                      : element.itemOptionPrice}
                  </div>
                </Col>

                {/* quantity */}
                <Col xs={4} sm={3} md={3} xl={3} className="text-center">
                  <div className="center-item">
                    <InputNumber
                      className="text-input text-input--grey"
                      min={1}
                      defaultValue={element.itemQuantity}
                      onBlur={(e) => {
                        if (e.target.value != element.itemQuantity) {
                          handleQuantityUpdate(
                            e.target.value,
                            element.itemId,
                            element.itemOptionId
                          );
                        }
                      }}
                    />
                  </div>
                </Col>

                {/* subtotal */}
                <Col
                  xs={4}
                  sm={3}
                  md={3}
                  xl={3}
                  className="text-center price-font"
                >
                  <div className="center-item">${element.subTotal}</div>
                </Col>

                {/* action */}
                <Col
                  xs={4}
                  sm={3}
                  md={3}
                  xl={3}
                  className="text-center font-size-14 font-color-8c"
                >
                  <div className="center-item flex-direction-col">
                    <div
                      onClick={() =>
                        handleSaveItemFavorite("single", element.itemId)
                      }
                      className="margin-bottom-10 span-mouse-click"
                    >
                      {I18n.t("save")}
                    </div>

                    <div
                      onClick={() =>
                        handleDeleteItem(element.itemId, element.itemOptionId)
                      }
                      className="span-mouse-click"
                    >
                      {I18n.t("Remove")}
                    </div>
                  </div>
                </Col>
              </Row>
            );
          })
        ) : (
          <EmptyDataView message={I18n.t("CartEmptyMessage")} />
          // EmptyPageMessages
        )}
      </div>
    );
  };

  return (
    <div className="shoplist-wrapper">
      <div className="responsive-container shoplist-inner-container">
        {/* header */}
        <div className="header-container ">
          <Row className="header-text">
            <Col xs={8} sm={4} md={4} xl={4} className="text-center ">
              <Breadcrumb className="test">
                <Breadcrumb.Item>
                  <span
                    onClick={() => history.push("/")}
                    className="header-text span-mouse-click"
                  >
                    {I18n.t("Home")}
                  </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span className="header-text ">{I18n.t("Cart")}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>

            <Col xs={0} sm={8} md={8} xl={8} className="pl-5">
              {I18n.t("Product Information")}
            </Col>

            <Col xs={0} sm={3} md={3} xl={3} className="text-center">
              {I18n.t("Single Price")}
            </Col>

            <Col xs={0} sm={3} md={3} xl={3} className="text-center">
              {I18n.t("Quantity")}
            </Col>

            <Col xs={0} sm={3} md={3} xl={3} className="text-center">
              {I18n.t("Subtotal")}
            </Col>

            <Col xs={0} sm={3} md={3} xl={3} className="text-center">
              {I18n.t("Other Actions")}
            </Col>
          </Row>
        </div>

        {/* list */}
        <div className="list-container">{renderShopProducts()}</div>

        {/* footer */}
        <div className="footer-container">
          <Row className="footer-font">
            <Col xs={12} sm={4} md={4} xl={4} className="padding-vertical-20">
              <Checkbox
                className="checkbox--primary cart-gutter pr-3"
                onChange={handleSelectAllItems}
              />

              <span>{I18n.t("Select All")}</span>
            </Col>

            <Col
              xs={12}
              sm={8}
              md={8}
              xl={11}
              className="padding-vertical-20 pl-5"
            >
              <div>
                <span
                  onClick={handleDeleteAllItems}
                  className="margin-right-10 span-mouse-click"
                >
                  {I18n.t("Remove")}
                </span>

                <span
                  onClick={() => handleSaveItemFavorite("all")}
                  className="ml-4  span-mouse-click"
                >
                  {I18n.t("save")}
                </span>
              </div>
            </Col>

            <Col
              xs={8}
              sm={4}
              md={4}
              xl={3}
              className="text-center padding-vertical-20"
            >
              {I18n.t("Selected Product")} {selectedItems.length}{" "}
              {I18n.t("item")}
            </Col>

            <Col
              xs={8}
              sm={4}
              md={4}
              xl={3}
              className="text-center padding-vertical-20"
            >
              {I18n.t("Subtotal")} ${cartList.subTotal}
            </Col>

            <Col
              xs={8}
              sm={4}
              md={4}
              xl={3}
              className="text-center d-flex justify-content-end"
            >
              <Button
                onClick={() => {
                  if (cartList.itemList.length === 0) {
                    message.error(I18n.t("Your cart is empty"));
                  } else {
                    history.push({
                      pathname: "/shop/detail",
                    });
                  }
                }}
                className="primary-button h-100"
              >
                {I18n.t("Buy")}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ShopList;
