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