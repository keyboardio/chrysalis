// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019, 2020  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from "react";
const { ipcRenderer } = require("electron");

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import FilledInput from "@mui/material/FilledInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Portal from "@mui/material/Portal";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import {
  KeyboardSettings,
  AdvancedKeyboardSettings,
} from "./Preferences/KeyboardSettings";
import i18n from "../i18n";

import Focus from "../../api/focus";

const Store = require("electron-store");
const settings = new Store();

function Preferences(props) {
  let focus = new Focus();
  const [devTools, setDevTools] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [verboseFocus, setVerboseFocus] = useState(focus.debug);
  const [language, setLanguage] = useState(i18n.language);
  useEffect(() => {
    ipcRenderer.invoke("devtools-is-open").then((result) => {
      setDevTools(result);
    });
    ipcRenderer.on("devtools-opened", () => {
      setDevTools(true);
    });
    ipcRenderer.on("devtools-closed", () => {
      setDevTools(false);
    });

    // Cleanup when component unmounts.
    return () => {
      ipcRenderer.removeAllListeners("devtools-opened");
      ipcRenderer.removeAllListeners("devtools-closed");
    };
  });
  const toggleDevTools = (event) => {
    setDevTools(event.target.checked);
    if (event.target.checked) {
      ipcRenderer.send("show-devtools", true);
    } else {
      ipcRenderer.send("show-devtools", false);
    }
  };

  const updateLanguage = async (event) => {
    i18n.changeLanguage(event.target.value);
    await settings.set("ui.language", event.target.value);
    // We stick language in the state system to get rerenders when it changes
    setLanguage(event.target.value);
  };

  const toggleAdvanced = () => {
    setAdvanced(!advanced);
  };

  const toggleVerboseFocus = (event) => {
    setVerboseFocus(event.target.checked);
    let focus = new Focus();
    focus.debug = event.target.checked;
  };

  const { darkMode, toggleDarkMode } = props;

  const languages = Object.keys(i18n.options.resources).map((code) => {
    const t = i18n.getFixedT(code);
    return (
      <MenuItem value={code} key={code}>
        {t("language")}
      </MenuItem>
    );
  });

  return (
    <Box sx={{ py: 2, px: 2, margin: "0 8" }}>
      <Portal container={props.titleElement}>
        {i18n.t("app.menu.preferences")}
      </Portal>
      <Typography
        variant="subtitle1"
        component="h2"
        sx={{
          marginTop: 4,
          marginBottom: 1,
        }}
      >
        {i18n.t("preferences.interface")}
      </Typography>
      <Card>
        <CardContent>
          <FormControl variant="standard" fullWidth={true}>
            <InputLabel>{i18n.t("preferences.language")}</InputLabel>
            <Select
              value={language}
              sx={{ mb: 2 }}
              onChange={updateLanguage}
              label={i18n.t("preferences.language")}
              input={<FilledInput sx={{}} />}
            >
              {languages}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                value="devtools"
                sx={{ mx: 3 }}
              />
            }
            sx={{ display: "flex", marginRight: 2 }}
            labelPlacement="end"
            label={i18n.t("preferences.darkMode")}
          />
        </CardContent>
      </Card>
      {props.connected && (
        <KeyboardSettings
          startContext={props.startContext}
          cancelContext={props.cancelContext}
          inContext={props.inContext}
        />
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
          "& button": {
            textTransform: "none",
            "& span svg": {
              marginLeft: "1.5em",
            },
          },
        }}
      >
        <Button onClick={toggleAdvanced}>
          {i18n.t("preferences.advanced")}
          {advanced ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </Button>
      </Box>
      <Collapse in={advanced} timeout="auto" unmountOnExit>
        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            marginTop: 4,
            marginBottom: 1,
          }}
        >
          {i18n.t("preferences.devtools")}
        </Typography>
        <Card>
          <CardContent>
            <FormControlLabel
              sx={{ display: "flex", marginRight: 2 }}
              control={
                <Switch
                  checked={devTools}
                  onChange={toggleDevTools}
                  value="devtools"
                  sx={{ mx: 3 }}
                />
              }
              labelPlacement="end"
              label={i18n.t("preferences.devtools")}
            />
            <FormControlLabel
              sx={{ display: "flex", marginRight: 2 }}
              control={
                <Switch
                  checked={verboseFocus}
                  onChange={toggleVerboseFocus}
                  value="verboseFocus"
                  sx={{ mx: 3 }}
                />
              }
              labelPlacement="end"
              label={i18n.t("preferences.verboseFocus")}
            />
          </CardContent>
        </Card>
        {props.connected && (
          <AdvancedKeyboardSettings
            startContext={props.startContext}
            cancelContext={props.cancelContext}
            inContext={props.inContext}
          />
        )}
      </Collapse>
    </Box>
  );
}

export default Preferences;
