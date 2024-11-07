"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var auth_exports = {};
__export(auth_exports, {
  LoginPage: () => LoginPage
});
module.exports = __toCommonJS(auth_exports);
var import_renderPage = __toESM(require("./renderPage"));
var import_server = require("@calpoly/mustang/server");
class LoginPage {
  render() {
    return (0, import_renderPage.default)({
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
        import_server.css`
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
      body: import_server.html`
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoginPage
});
