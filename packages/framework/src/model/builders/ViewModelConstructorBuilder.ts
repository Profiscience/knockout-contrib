import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { ConstructorBuilder } from './ConstructorBuilder'
import { SubscriptionDisposalMixin } from '../mixins/SubscriptionDisposalMixin'

export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {}
