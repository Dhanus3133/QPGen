import { useAuth } from "@/lib/auth";
import { useState } from "react";

export default function SignIn() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, signOut } = useAuth();

  function onSubmit(e) {
    e.preventDefault();
    signIn({ email, password });
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setemail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Sign In</button>
      </form>
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
}
