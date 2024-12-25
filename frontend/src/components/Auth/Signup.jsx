import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper";
import { icons } from "../Icons.jsx";
import { toast } from "react-toastify";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signup = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    if (data.coverImage) {
      formData.append("coverImage", data.coverImage[0]);
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/register", formData);

      if (response?.data?.data) {
        toast.success("Account created successfully");
        navigate("/login");
      }
    } catch (error) {
      if (error.status === 409) {
        setError("User with email or username already exists");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#121212] flex items-center justify-center">
      {/* start */}

      <form
        className="p-5 bg-[#1a1a1a] rounded-[20px] border border-[#333]
"
        onSubmit={handleSubmit(signup)}
      >
        <p className="signup-title">Register </p>
        <p className="signup-message">
          Sign up now to enjoy complete access to all features.{" "}
        </p>

        <div className="h-full w-full flex">
          <div className="signup-form py-5 pr-[10px]">
            {/* full name input */}
            <label>
              <input
                required
                className="signup-input"
                type="text"
                placeholder=""
                {...register("fullname", {
                  required: "Full name required",
                  maxLength: {
                    value: 25,
                    message: "Full name can't exceed 25 characters",
                  },
                })}
              />
              <span>Full Name</span>
            </label>

            {errors.fullname && (
              <p className="text-red-600 px-2 mt-1">
                {errors.fullname.message}
              </p>
            )}

            {/* username input */}
            <label>
              <input
                className="signup-input"
                type="text"
                required
                placeholder=""
                {...register("username", {
                  required: "Username required",
                  maxLength: {
                    value: 25,
                    message: "Username can't exceed 25 characters",
                  },
                })}
              />
              <span>Username</span>
            </label>

            {errors.username && (
              <p className="text-red-600 px-2 mt-1">
                {errors.username.message}
              </p>
            )}

            {/* email input */}
            <label>
              <input
                className="signup-input"
                type="email"
                placeholder=""
                required
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Email address must be a valid address",
                  },
                })}
              />
              <span>Email</span>
            </label>

            {errors.email && (
              <p className="text-red-600 px-2 mt-1">{errors.email.message}</p>
            )}

            {/* Password */}
            <label>
              <input
                className="signup-input"
                type={passwordVisible ? "text" : "password"}
                placeholder=""
                required
                {...register("password", {
                  required: "Password required",
                })}
              />
              <span>Password</span>
            </label>
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="togglePassword"
                className="mr-2"
                onChange={() => setPasswordVisible(!passwordVisible)}
              />
              <label htmlFor="togglePassword">Show Password</label>
            </div>

            {errors.password && (
              <p className="text-red-600 px-2 mt-1">
                {errors.password.message}
              </p>
            )}

            <button className="signup-submit" type="submit" disabled={loading}>
              {loading ? <span>{icons.loading}</span> : "Sign up"}
            </button>
          </div>

          <div className="signup-form py-5 bg-[#1a1a1a]">
            {/* avatar input */}
            <div class="avatar">
              <span class="avatar-title">Upload your avatar</span>
              <p class="avatar-paragraph">File should be an image</p>
              <label for="file-input01" class="avatar-drop-container">
                <input
                  id="file-input01"
                  type="file"
                  required
                  placeholder="Upload your avatar"
                  {...register("avatar", {
                    required: "Avatar required",
                    validate: (file) => {
                      const allowedExtension = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                      ];
                      const fileType = file[0]?.type;
                      return allowedExtension.includes(fileType)
                        ? true
                        : "Invalid file type! Only .jpeg .jpg .png files are accepted";
                    },
                  })}
                />
              </label>

              {errors.avatar && (
                <p className="text-red-600 px-2 mt-1">
                  {errors.avatar.message}
                </p>
              )}
            </div>

            {/* cover image input */}
            <div class="avatar">
              <span class="avatar-title">Upload your cover image</span>
              <p class="avatar-paragraph">File should be an image</p>
              <label for="file-input02" class="avatar-drop-container">
                <input
                  id="file-input02"
                  type="file"
                  {...register("coverImage", {
                    required: false,
                    validate: (file) => {
                      if (!file[0]) return true;
                      const allowedExtensions = [
                        "image/jpeg",
                        "image/jpg",
                        "image/png",
                      ];
                      const fileType = file[0].type;
                      return allowedExtensions.includes(fileType)
                        ? true
                        : "Invalid file type! Only .jpeg .jpg .png files are accepted";
                    },
                  })}
                />
              </label>

              {errors.coverImage && (
                <p className="text-red-600 px-2 mt-1">
                  {errors.coverImage.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="signup-signin">
          Already have an acount ?{" "}
          <Link
            to={"/login"}
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Login now
          </Link>
        </p>
      </form>
      {/* end */}
    </div>
  );
}

export default Signup;
