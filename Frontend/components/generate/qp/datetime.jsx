import * as React from "react";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
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
        // inputFormat="DD MM YYYY"
        // toolbarFormat="DD MM YYYY"
      />
    </LocalizationProvider>
  );
  // return (
  //   <LocalizationProvider dateAdapter={AdapterDayjs}>
  //     <DatePicker
  //       label="Exam Date"
  //       value={date}
  //       onChange={(newDate) => {
  //         setDate(newDate);
  //       }}
  //       renderInput={(params) => <TextField {...params} />}
  //       inputFormat="DD-MM-YYYY"
  //       views={["day", "month", "year"]}
  //     />
  //   </LocalizationProvider>
  // );
}
