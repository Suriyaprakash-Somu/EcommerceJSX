import React from "react";
import { Link } from "@tanstack/react-router";
const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <Link to={"/departments"}> Manage Department</Link>
      <Link to={"/roles"}> Manage Role</Link>
      <Link to={"/category"}> Manage Category</Link>
      <Link to={"/units"}> Manage Units</Link>
      <Link to={"/attributes"}> Manage Attributes</Link>
      <Link to={"/attribute-values"}> Manage Attribute Values</Link>
      <Link to={"/category-attribute-value"}>
        {" "}
        Manage Category Attribute Values
      </Link>
    </div>
  );
};

export default LandingPage;
