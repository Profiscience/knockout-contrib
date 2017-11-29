import { ConstructorBuilder } from './ConstructorBuilder'
import { SubscriptionDisposalMixin } from '../model-mixins/SubscriptionDisposalMixin'

export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {}
