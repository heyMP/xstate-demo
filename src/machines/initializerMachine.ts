import { createMachine, assign } from "xstate";

export const initializerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQDYHsBGBDFBZLAxgBYCWAdmAHTkkAuJOJAXuVAMQRoXVkBuaAayoAzMLWIB5YaIBOsAIIFaaGQG0ADAF1EoAA5pYdElx0gAHogDMADgBslAKwB2ACwuAnO-Xvrnh9YAaEABPRABGf0pbACYHAF84oNRMHHxicioaekYWMnYwGRkVSl0ULFphFQBbSlFxIilZBSUVDW0kEH1DehMOiwQbJ0pol1tLV29fd38g0IRY6Mpp9XUHZycHMJ9reMSQZOw8QlJuLIYUZlY2M5zINtMuo17Qfpdo+zHbTy8fP2tLWbhdSLJxhMKWMK2TbWMGrawJPZkNAQOCmA6pY4ZB4GJ5kUz9AC0tkBCAiwzBlnUTksLnBo1sLgSSXQhzSJ0yZCMOVY2O6xjxfUQbxJEXslk2Dhiu2ZKSO6VOEBQYF5uPxiAcPiW-3cMRc6lstkhAJC4Sc7koO1FsQRcSAA */
  id: "initializerMachine",
  tsTypes: {} as import("./initializerMachine.typegen").Typegen0,
  initial: 'initilizing',

  states: {
    initilizing: {
      on: {
        cancel: {
          target: 'cancelled'
        },
        complete: {
          target: 'complete'
        }
      }
    },
    complete: {
      on: {
        next: {
          target: 'done'
        }
      }
    },
    cancelled: {
      on: {
        next: {
          target: 'error'
        }
      }
    },
    done: {
      type: 'final'
    },
    error: {
      type: 'final'
    }
  }
});
