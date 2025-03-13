import React, { useState } from "react";

const CheckoutForm = ({
  user,
  shippingAddress,
  setShippingAddress,
  isValidEgyptianNumber
}) => {

   const [phoneError, setPhoneError] = useState("");

  const egyptianGovernorates = [
      "Cairo", "Alexandria", "Giza", "Dakahlia", "Red Sea", "Beheira", "Fayoum",
      "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya", "New Valley", "Suez",
      "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharkia", "South Sinai",
      "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"
    ];

  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value;
    setShippingAddress({ ...shippingAddress, phone: phoneNumber });

    if (!isValidEgyptianNumber(phoneNumber)) {
      setPhoneError("Please enter a valid Egyptian phone number.");
    } else {
      setPhoneError("");
    }
  };

  return (
    <>
      <h2 className="text-lg mb-4">Contact Details</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={user ? user.email : ""}
          className="w-full p-2 border border-gray-300 rounded"
          disabled
        />
      </div>
      
      <h3 className="text-lg mb-4">Delivery</h3>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={shippingAddress.firstName}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, firstName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={shippingAddress.lastName}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, lastName: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Address</label>
        <input
          type="text"
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

       <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">City</label>
          <select
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded bg-white"
            required
          >
            <option value="">Select a city</option>
            {egyptianGovernorates.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Postal Code</label>
          <input
            type="text"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Country</label>
        <input
          type="text"
          value={shippingAddress.country}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, country: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={shippingAddress.phone}
          onChange={handlePhoneChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
      </div>
    </>
  );
};

export default CheckoutForm;
