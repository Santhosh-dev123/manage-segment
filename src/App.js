import React, { useState } from "react";
import "./App.css";
import { Button, Drawer, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import { Label } from "@mui/icons-material";

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [isOpenButton, setIsOpenButton] = useState(false);
  const [schemaUpdate, setSchemaUpdate] = useState([...schemaOptions]);
  const [dynamicDropdown, setDynamicDropdown] = useState([]);
  const [segmentName, setSegmentName] = useState("");

  const handleDropdownChange = (index, event) => {
    const newDropdowns = [...dynamicDropdown];
    const selectedOption = schemaOptions.find(
      (option) => option.value === event.target.value
    );
    newDropdowns[index] = selectedOption;
    const updateSchema = schemaOptions.filter(
      (option) => !newDropdowns.includes(option)
    );
    setDynamicDropdown(newDropdowns);
    setSchemaUpdate(updateSchema);
  };

  const handleAddNewSchema = () => {
    if (schemaUpdate.length > 0 && !dynamicDropdown.includes("")) {
      const newDropdowns = [...dynamicDropdown, ""];
      const updateSchema = schemaOptions.filter(
        (option) => !newDropdowns.includes(option)
      );
      setDynamicDropdown(newDropdowns);
      setSchemaUpdate(updateSchema);
    } else {
      alert("Please fill exist schema");
    }
  };

  const removeDropDown = (index) => {
    const newDropdowns = [...dynamicDropdown];
    newDropdowns.splice(index, 1);
    const updateSchema = schemaOptions.filter(
      (option) => !newDropdowns.includes(option)
    );
    setDynamicDropdown(newDropdowns);
    setSchemaUpdate(updateSchema);
  };

  const handleSaveSegment = () => {
    if (!segmentName) {
      alert("Enter segment name");
      return;
    }
    if (dynamicDropdown.length === 0) {
      alert("Select at least one schema");
      return;
    }
    if (dynamicDropdown.includes("")) {
      alert("Complete pending schema");
      return;
    }

    const payload = {
      segment_name: segmentName,
      schema: dynamicDropdown.map((schema) => ({
        [schema.value]: schema.label,
      })),
    };
    console.log("payload: ", payload);
    const options = {
      method: "POST",

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },

      mode: "no-cors",
      body: JSON.stringify(payload),
    };

    fetch("https://webhook.site/74b0903e-acd5-4ac6-bfa6-524587668980", options);

    setIsOpenButton(false);
    setSegmentName("");
    setSchemaUpdate([...schemaOptions]);
    setDynamicDropdown([]);

    alert("Segment successfully  saved");
  };

  const toggleDrawer = (newOpen) => () => {
    setIsOpenButton(newOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="view-audience"> View Audience </p>
      </header>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#797979a8",
          color: "white",
          marginLeft: "5%",
          marginTop: "5%",
          border: "2px solid white",
          '&:hover' : {
            backgroundColor: "#797979a8",
            color: "white",
          }
        }}
        onClick={() => setIsOpenButton(true)}
      >
        Save Segment
      </Button>

    <Drawer open={isOpenButton} onClose={toggleDrawer(false)}>
      <div className="form-popup">
         
      <Typography className="App-header" variant="h3" gutterBottom>
          <Typography variant="subtitle1" className="view-audience"> Save Segment </Typography>
      </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 20px 40px 20px",
              overflowY: 'auto',
              overscrollBehavior: "smooth"
            }}
            
          >
           <Grid container>
            <Typography variant="body1">Enter the Name of the segment</Typography>
            <TextField
              type="text"
              placeholder="Name of the segment"
              style={{
                height: "30px",
                borderStyle: "solid",
                width: "95%",
                borderRadius: "3px",
                borderColor: "darkgrey",
              }}
              value={segmentName}
              variant="outlined"
              onChange={(e) => setSegmentName(e.target.value)}
            />
            </Grid>

            <br/>
            <br/>
            
            <Grid container>
              <Typography variant="h6">
              To save your segment, you need to add the schemas to build the
              query
            </Typography></Grid>

            <br/>

            <Grid sx={{marginLeft: "auto", width: "50%"}} container spacing={2}>
               <ul style={{display: "flex", gap: "13%", width: "100%"}}>
                <li>Line Track</li>
                <li>Group Track</li>
               </ul>
            </Grid>
            
            {dynamicDropdown.map((dropdown, index) => (
              <div key={index} className="dropdown-menu">
                <div key={index}>
                  <Select
                    name="option-segment"
                    value={dropdown?.value || "0"}
                    defaultValue={"Add schema to segment"}
                    onChange={(event) => handleDropdownChange(index, event)}
                    style={{
                      height: "35px",
                      borderStyle: "solid",
                      width: "320px",
                      borderRadius: "3px",
                      borderColor: "darkgrey",
                    }}
                  >
                    <MenuItem value="0">Add schema to segment</MenuItem>
                    {[...schemaUpdate, dropdown]
                      .filter(Boolean)
                      .map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                <div>
                  <Button
                    onClick={() => removeDropDown(index)}
                    style={{
                      height: "35px",
                      borderStyle: "none",
                      width: "35px",
                      cursor: "pointer",
                      backgroundColor: "aliceblue",
                      textDecorationLine: "line-through",
                    }}
                  >
                    <RemoveIcon/>
                  </Button>
                </div>
              </div>
            ))}
            {schemaUpdate.length > 0 && (
              <span style={{ color: "#50a6bb" }}>
                {"+"}
                <Button className="link-button" onClick={handleAddNewSchema}>
                  Add new schema
                </Button>
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "4%",
              padding: "20px",
              backgroundColor: "#f6f3f3",
              position: "fixed",
              bottom: "7px",
              width: "410px",
            }}
          >
            <div>
              <Button
                onClick={handleSaveSegment}
                style={{
                  borderStyle: "unset",
                  color: "white",
                  backgroundColor: "#50a6bb",
                  height: "30px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Save Segment
              </Button>
            </div>
            <div>
              <Button
                onClick={() => setIsOpenButton(false)}
                style={{
                  backgroundColor: "white",
                  color: "red",
                  borderStyle: "unset",
                  height: "30px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
      {/* {isOpenButton && (
        <div className="form-popup">
          <header className="App-header">
            <p className="view-audience"> Save Segment </p>
          </header>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 20px 40px 20px",
            }}
          >
            <p>Enter the Name of the segment</p>
            <input
              type="text"
              placeholder="Name of the segment"
              style={{
                height: "30px",
                borderStyle: "solid",
                width: "95%",
                borderRadius: "3px",
                borderColor: "darkgrey",
              }}
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <p>
              To save your segment, you need to add the schemas to build the
              query
            </p>

            {dynamicDropdown.map((dropdown, index) => (
              <div key={index} className="dropdown-menu">
                <div key={index}>
                  <select
                    name="option-segment"
                    value={dropdown?.value || ""}
                    placeholder={"Add schema to segment"}
                    onChange={(event) => handleDropdownChange(index, event)}
                    style={{
                      height: "35px",
                      borderStyle: "solid",
                      width: "320px",
                      borderRadius: "3px",
                      borderColor: "darkgrey",
                    }}
                  >
                    <option value="">Add schema to segment</option>
                    {[...schemaUpdate, dropdown]
                      .filter(Boolean)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeDropDown(index)}
                    style={{
                      height: "35px",
                      borderStyle: "none",
                      width: "35px",
                      cursor: "pointer",
                      backgroundColor: "aliceblue",
                      textDecorationLine: "line-through",
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
            {schemaUpdate.length > 0 && (
              <span style={{ color: "#50a6bb" }}>
                {"+"}
                <button className="link-button" onClick={handleAddNewSchema}>
                  Add new schema
                </button>
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "4%",
              padding: "20px",
              backgroundColor: "#f6f3f3",
              position: "fixed",
              bottom: "7px",
              width: "410px",
            }}
          >
            <div>
              <button
                onClick={handleSaveSegment}
                style={{
                  borderStyle: "unset",
                  color: "white",
                  backgroundColor: "#50a6bb",
                  height: "30px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Save Segment
              </button>
            </div>
            <div>
              <button
                onClick={() => setIsOpenButton(false)}
                style={{
                  backgroundColor: "white",
                  color: "red",
                  borderStyle: "unset",
                  height: "30px",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default App;
