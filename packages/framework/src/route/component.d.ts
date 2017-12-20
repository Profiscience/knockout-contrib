import { ViewModelConstructorBuilder } from '../model/builders/ViewModelConstructorBuilder'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    viewModel?: ViewModelConstructorBuilder
  }
}