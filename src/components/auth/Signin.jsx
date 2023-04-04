import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export const validateUserInfo = ({ email, password }) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email.trim()) return { ok: false, message: "Email is missing!" };
  if (!isValidEmail.test(email)) return { ok: false, message: "Invalid email" };

  if (!password.trim()) return { ok: false, message: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, message: "Password must be 8 characters long!" };
  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);
    if (!ok) return updateNotification("error", error);

    handleLogin(userInfo.email, userInfo.password);
  };

  // useEffect(() => {
  //   if (isLoggedIn) navigate("/");
  // }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign in</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="john@email.com"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="John1234"
            name="password"
            type="password"
          />
          <Submit value="Sign in" busy={isPending} />
          <div className="flex justify-between">
            <CustomLink to={"/auth/forgot-password"}>ForgotPassword</CustomLink>
            <CustomLink to={"/auth/signup"}>Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
