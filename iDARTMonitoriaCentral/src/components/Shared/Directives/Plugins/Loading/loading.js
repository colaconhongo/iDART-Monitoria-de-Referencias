import { useQuasar, QSpinnerGears, QSpinnerFacebook } from 'quasar';

const $q = useQuasar();

export default {
  QSpinnerGearsShow(
    spinnerColor,
    spinnerSize,
    messageColor,
    backgroundColor,
    message
  ) {
    return $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: spinnerColor,
      spinnerSize: spinnerSize,
      messageColor: messageColor,
      backgroundColor: backgroundColor,
      message: message,
    });
  },
  QSpinnerFacebookShow(
    spinnerColor,
    spinnerSize,
    messageColor,
    backgroundColor,
    message
  ) {
    return $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: spinnerColor,
      spinnerSize: spinnerSize,
      messageColor: messageColor,
      backgroundColor: backgroundColor,
      message: message,
    });
  },
  closeLoading() {
    return $q.loading.hide();
  },
};
