import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function DateTime({ dateTime, setDateTime }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label="Exam Date & Time"
        value={dateTime}
        onChange={(newDate) => {
          setDateTime(newDate);
        }}
        inputFormat="DD-MM-YYYY / HH:mm"
      />
    </LocalizationProvider>
  );
}
