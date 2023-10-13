import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center"

function Alerts() {
  return (
    <NovuProvider
      subscriberId={"3bb075f3650d4901a0c3a3fcd27f22c0"}
      applicationIdentifier={"HL8PTY_P04lZ"}
    >
      <PopoverNotificationCenter colorScheme="dark">
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  )
}

export default Alerts
