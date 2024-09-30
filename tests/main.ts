import "../build/server/app.js";

// The user tests should come first since they test authentication
// and authorization, which are used in some of the other tests.
import "./server/user.test.js";
import "./server/todo.test.js";
import "./server/common.test.js";
