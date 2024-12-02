import "../build/app.js";

// The user tests should come first since they test authentication
// and authorization, which are used in some of the other tests.
import "./user.test.js";
import "./todo.test.js";
import "./common.test.js";
