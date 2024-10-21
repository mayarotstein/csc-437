import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";


export class SloFoodHeaderElement extends HTMLElement {
    static template = html`
        <template>
            <header>
                <h1><slot name="title"></slot></h1>
                <nav>
                    <p><slot name="nav"></slot></p>
                </nav>
                <label>
                    <input type="checkbox" id="dark-mode-toggle" autocomplete="off" 
                        onchange="this.dispatchEvent(new CustomEvent('darkmode:toggle', {
                            bubbles: true, 
                            composed: true, 
                            detail: { checked: this.checked }
                        }))"
                    />
                    <slot name="dark-mode"></slot>
            </header>
        </template>
  `;

  static styles = css`
    header{
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: var(--size-spacing-medium);
        background-color: var(--color-background-header);
        color: var(--color-text-header);
    }

    h1 {
        flex-basis: 100%;
        font-family: var(--font-family-display);
        font-size: var(--size-type-xxxlarge);
        font-weight: var(--font-weight-light);
    }
    
    nav p {
        color: var(--color-text-header);
        margin: var(--size-spacing-small);
    }
    
  `;

  constructor() {
    super();
    shadow(this)
      .template(SloFoodHeaderElement.template)
      .styles(reset.styles, SloFoodHeaderElement.styles);
  }
  
}
