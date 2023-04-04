import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

export const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!name.trim()) return { ok: false, message: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, message: "Invalid name!" };

  if (!email.trim()) return { ok: false, message: "Email is missing!" };
  if (!isValidEmail.test(email)) return { ok: false, message: "Invalid email" };

  if (!password.trim()) return { ok: false, message: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, message: "Password must be 8 characters long!" };
  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, message } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", message);
    const { error, user } = await createUser(userInfo);
    if (error) return updateNotification("error", error);

    navigate("/auth/verification", { state: { user }, replace: true });
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  const { name, email, password } = userInfo;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Full Name"
            placeholder="John Doe"
            name="name"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="john@email.com"
            name="email"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="John1234"
            name="password"
            type="password"
          />
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <CustomLink to={"/auth/forgot-password"}>ForgotPassword</CustomLink>
            <CustomLink to={"/auth/signin"}>Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
