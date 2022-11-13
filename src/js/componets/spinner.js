import { refs } from "../refs/refs";

export function spinner() {
    refs.spinner.classList.toggle('is-hiden');
}