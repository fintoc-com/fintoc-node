export class ExampleClass {
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

  static async _build(
    client: any,
    handlers: any,
    methods: any,
    path: any,
    data: Record<string, string> = {},
  ) {
    return new this(client, handlers, methods, path, data);
  }

  serialize() {
    return this.data;
  }
}
