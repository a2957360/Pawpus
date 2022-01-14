import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//Record router
//服务记录列表/record/service/list
//服务记录详情/record/service/detail
const Record = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/service`} />
        <Route
          path={`${match.url}/service`}
          component={lazy(() => import("./RecordService"))}
        />
        <Route
          path={`${match.url}/servicedetail`}
          component={lazy(() => import("./RecordServiceDetail"))}
        />
        <Route
          path={`${match.url}/servicedetailcenter`}
          component={lazy(() => import("./CenterOrderManageDetail"))}
        />
        <Route
          path={`${match.url}/shop`}
          component={lazy(() => import("./RecordShop"))}
        />
        <Route
          path={`${match.url}/shopdetail`}
          component={lazy(() => import("./RecordShopDetail"))}
        />
        <Route path="*" component={lazy(() => import("../other/NotFound"))} />
      </Switch>
    </Suspense>
  );
};

export default Record;
