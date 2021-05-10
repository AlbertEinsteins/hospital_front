const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
  ? { status: { logIn: true }, user }
  : { status: { logIn: false }, user: null }

export default function () {
  return initialState
}
