import {
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import API from "../api/API";

const ItemType = {
  int: "text",
  "varchar(45)": "text",
  "decimal(10,0)": "number",
  tinyint: "checkbox",
  datetime: "date",
  date: "date",
};

const Home = ({ data }) => {
  const [payloadData, setPayloadData] = useState({
    iSN: "",
    sTaxcode: "",
    sTaxName: "",
    sTaxAccountCode: "",
    dPercentage: "",
  });
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [snackbarIsOpen, setSnackbarIsOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayloadData((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    const requiredFields = [
      "iSN",
      "sTaxcode",
      "sTaxName",
      "sTaxAccountCode",
      "dPercentage",
    ];
    const hasError = requiredFields.some((field) => !payloadData[field]);
    if (hasError) {
      setError(true);
      return;
    }
    setIsSubmitting(true);
    const payload = {
      data: requiredFields.map((field) => ({
        Field: field,
        Value: payloadData[field],
      })),
    };
    try {
      const res = await API.post("/test/submit", payload);
      setSubmittedData(res.data);
      setSnackbarIsOpen(true);
      setSnackBarMessage("Data submitted successfully");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setSnackbarIsOpen(true);
      setSnackBarMessage("Error submitting data");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }, [error]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarIsOpen(false);
  };

  return (
    <>
      <FormControl
        className="form-control"
        sx={{
          gap: 2,
        }}
      >
        {data.map((item, index) => {
          if (item.Type === "tinyint") {
            return (
              <FormGroup key={index}>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label={item.Field}
                />
              </FormGroup>
            );
          } else {
            return (
              <FormGroup key={index}>
                <FormLabel htmlFor={item.Field}>{item.Field}</FormLabel>
                <TextField
                  onChange={handleChange}
                  name={item.Field}
                  value={payloadData[item.Field]}
                  id={item.Field}
                  type={ItemType[item.Type]}
                  required={item.Null === "NO" ? true : false}
                />
                {item.Null === "NO" && error && !payloadData[item.Field] && (
                  <FormHelperText>
                    <Typography color="error">
                      Filled must have an entry
                    </Typography>
                  </FormHelperText>
                )}
              </FormGroup>
            );
          }
        })}
        <Button
          disabled={isSubmitting}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          endIcon={isSubmitting && <CircularProgress size={20} />}
        >
          Submit
        </Button>
      </FormControl>
      <Snackbar
        open={snackbarIsOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
