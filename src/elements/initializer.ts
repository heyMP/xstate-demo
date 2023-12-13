import { LitElement, css, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import { property } from "lit/decorators/property.js";
import { InterpreterFrom } from 'xstate';
import { ref, createRef } from 'lit/directives/ref.js';
import { observed } from '@patternfly/pfe-core/decorators/observed.js';
import { ActorController, observeActor } from '../lib/xstate-controller.js';
import { SendEvent } from '../lib/events.js';
import { initializerMachine } from "../machines/initializerMachine.js";
import './sub-child.js';

@customElement('my-app-initializer')
export class MyAppChild extends LitElement {
  static styles = css``;

  @observed
  @property({ type: Object })
  actor?: InterpreterFrom<typeof initializerMachine>;

  _actorChanged() {
    if (this.actor) {
      new ActorController(this, this.actor);
    }
  }

  render() {
    const state = this.actor?.getSnapshot();
    const ret: Array<TemplateResult> = [];
    if (state?.matches('initilizing')) {
      ret.push(html`loading...`)
    }
    else if (state?.matches('complete')) {
      ret.push(html`complete!`)
    }
    else if (state?.matches('cancelled')) {
      ret.push(html`an error happened`)
    }
    else {
      ret.push(html`no actor detected`)
    }

    return ret;
  }
}
