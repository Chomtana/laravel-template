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

function placeModel(T: Table) {
  T.column("name", "string")
  T.column("picture", "text").nullable()
  T.column("avatar", "text").nullable()
  T.column("status", "string").default("active")
  T.column("position", "json")
}

$.table("building", (T: Table) => {
  placeModel(T)

  T.column("is_two_level", "bool")
  T.column("owner").linkTo("users")
})

$.table("floor", (T: Table) => {
  placeModel(T)

  T.column("building_id").linkTo("building")
})

$.table("room", (T: Table) => {
  placeModel(T)

  T.column("floor_id").linkTo("floor")
  T.column("building_id").linkTo("building")
})

$.table("device_detail", (T: Table) => {

})

$.render()
