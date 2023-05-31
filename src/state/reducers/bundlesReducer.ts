import { produce } from 'immer';
import { Action } from '../actions';
import { ActionType } from '../action-types';

interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialState: BundlesState = {};

const reducer = produce(
  (state: BundlesState = initialState, action: Action): void => {
    switch (action.type) {
      case ActionType.BUNDLE_START: {
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          err: '',
        };

        return;
      }
      case ActionType.BUNDLE_COMPLETE: {
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };

        return;
      }

      default: {
        return;
      }
    }
  },
  initialState
);

export default reducer;
