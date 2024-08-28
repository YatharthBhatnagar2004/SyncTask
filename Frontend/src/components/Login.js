import React, { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  // const handleGoogleLogin = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get("http://localhost:8000/google");
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error!!! initiating Google login:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handleGoogleLogin = () => {
  //   setIsLoading(true);
  //   window.location.href = "http://localhost:8000/google";
  // };
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className="Form-container bg-gray-100 h-[100vh] w-[100vw] flex flex-wrap relative">
      {/* Rest of your component structure remains the same */}
      <div className="bg-white h-[100vh] w-[30vw] right-0 absolute flex flex-wrap justify-center items-center">
        <form className="w-[100vw] pl-[40px] pr-[40px]">
          <h1 className="text-[30px] font-medium mb-[2px]">
            Welcome to Materialize!
          </h1>
          <p className="text-gray-600 mb-3">
            Please sign-in to your account and start the adventure
          </p>
          <button onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign in with Google"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
