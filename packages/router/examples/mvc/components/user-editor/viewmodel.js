import { Router } from '@profiscience/knockout-contrib-router'

export default class UserEditorComponentViewModel {
  constructor({ user }) {
    this.user = user
  }

  save() {
    this.user.save()
    Router.update(`/${this.user.id}`)
  }
}
