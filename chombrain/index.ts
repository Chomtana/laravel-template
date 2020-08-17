import Table from './lib/table';
import Migration from './lib/migration';

let $ = new Migration()

$.table("users", (T: Table) => {
  T.column("otp_id").linkTo("otp")
})

$.table("otp", (T: Table) => {
  T.column("otp_secret", "string").nullable();
  T.column("otp_key", "string")
})


$.render()
