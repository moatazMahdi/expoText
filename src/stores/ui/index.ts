import {
  Stores,
} from '..';
import {
  LocalizationStore,
} from './localization';
import {
  OnboardingStore,
} from './obboarding';

export class UIStores {
  localization = new LocalizationStore(this);

  onboarding = new OnboardingStore(this);

  constructor(
    public parent: Stores,
  ) { }

  hydrate() {
    return Promise.all([
      this.localization.hydrate(),
      this.onboarding.hydrate(),
    ]);
  }
}
