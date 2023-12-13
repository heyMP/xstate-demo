import type { ReactiveController, ReactiveControllerHost, ReactiveElement } from "lit";
import { InterpreterFrom, interpret, AnyStateMachine, AnyActorRef, StateFrom, Subscription, InterpreterOptions } from "xstate";
import { PropertyObserverController, PropertyObserverHost } from '@patternfly/pfe-core/controllers/property-observer-controller.js';

export class InterpretController<T extends AnyStateMachine> implements ReactiveController {
  host: ReactiveControllerHost;

  value: InterpreterFrom<AnyStateMachine>;

  constructor(host: ReactiveControllerHost, machine: T, options?: InterpreterOptions) {
    (this.host = host).addController(this);
    this.value = interpret(machine, options ?? {}) as InterpreterFrom<T>;
  }

  hostConnected() {
    this.value.onTransition(() => {
      this.host.requestUpdate();
    }).start();
  }

  hostDisconnected() {
    this.value.stop();
  }
}

export class ActorController<T extends AnyActorRef> implements ReactiveController {
  host: ReactiveControllerHost;

  private sub?: Subscription;

  constructor(host: ReactiveControllerHost, public actor: T, public log?: boolean) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    this.sub = this.actor.subscribe((state) => {
      if (this.log) {
        console.log(state);
      }
      this.host.requestUpdate();
    })
  }

  unsubscribe() {
    this.sub?.unsubscribe();
  }

  hostDisconnected() {
    this.unsubscribe();
    console.log('hostDisconnected')
  }
}

/**
 * Binds a class method to the instance
 */
export function observeActor<T extends ReactiveElement>(target: T, key: string) {
  (target.constructor as typeof ReactiveElement)
    .addInitializer(x => new PropertyObserverController(x));
    observeProperty(target, key as string & keyof T);
}

function observeProperty<T extends ReactiveElement>(
  proto: T,
  key: string & keyof T,
) {
  const descriptor = Object.getOwnPropertyDescriptor(proto, key);
  Object.defineProperty(proto, key, {
    ...descriptor,
    configurable: true,
    set(this: PropertyObserverHost<T>, newVal: T[keyof T] extends AnyActorRef ? AnyActorRef : undefined) {
      const oldVal = this[key as keyof T];
      // first, call any pre-existing setters, e.g. `@property`
      descriptor?.set?.call(this, newVal);
      if (oldVal !== newVal) {
        // @ts-ignore
        this.controllerRef = this[`_${(key as string)}ActionController`];
        // @ts-ignore
        this.controllerRef?.unsubscribe?.();
        // @ts-ignore
        this.controllerRef = new ActorController(this, this[key]);
      }
    },
  });
}
     // * const myDecorator = (target: typeof ReactiveElement, key: string) => {
     // *   target.addInitializer((instance: ReactiveElement) => {
     // *     // This is run during construction of the element
     // *     new MyController(instance);
     // *   });
     // * }

