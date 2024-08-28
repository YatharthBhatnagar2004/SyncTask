import React, { useState } from "react";
// import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const res = await axios.post(
  //         `${process.env.REACT_APP_API}/api/v1/auth/signup`,
  //         {
  //           name,
  //           email,
  //           phone,
  //           answer,
  //           address,
  //           password,
  //         }
  //       );
  //       if (res.data.success) {
  //         console.log("Success:", res.data.message); // Add console log for debugging
  //         toast.success(res.data.message);
  //         navigate("/");
  //       } else {
  //         toast.error(res.data.message);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Something went wrong!!");
  //     }
  //   };

  return (
    <div className="Form-container bg-gray-100 h-[100vh] w-[100vw] flex flex-wrap relative">
      <div className=" h-[100vh] w-[70vw] left-0 absolute flex flex-wrap justify-center items-center">
        <img src="/image1.png" className="w-[600px] z-10 absolute" />

        <img
          src="/image4.png"
          className="h-[33vh] object-cover absolute bottom-[60px] right-0"
        />
      </div>
      <h1 className="h1">LOGIN</h1>
      <div className="bg-white h-[100vh] w-[30vw] right-0 absolute flex flex-wrap justify-center items-center">
        <form
          // onSubmit={handleSubmit}
          className="w-[100vw] pl-[40px] pr-[40px]"
        >
          <h1 className="text-[30px] font-medium mb-[2px]">
            Welcome to Materialize!
          </h1>
          <p className="text-gray-600 mb-3">
            Please sign-in to your account and start the adventure
          </p>
          <div className="mb-5">
            <input
              type="email"
              //   value={email}
              placeholder="Email"
              //   onChange={(e) => setEmail(e.target.value)}
              //   className="form-control"
              //   id="exampleInputEmail1"
              //   required
              className=" border-gray-300 text-[20px] pl-5 border-solid border-[2px] w-[100%] h-[50px] rounded-lg"
            />
          </div>
          <div className="mb-7">
            <input
              type="password"
              placeholder="Password"
              //   value={password}
              //   onChange={(e) => setPassword(e.target.value)}
              //   className="form-control"
              //   id="exampleInputPassword1"
              //   required
              className=" border-gray-300 text-[20px] pl-5 border-solid border-[2px] w-[100%] h-[50px] rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="btn rounded-lg h-[50px] text-white bg-[rgb(91,98,255)]  items-center  justify-center flex w-full"
          >
            Login
          </button>
          <div className="flex flex-wrap items-center pt-5">
            <hr className="w-[45%] border-[1px] border-s-black " />
            <p className="text-center w-[10%]">or</p>
            <hr className="w-[45%] border-[1px] border-s-black " />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
