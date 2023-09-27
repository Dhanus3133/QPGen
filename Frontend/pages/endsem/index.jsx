import Link from "next/link";
import { Button } from "@mui/material";
import COEOnly from "components/coe/COEOnly";
import EndSemFacultyOnly from "components/endsem/EndSemFacultyOnly";

export default function EndSem() {
  return (
    <>
      <COEOnly>
        <div className="p-2">
          <Link href="/endsem/create">
            <Button
              type="submit"
              className="bg-[#1976d2]"
              variant="contained"
              color="primary"
            >
              Create a new Subject
            </Button>
          </Link>
        </div>
      </COEOnly>
      <EndSemFacultyOnly>
        <h1>EndSem</h1>
      </EndSemFacultyOnly>
    </>
  );
}
