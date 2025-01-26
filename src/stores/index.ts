import {configure} from 'mobx';
import {UIStores} from './ui/index';
import {BackendStores} from './backend';

configure({
  enforceActions: 'never',
});

export class Stores {
  backend = new BackendStores(this);

  ui = new UIStores(this);

  async hydrate() {
    await Promise.all([this.backend.hydrate(), this.ui.hydrate()]);
  }
}
