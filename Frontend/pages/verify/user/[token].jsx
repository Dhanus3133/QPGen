import { verifyEmailSignupMutation } from "@/src/graphql/mutations/verifyEmailSignup";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "@mui/material";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [VerifyEmailSignup, { data, loading, error }] = useMutation(
    verifyEmailSignupMutation,
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
    return (
      <div className="p-5">
        <p>User is Verified</p>
        <Link href="/login">
          <Button
            type="submit"
            className="bg-[#1976d2]"
            variant="contained"
            color="primary"
          >
            Click here to Login
          </Button>
        </Link>
      </div>
    );
  } else {
    return <p>Invalid Token</p>;
  }
}
