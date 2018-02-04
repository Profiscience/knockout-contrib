import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { SubscriptionDisposalMixin } from '@profiscience/knockout-contrib-model-mixins-subscription-disposal'

/**
 * ConstructorBuilder with SubscriptionDisposalMixin, use as base for view models.
 */
export class ViewModelConstructorBuilder extends ConstructorBuilder.Mixin(SubscriptionDisposalMixin) {
  public dispose() {
    const m = this as any
    Object
      .getOwnPropertyNames(m)
      .forEach((k) => {
        if (m[k] && typeof m[k].dispose === 'function') m[k].dispose()
      })
    super.dispose()
  }
}
