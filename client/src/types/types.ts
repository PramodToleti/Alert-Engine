export interface PolicyData {
  _id?: string
  name: string
  target: string
  org_id: string
  zone_id: string
  site_id: string
  app_level_alert: {
    freq: number
  }
  mail_level_alert: {
    user_role: string
    alert_time: string
    freq: number
    wait_time: number
  }[]
}
