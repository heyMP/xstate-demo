import { createMachine, assign } from "xstate";
import { trials } from "./mocks/trials.js";

export const initializerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQDYHsBGBDFBZLAxgBYCWAdmAHTkkAuJOJAXuVAMQRoXVkBuaAayoAzMLWIB5YaIBOsAIIFaaGQG0ADAF1EoAA5pYdElx0gAHogDMADgBslAKwB2ACwuAnO-Xvrnh9YAaEABPRABGf0pbACYHAF84oNRMHHxicioaekYWMnYwGRkVSl0ULFphFQBbSlFxIilZBSUVDW0kEH1DehMOiwQbJ0pol1tLV29fd38g0IRY6Mpp9XUHZycHMJ9reMSQZOw8QlJuLIYUZlY2M5zINtMuo17Qfpdo+zHbTy8fP2tLWbhdSLJxhMKWMK2TbWMGrawJPZkNAQOCmA6pY4ZB4GJ5kUz9AC0tkBCAiwzBlnUTksLnBo1sLgSSXQhzSJ0yZCMOVY2O6xjxfUQbxJEXslk2Dhiu2ZKSO6VOEBQYF5uPxiAcPiW-3cMRc6lstkhAJC4Sc7koO1FsQRcSAA */
  id: "initializerMachine",
  tsTypes: {} as import("./initializerMachine.typegen").Typegen0,
  initial: 'fetchUserOffers',
  schema: {
    context: {} as {
      offers: Array<unknown>
    },
    events: {} as
      | { type: 'FETCHED_USER_OFFERS' }
      | { type: 'FETCHED_OFFER_DATA' }
      | { type: 'DEV_FETCHED_EMPTY_OFFER_DATA' }
      | { type: 'DEV_FETCHED_ACTIVE_OFFER_DATA' }
      | { type: 'DEV_FETCHED_EXPIRED_OFFER_DATA' }
  },
  context: {
    offers: []
  },
  on: {
    'DEV_FETCHED_EMPTY_OFFER_DATA': {
      actions: assign({
        offers: []
      }),
      target: 'final'
    },
    'DEV_FETCHED_ACTIVE_OFFER_DATA': {
      actions: assign({
        offers: trials.filter(i => i.status === 'active')
      }),
      target: 'final'
    },
    'DEV_FETCHED_EXPIRED_OFFER_DATA': {
      actions: assign({
        offers: trials.filter(i => i.status === 'expired')
      }),
      target: 'final'
    }
  },
  states: {
    'fetchUserOffers': {
      invoke: {
        src: 'fetchUserOffers',
        onDone: {
          target: 'fetchOfferData'
        }
      }
    },
    'fetchOfferData': {
      invoke: {
        src: 'fetchOfferData',
        onDone: {
          actions: assign({
            offers: (_, event) => event.data
          }),
          target: 'final',
        }
      }
    },
    'final': {
      type: 'final',
      data: (context) => context
    }
  }
}, {
  services: {
    fetchUserOffers: () => new Promise((res) => { res(null) }),
    fetchOfferData: () => () => new Promise(res => { res(trials) }),
  }
});
