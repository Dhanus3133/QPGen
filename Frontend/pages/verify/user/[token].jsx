import { verifyEmailSignupMutation } from "@/src/graphql/mutations/verifyEmailSignup";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [VerifyEmailSignup, { data, loading, error }] = useMutation(
    verifyEmailSignupMutation
  );

  useEffect(() => {
    if (token) {
      VerifyEmailSignup({ variables: { token } });
    }
  }, [token]);

  if (loading) {
    return <p>Checking StandBy!</p>;
  }
  if (data?.verifyEmailSignup) {
    return <p>User is Verified</p>;
  } else {
    return <p>Invalid Token</p>;
  }
}
