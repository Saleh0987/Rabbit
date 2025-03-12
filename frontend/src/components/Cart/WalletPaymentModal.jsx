import { useState } from "react";

const WalletPaymentModal = ({ totalAmount, recipientNumber, userNumber, onClose }) => {
  const [senderNumber, setSenderNumber] = useState(userNumber);

  const handleConfirmPayment = () => {
    alert(`Payment confirmed from ${senderNumber} for ${totalAmount}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center">Wallet Payment</h2>
        <p className="mt-3">Total Amount: <span className="font-semibold">${totalAmount}</span></p>
        <p className="mt-2">Send Money To: <span className="font-semibold">{recipientNumber}</span></p>

        <label className="block mt-4 text-gray-700">Your Transfer Number:</label>
        <input
          type="text"
          value={senderNumber}
          onChange={(e) => setSenderNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mt-2"
          placeholder="Enter your transfer number"
        />

        <div className="flex justify-between mt-6">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}>
            Cancel
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleConfirmPayment}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentModal;
