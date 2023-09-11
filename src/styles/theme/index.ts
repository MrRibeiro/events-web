import { ptBR } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme(
  {
    palette: {
      common: {
        black: "#040D1A",
        white: "#FFF",
      },
      primary: {
        light: "#A79CFF",
        main: "#5D4EE8",
        dark: "#372DB7",
        contrastText: "#FFF",
      },
      secondary: {
        light: "#85FBFF",
        main: "#00D3C3",
        dark: "#1A83B7",
        contrastText: "#FFF",
      },
      error: {
        light: "#FFA981",
        main: "#FF502D",
        dark: "#B71816",
        contrastText: "#FFF",
      },
      warning: {
        light: "#FFEE8D",
        main: "#FFDC42",
        dark: "#B79521",
        contrastText: "rgba(4, 13, 26, 0.96)",
      },
      info: {
        light: "#9776EF",
        main: "#6935CD",
        dark: "#5A19B2",
        contrastText: "#FFF",
      },
      success: {
        light: "#D5F477",
        main: "#A2DD21",
        dark: "#699F10",
        contrastText: "rgba(4, 13, 26, 0.96)",
      },
      grey: {
        50: "#FAFBFC",
        100: "#F6F8FA",
        200: "#E1E4E8",
        300: "#D1D5DA",
        400: "#959DA5",
        500: "#6A737D",
        600: "#586069",
        700: "#444D56",
        800: "#2F363D",
        900: "#24292E",
        A100: "#BEC5CC",
        A200: "#96A0AB",
        A400: "#2C3238",
        A700: "#444D56",
      },
      text: {
        primary: "rgba(4, 13, 26, 0.96)",
        secondary: "rgba(4, 13, 26, 0.64)",
        disabled: "rgba(4, 13, 26, 0.40)",
      },
      divider: "rgba(4, 13, 26, 0.12)",
      background: {
        paper: "#fff",
        default: "#fafbfc",
      },
      action: {
        active: "rgba(4, 13, 26, 0.54)",
        hover: "rgba(4, 13, 26, 0.04)",
        hoverOpacity: 0.04,
        selected: "rgba(4, 13, 26, 0.08)",
        selectedOpacity: 0.08,
        disabled: "rgba(4, 13, 26, 0.26)",
        disabledBackground: "rgba(4, 13, 26, 0.12)",
        disabledOpacity: 0.38,
        focus: "rgba(4, 13, 26, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.12,
      },
    },
    shape: {
      borderRadius: 5,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  },
  ptBR
);
