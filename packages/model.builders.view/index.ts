import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { SubscriptionDisposalMixin } from '@profiscience/knockout-contrib-model-mixins-subscription-disposal'

/**
 * ConstructorBuilder with SubscriptionDisposalMixin, use as base for view models.
 */
export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {}
