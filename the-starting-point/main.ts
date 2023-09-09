import plays from "./plays.json";
import invoices from "./invoices.json";

import { statement } from "./the-starting-point";
import { statement as statement2 } from "./refactoring";

console.log(statement(invoices[0], plays));
console.log("*".repeat(20));
console.log(statement2(invoices[0], plays));
