import { css } from "@emotion/react";

const GlobalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    @media (max-width: 1279px) {
      font-size: 93.75%;
    }
    @media (max-width: 768px) {
      font-size: 87.5%;
    }
  }

  html,
  body,
  #root {
    height: 100%;
  }

  body,
  input,
  textarea,
  button {
    font-family: "Roboto", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  a,
  button {
    cursor: pointer;
  }

  &:disabled {
    cursor: not-allowed !important;
    pointer-events: all !important;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .MuiDataGrid-row:hover {
    background-color: rgba(93, 78, 232, 0.04) !important;
  }
`;

export default GlobalStyles;
