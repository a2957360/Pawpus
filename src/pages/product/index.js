import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//product router
//产品列表：/product/list
//产品详情：/product/detail
const Product = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/list`} />
        <Route
          path={`${match.url}/list`}
          component={lazy(() => import("./ProductList"))}
        />

        <Route
          path={`${match.url}/detail/:id`}
          component={lazy(() => import("./ProductDetail"))}
        />
        <Route
          path="*"
          component={lazy(() => import("../../pages/other/NotFound"))}
        />
      </Switch>
    </Suspense>
  );
};

export default Product;
