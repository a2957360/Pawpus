import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />

//fixed height 72vh with loading spinner
const LoadingView = () => {
	return (
		<div className='loading-container fixed-height-wrapper text-center cover-content'>
			<Spin className='loading-spin' indicator={Icon} />
		</div>
	)
}

export default LoadingView;