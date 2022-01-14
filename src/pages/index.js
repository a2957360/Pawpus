import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import RouterLoading from "../components/loading/RouterLoading";

const AppViews = () => (
  <Suspense fallback={<RouterLoading />}>
    <Switch>
      <Route path="/" component={lazy(() => import("./home"))} exact={true} />
      <Route path="/service" component={lazy(() => import("./service"))} />
      <Route path="/product" component={lazy(() => import("./product"))} />
      <Route path="/shop" component={lazy(() => import("./shop"))} />
      <Route path="/social" component={lazy(() => import("./social"))} />
      <Route path="/payment" component={lazy(() => import("./payment"))} />
      <Route path="/record" component={lazy(() => import("./record"))} />
      <Route path="/auth" component={lazy(() => import("./auth"))} />
      <Route path="/user" component={lazy(() => import("./user"))} />
      <Route path="/chat" component={lazy(() => import("./chat"))} />
      <Route path="/notifications" component={lazy(() => import("./notifications/notifications"))} />
      <Route path="/serviceapply" component={lazy(() => import("./apply"))} />
      <Route path="/favorite" component={lazy(() => import("./favorite"))} />
      <Route path="*" component={lazy(() => import("./other/NotFound"))} />
    </Switch>
  </Suspense>
);

export default AppViews;
