export interface Action {
  type: string,
  payload: any,
}

export function createAction(type: string, payload = null) : Action {
  return {
    type,
    payload,
  }
}

export function createActionTypes(prefix: string, types: Array<string>) : any {
  return types.reduce((prev, item) => Object.assign(prev, { [item]:`@${prefix}/${item}` }), {});
}

export const bindActionCreator = (actionService, type) => payload => {
  actionService.dispatch(createAction(type, payload));
}