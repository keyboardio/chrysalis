// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2020  Keyboardio, Inc.
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

import React from "react";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import LayerSwitchButton from "./Features/LayerSwitchButton";

import { NewKeymapDB } from "../../../../api/keymap";
const db = new NewKeymapDB();

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    margin: theme.spacing.unit,
    height: "100%"
  }
});

class FeatureSelector extends React.Component {
  render() {
    const { classes, currentKeyCode } = this.props;

    const isLayerKey = db.isLayerKey(currentKeyCode);

    return (
      <div className={classes.root}>
        <div>
          <LayerSwitchButton keyCode={currentKeyCode} selected={isLayerKey} />
          <Button className={classes.key} color="default" variant="outlined">
            Macro
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FeatureSelector);
