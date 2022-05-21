import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

const Signup: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setSignupForm] = useState({
    email: "",
    password: "",
    comfirmPassword: "",
  });

  const [error, setError] = useState("");

  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  // Firebase Logic
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) setError("");

    if (signUpForm.password !== signUpForm.comfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        mb={2}
        required
        fontSize="10pt"
        name="password"
        placeholder="password"
        type="password"
        onChange={onChange}
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
      <Input
        mb={2}
        fontSize="10pt"
        required
        name="comfirmPassword"
        placeholder="Confirm password"
        type="password"
        onChange={onChange}
        _placeholder={{
          color: "gray.500",
        }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />

      <Text textAlign="center" fontSize="10pt" color="red">
        {error ||
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button
        type="submit"
        width="100%"
        height="36px"
        my={2}
        isLoading={loading}
      >
        Sign up
      </Button>
      <Flex justify="center" fontSize={"9pt"}>
        <Text mr="1">Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight="700"
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          Login
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
