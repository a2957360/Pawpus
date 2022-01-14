import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//user router
const User = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/profile`} />
        <Route
          path={`${match.url}/social`}
          component={lazy(() => import("./socalMain"))}
        />
        <Route
          path={`${match.url}/profile`}
          component={lazy(() => import("./profile"))}
        />
        <Route
          path={`${match.url}/address`}
          component={lazy(() => import("./address"))}
        />
        <Route
          exact
          path={`${match.url}/help`}
          component={lazy(() => import("./Help"))}
        />
        <Route
          path={`${match.url}/help/detail`}
          component={lazy(() => import("./components/HelpDetail"))}
        />
        <Route
          path={`${match.url}/userinfo/:id`}
          component={lazy(() => import("./User"))}
        />
        <Route path="*" component={lazy(() => import("../other/NotFound"))} />
      </Switch>
    </Suspense>
  );
};

export default User;
