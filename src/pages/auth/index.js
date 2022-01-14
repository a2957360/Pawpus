import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import RouterLoading from '../../components/loading/RouterLoading';

//auth router
const Auth = ({ match }) => {
	return (
		<Suspense fallback={<RouterLoading />}>
			<Switch>
				<Redirect exact from={`${match.url}`} to={'/'} />
				<Route path={`${match.url}/reset-password`} component={lazy(() => import('./ResetPassword'))} />
				<Route path={`${match.url}/activate-account`} component={lazy(() => import('./ActivateAccount'))} />
				<Route path="*" component={lazy(() => import('../../pages/other/NotFound'))} />
			</Switch>
		</Suspense>
	)
}

export default Auth
