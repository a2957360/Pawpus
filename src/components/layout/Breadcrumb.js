import React from "react";
import { Breadcrumb } from "antd";

const BreadCrumb = (props) => {
  const { breadcrumbList } = props;

  return (
    <Breadcrumb className="w-100 bg-white border-radius-6 pl-4 mt-3 mb-3">
      {breadcrumbList.map((breadcrumb, index) =>
        breadcrumb.url !== "" ? (
          <Breadcrumb.Item key={index} href={breadcrumb.url}>
            <span className="breadcrumb-title">{breadcrumb.title}</span>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={index}>
            <span className="text-bold breadcrumb-title">
              {breadcrumb.title}
            </span>
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  );
};

export default BreadCrumb;
