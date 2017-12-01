import { ConstructorBuilder } from './ConstructorBuilder'
import { SubscriptionDisposalMixin } from '../mixins/SubscriptionDisposalMixin'

/**
 * ConstructorBuilder with SubscriptionDisposalMixin, use as base for view models.
 */
export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {}
