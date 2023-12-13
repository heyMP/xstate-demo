import { LitElement, TemplateResult, html, css, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { interpret } from 'xstate';
import { ActorController } from './lib/xstate-controller.js';
import { globalMachine } from "./machines/globalMachine.js";
import { SendEvent } from './lib/events.js';
import './elements/child.js';
import './elements/initializer.js';

const actor = interpret(globalMachine, { devTools: true }).start();

@customElement('my-app')
export class MyApp extends LitElement {
  static styles = css``;

  public actorController = new ActorController(this, actor);

  // updateActor(actor: InterpreterFrom<typeof globalMachine>) {
  //   this.actorController = new ActorController(this, actor);
  // }

  render() {
    // eslint-disable-next-line no-shadow
    const state = actor.getSnapshot();

    // console.log(state);

    const ret: Array<TemplateResult> = [];
    if (state?.matches("initializing")) {
      const actor = state.children.initializerActor;
      ret.push(html`
        <my-app-initializer .actor=${actor}></my-app-initializer>
      `);
    }
    else if (state?.matches("idle")) {
      ret.push(html`
        ...Idle
        <div>Username: ${state?.context.user.name}</div>
        <div><my-app-child .actor=${actor}></my-app-child></div>
      `);
    }
    else if (state?.matches("error")) {
      ret.push(html`
        ERROR 🚨
      `);
    }

    return ret;
  }

  /**
   * Example
   *
   * The following code is an example of how we can use
   * DOM events to update the state of the controller.
   * This is an alternative to using the send() method
   * using the controller.
   */
  connectedCallback(): void {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.addEventListener('SEND', this.sendEventHandler);
  };

  disconnectedCallback(): void {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    this.removeEventListener('SEND', this.sendEventHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  sendEventHandler(e: Event) {
    if (e instanceof SendEvent) {
      actor.send(e.event);
    }
  }
}
