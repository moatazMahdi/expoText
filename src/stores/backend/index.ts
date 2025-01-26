import { Connections } from 'connections';
import { Stores } from '..';
import { AuthStore } from './auth';
import { UserStore } from './users';
import { ArticleStore } from './articles';
import { ProductsStore } from './products';
import { StaticTextStore } from './staticTexts';
import { ProgramStore } from './programs';
import { GeneralStore } from './general';
import { PaymentStore } from './payment';
import { WalletStore } from './wallet';
import { InstantApprovalStore } from './instantApproval';
import { bookingAuthStore } from './bookingAuth';

export class BackendStores {
  connections: Connections;

  auth = new AuthStore(this);

  users = new UserStore(this);

  articles = new ArticleStore(this);

  staticTexts = new StaticTextStore(this);

  products = new ProductsStore(this);

  programs = new ProgramStore(this);

  general = new GeneralStore(this);

  payment = new PaymentStore(this);

  wallet = new WalletStore(this);

  instantApproval = new InstantApprovalStore(this);

  bookingAuth = new bookingAuthStore(this);

  constructor(public parent: Stores) { }

  hydrate() {
    return Promise.all([
      this.auth.hydrate(),
      this.users.hydrate(),
      this.articles.hydrate(),
      this.staticTexts.hydrate(),
      this.general.hydrate(),
      this.wallet.hydrate(),
      this.payment.hydrate(),
      // this.programs.hydrate(),
      this.products.hydrate(),
    ]);
  }

  updateConnections(connections: Connections) {
    this.connections = connections;
    this.auth.connections = connections;
    this.users.connections = connections;
    this.articles.connections = connections;
    this.staticTexts.connections = connections;
    this.products.connections = connections;
    this.programs.connections = connections;
    this.general.connections = connections;
    this.payment.connections = connections;
    this.wallet.connections = connections;
    this.instantApproval.connections = connections;
    this.bookingAuth.connections = connections;
  }
}
