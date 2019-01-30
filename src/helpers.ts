import { ActionContext, ActionTree, MutationTree, Store } from 'vuex'
import { ImmutableFSA, ActionCreator } from './types'

/**
 * Definition for annotating type parameter
 */
export type PayloadType<T> = T extends ActionCreator<infer R> ? R : never
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

/**
 * Enhanced type definition for Vuex ActionHandler
 */
export type ActionHandler<S, R, P> = (
  this: Store<R>,
  injectee: ActionContext<S, R>,
  payload: P,
) => any

/**
 * Enhanced type definition for Vuex ActionObject
 */
export type ActionObject<S, R, P> = {
  root?: boolean;
  handler: ActionHandler<S, R, P>;
}

/**
 * Enhanced type definition for Vuex Action
 */
export type Action<S, R, P> = ActionHandler<S, R, P> | ActionObject<S, R, P>

/**
 * Enhanced type definition for Vuex Mutation
 */
export type Mutation<S, P> = (this: Store<S>, state: S, payload: P) => void

/**
 * Create action handler with type annotation
 */
export function action<S, R, A extends ActionCreator<any>>(
  actionCreator: A,
  action: Action<S, R, ImmutableFSA<PayloadType<A>>>,
): ActionTree<S, R> {
  return {
    [actionCreator.type]: action,
  }
}

/**
 * Create action handler with type annotation.
 * That handler will proxy action object to mutation.
 */
export function actionToMutation<S, R, A extends ActionCreator<any>>(actionCreator: A): ActionTree<S, R> {
  return {
    [actionCreator.type](context: ActionContext<S, R>, action: ImmutableFSA<PayloadType<A>>) {
      context.commit(action)
    },
  }
}

/**
 * Create mutation handler with type annotation
 */
export function mutation<S, A extends ActionCreator<any>>(
  actionCreator: A,
  mutation: Mutation<S, ImmutableFSA<PayloadType<A>>>,
): MutationTree<S> {
  return {
    [actionCreator.type]: mutation,
  }
}

/**
 * Combine action handlers as a ActionTree
 */
export function combineAction<S, R>(
  ...actions: Array<ActionTree<S, R>>
): ActionTree<S, R> {
  return actions.reduce((res, v) => Object.assign(res, v), {})
}

/**
 * Combine mutation handlers as a ActionTree
 */
export function combineMutation<S>(
  ...mutations: Array<MutationTree<S>>
): MutationTree<S> {
  return mutations.reduce((res, v) => Object.assign(res, v), {})
}
