export class IncompleteClass {
  client: any;
  handlers: any;
  methods: any;
  path: any;
  data: Record<string, string>;

  constructor(
    client: any,
    handlers: any,
    methods: any,
    path: any,
    data: Record<string, string> = {},
  ) {
    this.client = client;
    this.handlers = handlers;
    this.methods = methods;
    this.path = path;
    this.data = data;
  }

  serialize() {
    return this.data;
  }
}
