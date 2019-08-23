import {
  DataModelConstructorBuilder,
  ViewModelConstructorBuilder
} from '@profiscience/knockout-contrib'

test("DisposalAggregatorMixin doesn't re-dispose deleted data model", () => {
  const spy = jest.fn()

  class DataModel extends DataModelConstructorBuilder<void> {
    public fetch = async () => ({})
    public dispose() {
      spy()
      super.dispose()
    }
  }
  class ViewModel extends ViewModelConstructorBuilder {
    public data = new DataModel()
  }

  const vm = new ViewModel()

  vm.data.delete()

  vm.dispose()

  expect(spy).toBeCalledTimes(1)
})
