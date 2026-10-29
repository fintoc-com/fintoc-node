import { ManagerMixin } from '../mixins';
import { LinkIntent } from '../resources/linkIntent';

export class LinkIntentsManager extends ManagerMixin<LinkIntent> {
  static resource = 'link_intent';
  static methods = ['create'];
}
