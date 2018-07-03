import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { DisposalAggregatorMixin } from '@profiscience/knockout-contrib-model-mixins-disposal-aggregator'
import { SubscriptionDisposalMixin } from '@profiscience/knockout-contrib-model-mixins-subscription-disposal'

/**
 * ConstructorBuilder with SubscriptionDisposalMixin, use as base for view models.
 */
export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(
  SubscriptionDisposalMixin
).Mixin(DisposalAggregatorMixin) {}
