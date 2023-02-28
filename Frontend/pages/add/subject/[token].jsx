import React from "react";
import { useState } from "react";
import { TextField, Select, MenuItem, Button, Box, Container, Checkbox, FormControlLabel } from "@mui/material";

const MAX_UNITS = 5;
const initialValues = {
  totalMarks: '',
  fields: [],
};

const Form = () => {
  
    const [formData, setFormData] = useState({
        option: '',
        fields: [],
      });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('outcome'));
  };

  const handleAddField = () => {
    setFormData({
      ...formData,
      fields: [...formData.fields, { marks: '', count: '', delete: false }],
    });
  };

  const handleFieldChange = (index, fieldKey, fieldValue) => {
    const newFields = [...formData.fields];
    newFields[index][fieldKey] = fieldValue;
    setFormData({ ...formData, fields: newFields });
  };

  const handleDeleteField = (index) => {
    const newFields = [...formData.fields];
    newFields.splice(index, 1);
    setFormData({ ...formData, fields: newFields });
  };

  // units
  const [formDatas, setFormDatas] = useState(initialValues);

  const handleSubmits = (event) => {
    event.preventDefault();
    console.log(formDatas);
    // Do something with the form data, e.g. send it to a server
  };

  const handleAddFields = () => {
    if (formDatas.fields.length >= MAX_UNITS) {
      return;
    }
    setFormDatas({
      ...formDatas,
      fields: [...formDatas.fields, { name: '', outcome: '', objective: '', level: '' }],
    });
  };

  const handleFieldChanges = (index, fieldKey, value) => {
    const fields = [...formDatas.fields];
    fields[index][fieldKey] = value;
    setFormDatas({ ...formDatas, fields });
  };

  const handleDeleteFields = (index) => {
    const fields = [...formDatas.fields];
    fields.splice(index, 1);
    setFormDatas({ ...formDatas, fields });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
      sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
      component="form"
      onSubmit={handleSubmit}
      noValidate>
      <label>Subject:</label>
      <TextField
        label="Subject"
        fullWidth
        name="subject"
        margin="normal"
      />
      <label >Unit:</label>
      <Select
        label="Units Numbered 1-5"
        fullWidth
        name="unit"
        margin="normal"
      >
        <MenuItem value="1">1</MenuItem>
        <MenuItem value="2">2</MenuItem>
        <MenuItem value="3">3</MenuItem>
        <MenuItem value="4">4</MenuItem>
        <MenuItem value="5">5</MenuItem>
      </Select>
     
      <label >Unit Name: </label>
      <TextField
        label="Unit"
        fullWidth
        name="unit"
        margin="normal"
      />


      {/* hydration error */}
      <form onSubmit={handleSubmit}>
      <TextField
        label="Total Marks"
        value={formData.totalMarks}
        onChange={(event) => setFormData({ ...formData, totalMarks: event.target.value })}
      />

      <Button variant="contained" color="primary" onClick={handleAddField}>
        Add
      </Button>

      {formData.fields.map((field, index) => (
        <div key={index}>
          <TextField
            label="Marks"
            value={field.marks}
            onChange={(event) => handleFieldChange(index, 'marks', event.target.value)}
          />

          <TextField
            label="Count"
            value={field.count}
            onChange={(event) => handleFieldChange(index, 'count', event.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={() => handleDeleteField(index)}>
            Remove
          </Button>
        </div>
      ))}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>

    {/* units */}
    
    <form onSubmits={handleSubmits}>
      <TextField
        label="Select the units"
        type="number"
        inputProps={{ min: 1, max: MAX_UNITS }}
        value={formDatas.totalMarks}
        onChange={(event) => setFormDatas({ ...formDatas, totalMarks: event.target.value })}
      />

<Button variant="contained" color="primary" onClick={handleAddFields}>
        Add
      </Button>

      {formDatas.fields.map((field, index) => (
        <div key={index}>
          <TextField
            label={`Name for Unit ${index + 1}`}
            value={field.name}
            onChange={(event) => handleFieldChanges(index, 'name', event.target.value)}
          />

            <TextField
            label={`Outcome for Unit ${index + 1}`}
            value={field.outcome}
            onChange={(event) => handleFieldChanges(index, 'outcome', event.target.value)}
          />

          <TextField
            label={`Objective for Unit ${index + 1}`}
            value={field.objective}
            onChange={(event) => handleFieldChanges(index, 'objective', event.target.value)}
          />

          <TextField
            label={`Biotaxonomy Level for Unit ${index + 1}`}
            value={field.level}
            onChange={(event) => handleFieldChanges(index, 'level', event.target.value)}
          />

<Button variant="contained" color="secondary" onClick={() => handleDeleteFields(index)}>
            Remove
          </Button>
        </div>
      ))}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>

      <Button
        className="bg-[#1976d2]"
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
    </Container>
  );
};

export default Form;