import { View } from '@calpoly/mustang';
import { Guest } from 'server/models';
import { html, css } from 'lit';
import { Msg } from "../messages";
import { Model } from "../model";
import { state } from "lit/decorators.js";

type GuestEditMsg = 'submit' | 'update-field';

export class GuestEdit extends View<Model, Msg> {
    
    @state ()
    guest?: Guest
    

    render() {
    
    return html`
      <section class="edit">
        <h2>Edit Profile</h2>
        <mu-form @mu-form:submit=${this.handleSubmit}>
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            .value="${guest?.username || ''}" 
            @input=${this.handleInputChange} 
          />
          <label for="nickname">Nickname:</label>
          <input 
            type="text" 
            id="nickname" 
            name="nickname" 
            .value="${guest?.nickname || ''}" 
            @input=${this.handleInputChange} 
          />
          <label for="partysize">Party Size:</label>
          <input 
            type="number" 
            id="partysize" 
            name="partysize" 
            .value="${guest?.partysize || ''}" 
            @input=${this.handleInputChange} 
          />
          <button type="submit">Save</button>
        </mu-form>
      </section>
    `;
  }

  _handleSubmit(event: Form.SubmitEvent<Guest>) {
    this.dispatchMessage([
      "guest/save",
      {
        guestid: this.username, // Replace with your guest's unique identifier
        guest: event.detail, // The form data that was submitted
        onSuccess: () => {
          // Redirect the user after successfully saving the data
          History.dispatch(this, "history/navigate", {
            href: `/app/guest/${this.state.guest.id}`, // Navigate to the updated profile view
          });
        },
        onFailure: (error: Error) => {
          // Log an error if the save fails
          console.error("ERROR:", error);
        },
      },
    ]);
  }

}