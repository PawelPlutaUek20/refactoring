type Doc = {
  name: string;
  demand: number;
  price: number;
  producers: Array<unknown>;
};

type ProducerData = {
  cost: number;
  name: string;
  production: number;
};

class Producer {
  private _province: Province;
  private _cost: number;
  private _name: string;
  private _production: number;

  constructor(aProvince: Province, data: ProducerData) {
    this._province = aProvince;
    this._cost = data.cost;
    this._name = data.name;
    this._production = data.production || 0;
  }

  get name() {
    return this._name;
  }

  get cost(): number {
    return this._cost;
  }

  set cost(arg: string) {
    this._cost = parseInt(arg);
  }

  get production(): number {
    return this._production;
  }

  set production(amountStr: string) {
    const amount = parseInt(amountStr);
    const newProduction = Number.isNaN(amount) ? 0 : amount;
    this._province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}

class Province {
  private _name: string;
  private _producers: Array<ProducerData>;
  private _totalProduction: number;
  private _demand: number;
  private _price: number;

  constructor(doc: Doc) {
    this._name = doc.name;
    this._producers = [];
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;

    this._producers.forEach((d) => this.addProducer(new Producer(this, d)));
  }

  public get name(): string {
    return this._name;
  }

  public get producers(): unknown[] {
    return this._producers.slice();
  }

  public get totalProduction(): number {
    return this._totalProduction;
  }

  public set totalProduction(arg: number) {
    this._totalProduction = arg;
  }

  get demand(): number {
    return this._demand;
  }

  set demand(arg: string) {
    this._demand = parseInt(arg);
  }

  get price(): number {
    return this._price;
  }

  set price(arg: string) {
    this._price = parseInt(arg);
  }

  private addProducer(arg: Producer): void {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
}

function sampleProvinceData() {
  return {
    name: "Asia",
    producers: [
      { name: "Byzantium", cost: 10, production: 9 },
      { name: "Attalia", cost: 12, production: 10 },
      { name: "Sinope", cost: 10, production: 6 },
    ],
    demand: 30,
    price: 20,
  };
}
