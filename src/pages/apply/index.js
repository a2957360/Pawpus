import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//apply router
//条款隐私政策：/apply/method
const Apply = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/apply`} />
        <Route
          path={`${match.url}/apply`}
          component={lazy(() => import("./Terms"))}
        />
        <Route
          path={`${match.url}/applicant`}
          component={lazy(() => import("./Applicant"))}
        />
        <Route
          path={`${match.url}/basicinfomation`}
          component={lazy(() => import("./BasicInfo"))}
        />
        <Route
          path={`${match.url}/detail`}
          component={lazy(() => import("./Detail"))}
        />

        <Route
          path={`${match.url}/success`}
          component={lazy(() => import("./components/ApplySuccess"))}
        />
        <Route path="*" component={lazy(() => import("../other/NotFound"))} />
      </Switch>
    </Suspense>
  );
};

export default Apply;
