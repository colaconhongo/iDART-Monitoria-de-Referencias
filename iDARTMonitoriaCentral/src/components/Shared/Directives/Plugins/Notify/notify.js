import { useQuasar, Notify } from 'quasar';

const $q = useQuasar();

// type: ['positive', 'negative', 'info', 'ongoing']
export function ShowNotificationByType(type, message) {
  return $q.notify({
    type: type,
    message: message,
  });
}

export const ShowNotification = (
  icon,
  message,
  type,
  progress,
  timeout,
  position,
  color,
  textColor,
  classes
) => {
  return Notify.create({
    icon: icon,
    message: message,
    type: type,
    progress: progress,
    timeout: timeout,
    position: position,
    color: color,
    textColor: textColor,
    classes: classes,
  });
};

// export function ShowNotification(
//   icon: string,
//   message: string,
//   type: string,
//   progress: boolean,
//   timeout: number,
//   position: string,
//   color: string,
//   textColor: string,
//   classes: string
// ) {
//   return Notify.create({
//     icon: icon,
//     message: message,
//     type: type,
//     progress: progress,
//     timeout: timeout,
//     position: position,
//     color: color,
//     textColor: textColor,
//     classes: classes,
//   });
// }
