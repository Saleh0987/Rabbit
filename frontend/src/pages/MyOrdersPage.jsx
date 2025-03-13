import { useEffect, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { BiLoaderAlt } from "react-icons/bi";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const fetchOrders = useCallback(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <BiLoaderAlt className="animate-spin text-[100px] text-blue-900" />
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500 text-center">{error.message}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">

        My Orders
      </h2>

      <div className="relative shadow-md sm:rounded-lg overflow-hidden bg-white">
        <div className="block sm:hidden">
          {/* Mobile View */}
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 p-4 mb-4 rounded-md bg-white shadow-sm cursor-pointer"
                onClick={() => handleRowClick(order._id)}>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order ID: #{order._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm mb-1 text-gray-500">
                  Shipping to:{" "}
                  {order.shippingAddress
                    ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                    : "N/A"}
                </p>
                <p className="text-sm mb-1 text-gray-500">
                  Total Items: {order.orderItems.length}
                </p>
                <p className="text-sm mb-2 text-gray-500">
                  Total Price: LE {order.totalPrice}

                </p>
                <p
                  className={`text-sm font-medium px-2 py-1 inline-block rounded-full ${
                    order.isDelivered
                      ? "bg-blue-300 text-black"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.isDelivered ? "Approved" : "unPaid"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">You have no orders</p>
          )}
        </div>

        <table className="hidden sm:table min-w-full text-left text-gray-500">
          {/* Desktop View */}
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    LE {order.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span className={`${
                      order.isDelivered
                        ? "bg-blue-300 text-black"
                        : "bg-red-100 text-red-700"
                    } px-2 py-1 rounded-full text-xs font-medium`}>

                      {order.isDelivered ? "Approved" : "unPaid"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
