import {
  setup,
  createActor,
} from 'xstate';

const StateName = Object.freeze({
  INITIAL: 'INITIAL',
});
const Signals = Object.freeze({
  CHANGE_AUTH_MODE: 'CHANGE_AUTH_MODE',
  LOGIN_CHANGED: 'LOGIN_CHANGED',
});

const buildMachine = (api = null, context = null) => setup(api).createMachine({
  id: 'AuthZ',
  context,
  initial: StateName.INITIAL,
  states: {
    [StateName.INITIAL]: {
      on: {
        [Signals.CHANGE_AUTH_MODE]: {

        },
      }
    },
  },
});

export const AuthZFSM = (api = null, context = null) => createActor(buildMachine(api, context), {
  inspect: api.inspect,
});

export const AuthZSignals = Signals;
