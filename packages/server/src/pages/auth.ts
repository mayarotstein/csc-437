import renderPage from "./renderPage"; // generic page renderer
import { css, html } from "@calpoly/mustang/server";


export class LoginPage {
    render() {
      return renderPage({
        scripts: [
          `
          import { define, Auth } from "@calpoly/mustang";
          import { LoginForm } from "/scripts/login-form.js";
  
          define({
            "mu-auth": Auth.Provider,
            "login-form": LoginForm
          })
          `
        ],
        styles: [
          css`
          .card {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            border: var(--card-border-color);
            border-radius: var(--card-border-radius);
            padding: var(--size-spacing-medium);
            background-color: var(--card-background-color);
            gap: var(--size-spacing-medium);
            flex-grow: 1;
            }
        
            h2{
                font-family: var(--font-family-display);
                font-size: var(--size-type-large);
                font-weight: var(--font-weight-normal);
            }
        
            p {
                font-size: var(--size-type-medium);
            }
        
            img {
                width: 100vw;
                height: 400px;
                object-fit: cover;
                object-position: center;
                display: block;
                border-radius: var(--img-border-radius);
            }
        
            .button {
              display: inline-block;
              padding: var(--size-spacing-medium);
              font-size: var(--size-type-medium);
              font-family: var(--font-family-display);
              background-color: var(--color-button-background);
              color: var(--color-button-text);
              border-radius: var(--card-border-radius);
              text-decoration: none;
              text-align: center;
              border: none;
              transition: background-color 0.3s ease;
          }
        
          .button:hover {
            background-color: var(--color-button-hover);
          }
          `
        ],
        body: html`
          <body>
            <mu-auth provides="slofoodguide:auth">
              <article>
                <slo-food-header></slo-food-header>
                <main class="page">
                <div class="card">
                  <login-form api="/auth/login">
                    <h2 slot="title">Sign in and get tasting!</h3>
                  </login-form>
                  <p class="register">
                    Or did you want to
                    <a href="./register">
                      register as a new user
                    </a>
                    ?
                  </p>
                </div>
                </main>
              </article>
            </mu-auth>
          </body>
        `
      });
    }
  }
  