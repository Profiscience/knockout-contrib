import {
  DataModelConstructorBuilder,
  ViewModelConstructorBuilder,
} from '@profiscience/knockout-contrib'

test("DisposalAggregatorMixin doesn't re-dispose deleted data model", async () => {
  const spy = jest.fn()

  class DataModel extends DataModelConstructorBuilder {
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

  await vm.data.delete()

  vm.dispose()

  expect(spy).toBeCalledTimes(1)
})
