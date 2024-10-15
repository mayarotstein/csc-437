import { css, html, shadow } from "@calpoly/mustang";

export class SloFoodHeaderElement extends HTMLElement {
    static template = html`
        <template>
            <header>
            <h1><slot name="title"></slot></h1>
            <nav>
            <p><slot name="nav"></slot></p>
            </nav>
            </header>
        </template>
  `;

  static styles = css`
    header{
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        padding: var(--size-spacing-medium);
        background-color: var(--color-background-header);
        color: var(--color-text-header);
        flex-direction: column;
    }

    h1 {
        font-family: var(--font-family-display);
        font-size: var(--size-type-xxxlarge);
        font-weight: var(--font-weight-light);
    }
    
    nav p {
        color: var(--color-text-body);
        margin: var(--size-spacing-small);
  `;

  constructor() {
    super();
    shadow(this)
      .template(SloFoodHeaderElement.template)
      .styles(SloFoodHeaderElement.styles);
  }
}
