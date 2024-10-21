import { css } from "@calpoly/mustang";

const styles = css`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
  }
  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
  body {
    line-height: 1.5;
  }
`;

export default { styles };