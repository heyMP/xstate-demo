import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { InterpreterFrom } from 'xstate';
import { ref, createRef } from 'lit/directives/ref.js';
import { observed } from '@patternfly/pfe-core/decorators/observed.js';
import { ActorController, observeActor } from '../lib/xstate-controller.js';
import { SendEvent } from '../lib/events.js';
import { globalMachine } from "../machines/globalMachine.js";
import './sub-child.js';

@customElement('my-app-child')
export class MyAppChild extends LitElement {
  static styles = css``;

  #inputRef = createRef<HTMLInputElement>();

  @observed
  @property({ type: Object })
  actor?: InterpreterFrom<typeof globalMachine>;

  _actorChanged() {
    if (this.actor) {
      new ActorController(this, this.actor);
    }
  }

  sendControllerEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      const user = { name: value };
      this.actor?.send({ type: 'UPDATE_USER', payload: { user } });
    }
  }

  sendCustomEvent() {
    const value = this.#inputRef.value?.value;
    if (value) {
      this.dispatchEvent(new SendEvent({ type: 'UPDATE_USER', payload: { user: { name: value } } }))
    }
  }

  render() {
    const state = this.actor?.getSnapshot();
    return html`
      User name: ${state?.context.user?.name}
      <input ${ref(this.#inputRef)} value=${state?.context?.user?.name} />
      <button @click=${this.sendControllerEvent}>Update using controller event</button>
      <button @click=${this.sendCustomEvent}>Update using custom event</button>
      <my-app-sub-child .actor=${this.actor}></my-app-sub-child>
    `
  }
}
