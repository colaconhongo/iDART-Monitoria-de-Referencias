import { useQuasar } from 'quasar';

export default {
  setup() {
    const $q = useQuasar();

    function alert(
      title,
      message,
      onOKMethod,
      onCancelMethod,
      onDismissMethod
    ) {
      $q.dialog({
        title: title,
        message: message,
      })
        .onOk(() => {
          onOKMethod();
        })
        .onCancel(() => {
          onCancelMethod();
        })
        .onDismiss(() => {
          onDismissMethod();
        });
    }

    function confirm(
      title,
      message,
      onOKFirstMethod,
      onOKSecondMethod,
      onCancelMethod,
      onDismissMethod
    ) {
      $q.dialog({
        title: title,
        message: message,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          onOKFirstMethod();
        })
        .onOk(() => {
          onOKSecondMethod();
        })
        .onCancel(() => {
          onCancelMethod();
        })
        .onDismiss(() => {
          onDismissMethod();
        });
    }

    function prompt(
      title,
      message,
      onOKMethod,
      onCancelMethod,
      onDismissMethod
    ) {
      $q.dialog({
        title: title,
        message: message,
        prompt: {
          model: '',
          type: 'text', // optional
        },
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          onOKMethod(data);
        })
        .onCancel(() => {
          onCancelMethod();
        })
        .onDismiss(() => {
          onDismissMethod();
        });
    }

    return { alert, confirm, prompt };
  },
};
