import Router from "next/router";

export default function BackButton() {
  return <div onClick={() => Router.back()}>Go Back</div>;
}
