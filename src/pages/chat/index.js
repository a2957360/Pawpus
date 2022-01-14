import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import RouterLoading from '../../components/loading/RouterLoading';

//chat router
const Chat = ({ match }) => {
	return (
		<Suspense fallback={<RouterLoading />}>
			<Switch>
				{/* <Redirect exact from={`${match.url}`} to={`${match.url}/list`} /> */}
                <Route path={`${match.url}`} component={lazy(() => import('./ChatRoom'))} />
				<Route path="*" component={lazy(() => import('../../pages/other/NotFound'))} />
			</Switch>
		</Suspense>
	)
}

export default Chat