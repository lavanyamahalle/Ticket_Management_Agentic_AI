import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth(props) {
  // routes pass a prop named `protected` (e.g. <CheckAuth protected={true} />)
  // but the original component expected `protectedRoute`. Support both.
  const { children } = props;
  const protectedRoute = props.protectedRoute ?? props.protected ?? false;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (protectedRoute) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>loading...</div>;
  }
  return children;
}

export default CheckAuth;
