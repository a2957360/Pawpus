import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import RouterLoading from "../../components/loading/RouterLoading";

//Payment router
//支付方式：/payment/method
//支付结果：/payment/result
const Payment = ({ match }) => {
  return (
    <Suspense fallback={<RouterLoading />}>
      <Switch>
        <Redirect exact from={`${match.url}`} to={`${match.url}/method`} />
        <Route
          path={`${match.url}/method`}
          component={lazy(() => import("./PaymentMethod"))}
        />
        <Route
          path={`${match.url}/result`}
          component={lazy(() => import("./Result"))}
        />
        <Route
          path={`${match.url}/resultfail`}
          component={lazy(() => import("./ResultFail"))}
        />
        <Route path="*" component={lazy(() => import("../other/NotFound"))} />
      </Switch>
    </Suspense>
  );
};

export default Payment;
