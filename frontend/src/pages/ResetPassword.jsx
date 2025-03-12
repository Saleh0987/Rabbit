import { useState } from "react";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; 
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import emailjs from 'emailjs-com'; 
import { useFormik } from 'formik';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false); 
  const [otpDigits, setOtpDigits] = useState(Array(6).fill('')); 
  const [otpValid, setOtpValid] = useState(null); 
  const [verifyingOtp, setVerifyingOtp] = useState(false); 
  const [secretNumber, setSecretNumber] = useState(''); 
 const navigate = useNavigate();
   const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });
 const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
 
     if (otpSent) {
    const enteredOtp = otpDigits.join('');
    if (enteredOtp === secretNumber.toString()) {
      setOtpValid(true);
      setVerifyingOtp(true);
      setMessage('OTP verified successfully!');

      setTimeout(() => {
        setVerifyingOtp(false);
        navigate('/new-password', { state: { email: formik.values.email } });
      }, 3000);
    } else {
      setOtpValid(false);
      setMessage('Invalid OTP. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  } else {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

     const result = await response.json();
      if (result.message ===  'Email found.') {
        const secretCode = (Math.floor(100000 + Math.random() * 900000)).toString();
        setSecretNumber(secretCode);
        localStorage.setItem('resetEmail', values.email);
        try {
          await emailjs.send('service_r16ltzu', 'template_fxkhc08', {
            to_email: values.email,
            secret_number: secretCode,
          }, 'mcAaqOjKc68MCAfdJ');
          setMessage('A verification code has been sent to your email.');
          setOtpSent(true);
        } catch (emailError) {
          console.error('Email sending failed', emailError);
          setMessage('Failed to send verification code. Please try again.');
        }
      } else {
        setMessage(result.message || 'Failed to find email.');
      }
    } catch (error) {
      console.error('Error verifying email', error);
      setMessage('Server error. Please try again later.');
    }

    setLoading(false);
  }
},

  });

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value.slice(-1); // Ensure only 1 character (digit)
    setOtpDigits(newOtpDigits);

    // Move focus to next input if a digit is entered and it's not the last input
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle input key press for backspace (to go back)
  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="container mx-auto sm:py-4 min-h-[70vh] sm:h-auto flex items-center justify-center">
      <div className="bg-white rounded-md p-4 w-[60%] sm:container lg:w-[80%] shadow-2xl">
        <h1 className="text-gray-800 font-bold text-center text-2xl mb-8">{!otpSent ? 'Forget Password' : 'Enter OTP'}</h1>
        <form onSubmit={formik.handleSubmit} className='w-[80%] sm:w-[100%] mx-auto'>
          {!otpSent ? (
            // Email Input
            <div className="flex items-center border-2 mb-4 py-2 px-3 rounded-2xl">
              <MdOutlineAlternateEmail className="text-[18px] text-black" />
              <input
                id="email"
                className="pl-2 w-full outline-none border-none text-black"
                type="email"
                name="email"
                placeholder="Your Email"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange} // Clear message on typing
              />
            </div>
          ) : (
            // OTP Inputs (6 squares)
            <div className="flex justify-center space-x-2 mb-4">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  className={`border-2 text-center w-10 h-10 rounded-md text-black text-xl ${
                    otpValid === true ? 'border-green-500' :
                    otpValid === false ? 'border-red-500' : 'border-gray-400'
                  }`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
          )}

          {/* Message Display */}
          {message && 
       <div className={`text-center p-2 mb-4 text-md rounded-lg ${message.includes('not registered')
        || message.includes('Invalid') ? 'text-red-500 bg-red-200' : 'text-green-500 bg-green-200'}`} role="alert">
              {message}
            </div>
          }

          {/* Button for verifying OTP */}
          {otpSent && (
            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl 
              hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              disabled={verifyingOtp}
            >
              {verifyingOtp ? <FiLoader className="inline-block animate-spin text-white text-xl" /> : "Verify OTP"}
            </button>
          )}

          {/* Button for getting the code */}
          {!otpSent && (
            <button
              type="submit"
              className="block w-full bg-indigo-600 mt-5 py-2 rounded-2xl 
              hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
              disabled={loading}>
              {loading ? <FiLoader className="inline-block animate-spin text-white text-xl" /> : "Get Code"}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default ResetPassword