// // src/components/UserDetails.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// function UserDetails() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user) {
//     // If no user found (not logged in), redirect to login
//     navigate("/auth");
//     return null;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     alert("You have been logged out!");
//     navigate("/auth");
//   };

//   return (
//     <div className="p-5 max-w-md mx-auto bg-white shadow-md rounded-xl mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center text-yellow-600">
//         User Account Details
//       </h2>

//       <div className="space-y-3 text-lg">
//         <p><strong>Name:</strong> {user.name}</p>
//         <p><strong>Email:</strong> {user.email}</p>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }

// export default UserDetails;
