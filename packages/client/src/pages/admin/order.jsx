import React from 'react';

import { OrderCointainer } from '../../Component/Admin/Order/OrderCointainer';
import AdminNavBar from '../../Component/Admin/adminNavbar/AdminNavBar';

const order = () => {
  return (
    <>
      <AdminNavBar />
      <OrderCointainer />
    </>
  );
};

export default order;
