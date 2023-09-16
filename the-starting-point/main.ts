import plays from "./plays";
import invoices from "./invoices";

import { statement } from "./the-starting-point";
import { statement as statement2 } from "./refactoring";

console.log(statement(invoices[0], plays));
console.log("*".repeat(20));
console.log(statement2(invoices[0], plays));
