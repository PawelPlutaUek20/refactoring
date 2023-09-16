import * as R from "remeda";

import playsData from "./plays";
import invoicesData from "./invoices";

type Invoice = (typeof invoicesData)[number];
type Plays = typeof playsData;

type Customer = Invoice["customer"];
type Performances = Invoice["performances"];
type Performance = Performances[number];

type PlayID = keyof Plays;
type Play = Plays[PlayID];

type EnrichPerformance = Performance & { play: Play } & { amount: number } & {
  volumeCredits: number;
};

type Statement = {
  customer: Customer;
  performances: EnrichPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
};

function statement(invoice: Invoice, plays: Plays): string {
  return renderPlainText(createStatementData(invoice, plays));
}

function htmlStatement(invoice: Invoice, plays: Plays): string {
  return renderHtml(createStatementData(invoice, plays));
}

function renderPlainText(data: Statement): string {
  let result = `Statement for ${data.customer}\n`;

  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience
      } seats)\n`;
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function renderHtml(data: Statement): string {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += "</table>\n";
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function usd(aNumber: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function createPerformanceCalculator(
  aPerformance: Performance,
  aPlay: Play,
): TragedyCalculator | ComedyCalculator {
  switch (aPlay.type) {
    case "tragedy":
      return new TragedyCalculator(aPerformance, aPlay);
    case "comedy":
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
  }
}

class PerformanceCalculator {
  public performance: Performance;
  public play: Play;

  constructor(aPerformance: Performance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  public get amount(): number {
    throw new Error("subclass responsibility");
  }

  public get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  public get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  public get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  public get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createStatementData(invoice: Invoice, plays: Plays): Statement {
  return R.pipe(
    {},
    R.addProp("customer", invoice.customer),
    R.addProp("performances", invoice.performances.map(enrichPerformance)),
    (res) => R.addProp(res, "totalAmount", totalAmount(res)),
    (res) => R.addProp(res, "totalVolumeCredits", totalVolumeCredits(res)),
  );

  function enrichPerformance(aPerformance: Performance): EnrichPerformance {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance),
    );

    return R.pipe(
      aPerformance,
      R.addProp("play", calculator.play),
      R.addProp("amount", calculator.amount),
      R.addProp("volumeCredits", calculator.volumeCredits),
    );
  }

  function playFor(aPerformance: Performance): Play {
    return plays[aPerformance.playID as PlayID];
  }

  function totalAmount(data: Pick<Statement, "performances">): number {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: Pick<Statement, "performances">): number {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

export { statement, htmlStatement };
