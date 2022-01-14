import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import RouterLoading from '../../components/loading/RouterLoading';

//shop router
//产品列表：/shop/list
//产品详情：/shop/detail
const Shop = ({ match }) => {
	return (
		<Suspense fallback={<RouterLoading />}>
			<Switch>
				<Redirect exact from={`${match.url}`} to={`${match.url}/list`} />
				<Route path={`${match.url}/list`} component={lazy(() => import('./ShopList'))} />
				<Route path={`${match.url}/detail`} component={lazy(() => import('./ShopDetail'))} />
				<Route path="*" component={lazy(() => import('../../pages/other/NotFound'))} />
			</Switch>
		</Suspense>
	)
}

export default Shop
