import React from "react";
import i18n from "i18next";
import { Electron } from "electron";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { loadLayout } from "../LayoutSharing";

export class FileImport extends React.Component {
  importFromFile = () => {
    const files = Electron.remote.dialog.showOpenDialog({
      title: i18n.t("editor.sharing.selectLoadFile"),
      filters: [
        {
          name: i18n.t("editor.sharing.dialog.layoutFiles"),
          extensions: ["json", "layout"],
        },
        {
          name: i18n.t("editor.sharing.dialog.allFiles"),
          extensions: ["*"],
        },
      ],
    });
    files.then((result) => {
      if (result.filePaths.length == 0) return;

      const layoutData = loadLayout(result.filePaths[0]);
      if (layoutData != null) this.props.setLayout("custom", layoutData);
    });
  };

  render() {
    return (
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={this.importFromFile}>
          {i18n.t("editor.sharing.loadFromFile")}
        </Button>
      </Box>
    );
  }
}
