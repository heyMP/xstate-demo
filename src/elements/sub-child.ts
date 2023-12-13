import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { InterpreterFrom } from 'xstate';
import { globalMachine } from "../machines/globalMachine.js";
import { ActorController } from '../lib/xstate-controller.js';
import { observed } from "@patternfly/pfe-core/decorators/observed.js";

@customElement('my-app-sub-child')
export class MyAppChild extends LitElement {
  static styles = css``;

  @observed
  @property({ type: Object })
  actor?: InterpreterFrom<typeof globalMachine>;

  _actorChanged() {
    if (this.actor) {
      new ActorController(this, this.actor);
    }
  }

  render() {
    const state = this.actor?.getSnapshot();
    console.log(this.actor)
    return html`
      Sub Child Name: ${state?.context.user?.name}
    `
  }
}
