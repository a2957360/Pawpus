import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//Favorite router

const Favorite = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        {/* <Redirect exact from={`${match.url}`} to={`${match.url}`} /> */}
        <Route path={`${match.url}`} component={lazy(() => import("./Main"))} />

        <Route path="*" component={lazy(() => import("../other/NotFound"))} />
      </Switch>
    </Suspense>
  );
};

export default Favorite;
