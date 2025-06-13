import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
function RegistrationForm() {

      const { 
    register, 
    formState: { errors, isSubmitting, isSubmitSuccessful },
    handleSubmit,
    reset
  } = useForm();

    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    // const [formData, setFormData] = useState({
    //     fullName: '',
    //     fatherName: '',
    //     cnic: '',
    //     country: '',
    //     city: '',
    //     course: '',
    //     phone: '',
    //     email: '',
    //     gender: '',
    //     address: '',
    //     qualification: '',
    //     laptop: '',
    //     computerProficiency: '',
    //     dob: '',
    //     image: null
    // });

    // const [successMessage, setSuccessMessage] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');

    // const formRef = useRef(null);

     const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/all-users`);
            setData(response.data.users);
            console.log(data);

        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // const handleInput = (e) => {
    //     const { name, value } = e.target;
    //     const cleanValue = ["cnic", "phone"].includes(name)
    // ? value.replace(/\D/g, "") // Remove non-digits
    // : value;
    //     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    // };

    // const handleImage = (e) => {
    //     const imageFile = e.target.files[0];
    //     setFormData(prev => ({ ...prev, image: imageFile }));
    // };

    const onSubmit = async (data) => {
         setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const formDataToSend = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value && value[0]) {
          formDataToSend.append(key, value[0]);
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post('http://localhost:5000/api/user/create', formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setShowConfetti(true);
                setSuccessPopup(true);

        reset();
        fetchUsers();
      } else {
        setErrorMessage(response.data.message || "Registration failed");
                setErrorPopup(true);

      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "An unknown error occurred";
      setErrorMessage(errMsg);
            setErrorPopup(true);

    } finally {
      setLoading(false);
    }
    };

    const Popup = ({ message, onClose, type = "success" }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        {type === "success" ? (
          <svg className="mx-auto mb-4 h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="mx-auto mb-4 h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <div className={`text-lg font-semibold mb-4 ${type === "success" ? "text-green-700" : "text-red-700"}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`mt-2 px-6 py-2 rounded-lg font-semibold shadow transition ${
            type === "success"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );

    return (
 <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                    {showConfetti && <Confetti width={width} height={height} />}
    {loading && (
        <p>loading...</p>
    )}
    {successPopup && (
        <Popup
          message={successMessage || "Registration successful! Welcome to our learning community."}
          onClose={() => { setSuccessPopup(false); setShowConfetti(false); }}
          type="success"
        />
      )}
      {errorPopup && (
        <Popup
          message={errorMessage || "Registration failed. Please try again."}
          onClose={() => setErrorPopup(false)}
          type="error"
        />
      )}
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 bg-white rounded-full shadow-lg mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2"
          >
            Student Registration
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-indigo-600 max-w-md mx-auto"
          >
            Join our learning community. Fill in your details to enroll in our courses.
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-24 h-1 bg-indigo-500 rounded-full mx-auto mt-4"
          ></motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            {isSubmitSuccessful && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registration successful! Welcome to our learning community.
              </motion.div>
            )}
            
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-indigo-800 mb-6 pb-2 border-b border-indigo-100">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="Muhammad Saad"
                    {...register("fullName", { required: "Full name is required" })}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>
                
                {/* Father's Name */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="Robert Doe"
                    {...register("fatherName", { required: "Father's name is required" })}
                  />
                  {errors.fatherName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fatherName.message}</p>
                  )}
                </div>
                
                {/* CNIC */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border ${errors.cnic ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="XXXXX-XXXXXXX-X"
                    {...register("cnic", { 
                      required: "CNIC is required",
                      pattern: {
                        value: /^\d{5}-\d{7}-\d{1}$/,
                        message: "Please enter CNIC in XXXXX-XXXXXXX-X format"
                      }
                    })}
                  />
                  {errors.cnic && (
                    <p className="mt-1 text-sm text-red-500">{errors.cnic.message}</p>
                  )}
                </div>
                
                {/* Date of Birth */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-4 py-3 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    {...register("dob", { required: "Date of birth is required" })}
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-500">{errors.dob.message}</p>
                  )}
                </div>
                
                {/* Gender */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-4 py-3 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white`}
                    {...register("gender", { required: "Please select your gender" })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </div>
                
                {/* Course */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full px-4 py-3 border ${errors.course ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white`}
                    {...register("course", { required: "Please select a course" })}
                  >
                    <option value="">Select Course</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>
                  )}
                </div>
                
                {/* Email */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="john@example.com"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                    placeholder="+92 XXX XXXXXXX"
                    {...register("phone", { 
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[0-9\s\-()]{7,20}$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact & Educational Details */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-indigo-800 mb-6 pb-2 border-b border-indigo-100">Contact & Educational Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Pakistan"
                    {...register("country")}
                  />
                </div>
                
                {/* City */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Karachi"
                    {...register("city")}
                  />
                </div>
                
                {/* Qualification */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white"
                    {...register("qualification")}
                  >
                    <option value="">Select Qualification</option>
                    <option value="Matric">Matric</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                
                {/* Computer Proficiency */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Computer Proficiency</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white"
                    {...register("computerProficiency")}
                  >
                    <option value="">Select Proficiency</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                {/* Laptop Availability */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Laptop Availability</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 appearance-none bg-white"
                    {...register("laptop")}
                  >
                    <option value="">Do you have a laptop?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                
                {/* Address */}
                <div className="form-group md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 min-h-[120px]"
                    placeholder="Full address"
                    {...register("address")}
                  ></textarea>
                </div>
                
                {/* Profile Photo */}
                <div className="form-group md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-full">
                      <input
                        type="file"
                        className={`w-full px-4 py-3 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer`}
                        {...register("image", { required: "Profile photo is required" })}
                      />
                      {errors.image && (
                        <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
                      )}
                    </div>
                    <div className="avatar flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          © 2023 Student Portal. All rights reserved.
        </motion.div>
      </div>
    </div>
    );
}

export default RegistrationForm;