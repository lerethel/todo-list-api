enum ResourceToken {
  AuthWrongCredentials = "auth.wrong-credentials",
  AuthWrongPassword = "auth.wrong-password",
  UserNoName = "user.no-name",
  UserInvalidEmail = "user.invalid-email",
  UserReservedEmail = "user.reserved-email",
  UserNoPassword = "user.no-password",
  UserShortPassword = "user.short-password",
  UserNoCurrentPassword = "user.no-current-password",
  UserShortCurrentPassword = "user.short-current-password",
  UserNoNewPassword = "user.no-new-password",
  UserShortNewPassword = "user.short-new-password",
  UserPasswordMismatch = "user.password-mismatch",
  TodoNotFound = "todo.not-found",
  TodoNoTitle = "todo.no-title",
  TodoNoDescription = "todo.no-description",
  TodoInvalidId = "todo.invalid-id",
  TodoInvalidPage = "todo.invalid-page",
  TodoInvalidLimit = "todo.invalid-limit",
  TodoInvalidDate = "todo.invalid-date",
  TodoInvalidSort = "todo.invalid-sort",
}

export default ResourceToken;
