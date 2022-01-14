import React, { useEffect } from "react";

//component
import Loading from "../../components/loading/LoadingView";
import { Layout } from "antd";
import ServiceSearch from "../../components/layout/ServiceSearch";
import HomeFeatures from "../../components/layout/HomeFeatures";
import HomeBanner from "../../components/layout/HomeBanner";
import HomeFeatureService from "../../components/layout/HomeFeatureService";
import HomeFeatureProduct from "../../components/layout/HomeFeatureProduct";

//redux
import { useSelector, useDispatch } from "react-redux";
import { getHomeData } from "../../redux/actions/home";
import {
  getServiceCategory,
  getServiceLocationList,
} from "../../redux/actions/service";

export default function Home() {
  const { homePageMessage, homePageData } = useSelector(
    (state) => state.homeData
  );
  const { serviceLocation, serviceCategory } = useSelector(
    (state) => state.serviceData
  );

  const dispatch = useDispatch();

  const layoutCodeList = (data) => {
    const { pageCode, componentContent } = data;

    const homeLayoutCodeList = {
      101: <ServiceSearch componentContent={componentContent} />,
      102: <HomeFeatures componentContent={componentContent} />,
      103: <HomeBanner componentContent={componentContent} />,
      104: <HomeFeatureService componentContent={componentContent} />,
      105: <HomeFeatureProduct componentContent={componentContent} />,
    };

    return homeLayoutCodeList[pageCode];
  };

  useEffect(() => {
    dispatch(getHomeData());
    dispatch(getServiceCategory());
    dispatch(getServiceLocationList());
  }, [dispatch]);

  if (
    homePageMessage !== "success" ||
    !homePageData ||
    !serviceLocation ||
    !serviceCategory
  ) {
    return <Loading />;
  } else {
    return (
      <Layout>
        <Layout.Content>
          {homePageData.map((item, index) => {
            return (
              <div key={index} className="w-100 color-page-background">
                {layoutCodeList(item)}
              </div>
            );
          })}
        </Layout.Content>
      </Layout>
    );
  }
}
