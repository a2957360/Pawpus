import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import RouterLoading from '../../components/loading/RouterLoading';

//social router
//产品列表：/social/list
//产品详情：/social/detail
const Social = ({ match }) => {
	return (
		<Suspense fallback={<RouterLoading />}>
			<Switch>
				<Redirect exact from={`${match.url}`} to={`${match.url}/list`} />
				<Route path={`${match.url}/list`} component={lazy(() => import('./SocialList'))} />
				<Route path={`${match.url}/detail/:id`} component={lazy(() => import('./SocialDetail'))} />
				<Route path={`${match.url}/publish`} component={lazy(() => import('./PublishMoment'))} />
				<Route path="*" component={lazy(() => import('../../pages/other/NotFound'))} />
			</Switch>
		</Suspense>
	)
}

export default Social
