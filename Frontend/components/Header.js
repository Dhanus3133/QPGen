import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "#eee", padding: "1em" }}>
      <h1 style={{ margin: "0 0 1rem" }}>
        QPGen
      </h1>
      <nav style={{ display: "flex", justifyContent: "space-between" }}>
      </nav>
      <p>
        <strong>
            Creating Question Paper made easy!
        </strong>
      </p>
    </header>
  );
}
