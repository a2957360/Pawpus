import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//service router
//产品列表：/service/list
//产品详情：/service/detail

const Service = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/list`} />
        <Route
          path={`${match.url}/list`}
          component={lazy(() => import("./ServiceList"))}
        />
        <Route
          path={`${match.url}/detail/:id`}
          component={lazy(() => import("./ServiceDetail"))}
        />
        <Route
          path={`${match.url}/order`}
          component={lazy(() => import("./ServiceOrder"))}
        />
        <Route
          path={`${match.url}/center`}
          component={lazy(() => import("./ServiceCenter"))}
        />
        <Route
          path={`${match.url}/centercarddetail`}
          component={lazy(() => import("./CenterCardDetail"))}
        />
        <Route
          path={`${match.url}/datemodify`}
          component={lazy(() => import("./BlockDateModify"))}
        />
        <Route
          path="*"
          component={lazy(() => import("../../pages/other/NotFound"))}
        />
      </Switch>
    </Suspense>
  );
};

export default Service;
