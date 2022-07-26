/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2022  Keyboardio, Inc.
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

import { ipcMain, nativeTheme } from "electron";
import { sendToRenderer } from "./utils";

export const registerNativeThemeHandlers = () => {
  ipcMain.on("native-theme.should-use-dark-colors", (event) => {
    event.returnValue = nativeTheme.shouldUseDarkColors;
  });

  nativeTheme.on("updated", () => {
    sendToRenderer("native-theme.updated", nativeTheme.shouldUseDarkColors);
  });
};