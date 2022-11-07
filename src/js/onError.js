export default function onError(error) {
  Notiflix.Notify.failure(`Ooops, ${error}`, {
    timeout: 2000,
  });
}
